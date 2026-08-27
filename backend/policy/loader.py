"""
policy/loader.py
Loads and validates versioned MPLADS policy definitions from YAML configurations.
"""
from __future__ import annotations
from datetime import date, datetime
from pathlib import Path
from typing import Dict, List, Optional
import yaml

from app.utils.logging import get_logger
from policy.models import PolicyRule, PolicyVersion

logger = get_logger("policy_loader")


class PolicyLoader:
    """
    Scans and parses policy YAML configuration files into PolicyVersion objects.
    Maintains an in-memory cache indexed by (policy_id, version).
    """

    def __init__(self, config_dir: Optional[str] = None):
        if config_dir is None:
            # Default to backend/configs/policies relative to this file
            base_dir = Path(__file__).resolve().parent.parent
            self.config_dir = base_dir / "configs" / "policies"
        else:
            self.config_dir = Path(config_dir)

        self._policies: Dict[str, List[PolicyVersion]] = {}
        self.load_all()

    def load_all(self) -> None:
        """Loads all YAML files from the policy directory."""
        if not self.config_dir.exists():
            logger.warning("policy_loader.dir_not_found", path=str(self.config_dir))
            return

        self._policies.clear()
        yaml_files = list(self.config_dir.glob("*.yaml")) + list(self.config_dir.glob("*.yml"))
        
        for file_path in yaml_files:
            try:
                version_obj = self._parse_file(file_path)
                if version_obj:
                    pid = version_obj.policy_id
                    if pid not in self._policies:
                        self._policies[pid] = []
                    self._policies[pid].append(version_obj)
                    logger.info(
                        "policy_loader.loaded",
                        policy_id=pid,
                        version=version_obj.version,
                        file=file_path.name,
                    )
            except Exception as e:
                logger.error("policy_loader.parse_error", file=str(file_path), error=str(e))

        # Sort versions chronologically by effective_from
        for pid in self._policies:
            self._policies[pid].sort(key=lambda pv: pv.effective_from)

    def _parse_file(self, file_path: Path) -> Optional[PolicyVersion]:
        with open(file_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            
        if not data:
            return None

        rules = []
        for r_dict in data.get("rules", []):
            rule = PolicyRule(
                rule_id=r_dict["rule_id"],
                name=r_dict["name"],
                description=r_dict.get("description", ""),
                category=r_dict.get("category", "GENERAL"),
                severity=r_dict.get("severity", "MEDIUM"),
                condition_expression=r_dict.get("condition_expression", "True"),
                remediation_guidance=r_dict.get("remediation_guidance", ""),
                applicable_categories=r_dict.get("applicable_categories", ["ALL"]),
                min_amount=r_dict.get("min_amount"),
                max_amount=r_dict.get("max_amount"),
                citation_section=r_dict.get("citation_section"),
                parameters=r_dict.get("parameters", {}),
            )
            rules.append(rule)

        eff_from = self._parse_date(data.get("effective_from", "2000-01-01"))
        eff_to = self._parse_date(data.get("effective_to")) if data.get("effective_to") else None

        return PolicyVersion(
            policy_id=data["policy_id"],
            version=str(data["version"]),
            effective_from=eff_from,
            effective_to=eff_to,
            title=data.get("title", ""),
            source_document=data.get("source_document", ""),
            rules=rules,
        )

    def get_version(self, policy_id: str, version: str) -> Optional[PolicyVersion]:
        """Fetch a specific policy version by ID and version string."""
        versions = self._policies.get(policy_id, [])
        for v in versions:
            if v.version == version:
                return v
        return None

    def resolve_for_date(self, policy_id: str, target_date: date) -> Optional[PolicyVersion]:
        """
        Resolves the historically applicable policy version based on project date.
        Finds the version where effective_from <= target_date <= (effective_to or today).
        """
        versions = self._policies.get(policy_id, [])
        if not versions:
            return None

        for v in versions:
            if v.effective_from <= target_date:
                if v.effective_to is None or target_date <= v.effective_to:
                    return v
        # Fallback to the latest version
        return versions[-1]

    @staticmethod
    def _parse_date(val: Any) -> date:
        if isinstance(val, date):
            return val
        if isinstance(val, datetime):
            return val.date()
        if isinstance(val, str):
            return datetime.strptime(val, "%Y-%m-%d").date()
        return date(2000, 1, 1)
