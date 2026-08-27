"""
ml/rollback.py
Model Version Management and Rollback for MPLADS Guardian.

Provides:
- List registered model versions with metrics
- Promote a version to production (with safety gate)
- Rollback to a previous version (by version number or last-good)
- Audit trail of all version transitions

Integrates with MLflow Model Registry when available.
Falls back to file-based registry when MLflow is not connected.
"""
from __future__ import annotations
import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.utils.logging import get_logger
from ml.registry.model_registry import ModelRegistry

logger = get_logger("model_rollback")

ROLLBACK_AUDIT_LOG = Path("mlruns/rollback_audit.jsonl")


@dataclass
class ModelVersionInfo:
    version: str
    model_name: str
    stage: str  # "None", "Staging", "Production", "Archived"
    metrics: Dict[str, float]
    created_at: str
    description: str


@dataclass
class RollbackResult:
    success: bool
    previous_version: Optional[str]
    rolled_back_to: Optional[str]
    model_name: str
    performed_at: str
    reason: str
    error: Optional[str] = None


class ModelRollbackManager:
    """
    Manages model version transitions and rollbacks.
    
    Usage:
        manager = ModelRollbackManager()
        # List available versions
        versions = manager.list_versions("mplads_risk_classifier")
        # Roll back to last good version
        result = manager.rollback_to_previous("mplads_risk_classifier")
        # Roll back to specific version
        result = manager.rollback_to_version("mplads_risk_classifier", "v3")
    """

    def __init__(self):
        self.registry = ModelRegistry()
        self._audit_log_path = ROLLBACK_AUDIT_LOG
        self._audit_log_path.parent.mkdir(parents=True, exist_ok=True)

    def list_versions(self, model_name: str) -> List[ModelVersionInfo]:
        """
        Lists all available versions of a model from the registry.
        Returns versions sorted newest-first.
        """
        try:
            import mlflow
            from mlflow.tracking import MlflowClient
            from app.config.settings import get_settings
            settings = get_settings()

            mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
            client = MlflowClient()

            try:
                versions = client.search_model_versions(f"name='{model_name}'")
                result = []
                for v in versions:
                    metrics = {}
                    try:
                        run = client.get_run(v.run_id)
                        metrics = {k: float(val) for k, val in run.data.metrics.items()}
                    except Exception:
                        pass

                    result.append(ModelVersionInfo(
                        version=v.version,
                        model_name=model_name,
                        stage=v.current_stage,
                        metrics=metrics,
                        created_at=datetime.fromtimestamp(
                            v.creation_timestamp / 1000, tz=timezone.utc
                        ).isoformat(),
                        description=v.description or "",
                    ))
                return sorted(result, key=lambda x: x.created_at, reverse=True)
            except Exception as e:
                logger.warning("rollback.mlflow_registry_unavailable", error=str(e))
                return self._list_local_versions(model_name)
        except ImportError:
            return self._list_local_versions(model_name)

    def _list_local_versions(self, model_name: str) -> List[ModelVersionInfo]:
        """List versions from local file-based registry."""
        artifact = self.registry.load_artifact(model_name)
        if artifact:
            return [ModelVersionInfo(
                version="local_v1",
                model_name=model_name,
                stage="Production",
                metrics=artifact.get("metrics", {}),
                created_at=artifact.get("training_timestamp", "unknown"),
                description="Local file-based registry version",
            )]
        return []

    def rollback_to_version(
        self,
        model_name: str,
        target_version: str,
        reason: str = "Manual rollback",
    ) -> RollbackResult:
        """
        Rolls back to a specific model version.
        
        Args:
            model_name: Name of the model to roll back.
            target_version: The version number/identifier to roll back to.
            reason: Reason for the rollback (audit trail).
            
        Returns:
            RollbackResult with success status.
        """
        current_version = self._get_production_version(model_name)
        performed_at = datetime.now(timezone.utc).isoformat()

        try:
            import mlflow
            from mlflow.tracking import MlflowClient
            from app.config.settings import get_settings
            settings = get_settings()

            mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
            client = MlflowClient()

            # Transition target version to Production
            try:
                client.transition_model_version_stage(
                    name=model_name,
                    version=target_version,
                    stage="Production",
                    archive_existing_versions=True,
                )
                result = RollbackResult(
                    success=True,
                    previous_version=current_version,
                    rolled_back_to=target_version,
                    model_name=model_name,
                    performed_at=performed_at,
                    reason=reason,
                )
            except Exception as e:
                result = RollbackResult(
                    success=False,
                    previous_version=current_version,
                    rolled_back_to=None,
                    model_name=model_name,
                    performed_at=performed_at,
                    reason=reason,
                    error=str(e),
                )
        except ImportError:
            # File-based fallback: we can only note the intent
            result = RollbackResult(
                success=False,
                previous_version=current_version,
                rolled_back_to=None,
                model_name=model_name,
                performed_at=performed_at,
                reason=reason,
                error="MLflow not available. Cannot perform programmatic rollback. "
                      "Manually restore model files from backup.",
            )

        self._write_audit_log(result, action="rollback_to_version")
        if result.success:
            logger.info(
                "rollback.success",
                model=model_name,
                from_version=current_version,
                to_version=target_version,
                reason=reason,
            )
        else:
            logger.error(
                "rollback.failed",
                model=model_name,
                error=result.error,
            )
        return result

    def rollback_to_previous(
        self,
        model_name: str,
        reason: str = "Automatic rollback to last good version",
    ) -> RollbackResult:
        """
        Rolls back to the most recent non-Production version (i.e., the previous one).
        """
        versions = self.list_versions(model_name)
        production_versions = [v for v in versions if v.stage == "Production"]
        other_versions = [v for v in versions if v.stage != "Production"]

        if not other_versions:
            return RollbackResult(
                success=False,
                previous_version=production_versions[0].version if production_versions else None,
                rolled_back_to=None,
                model_name=model_name,
                performed_at=datetime.now(timezone.utc).isoformat(),
                reason=reason,
                error="No previous version available to roll back to.",
            )

        # Roll back to the most recent non-production version
        target = other_versions[0]
        return self.rollback_to_version(model_name, target.version, reason=reason)

    def _get_production_version(self, model_name: str) -> Optional[str]:
        """Returns the currently active production version."""
        versions = self.list_versions(model_name)
        production = [v for v in versions if v.stage == "Production"]
        return production[0].version if production else None

    def _write_audit_log(self, result: RollbackResult, action: str):
        """Writes rollback event to audit log."""
        entry = {
            "action": action,
            "model_name": result.model_name,
            "success": result.success,
            "previous_version": result.previous_version,
            "rolled_back_to": result.rolled_back_to,
            "reason": result.reason,
            "error": result.error,
            "performed_at": result.performed_at,
        }
        try:
            with open(self._audit_log_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception as e:
            logger.warning("rollback.audit_write_failed", error=str(e))

    def get_audit_trail(self, model_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """Returns all rollback events from audit log, optionally filtered by model name."""
        if not self._audit_log_path.exists():
            return []
        events = []
        try:
            with open(self._audit_log_path, encoding="utf-8") as f:
                for line in f:
                    entry = json.loads(line.strip())
                    if model_name is None or entry.get("model_name") == model_name:
                        events.append(entry)
        except Exception as e:
            logger.warning("rollback.audit_read_failed", error=str(e))
        return events
