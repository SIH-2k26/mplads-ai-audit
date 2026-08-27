"""
policy/engine.py
Versioned Policy Engine for statutory MPLADS guideline compliance checking.
"""
from __future__ import annotations
from datetime import date, datetime, timezone
from typing import Any, Dict, Optional

from app.utils.logging import get_logger
from models.digital_twin import ProjectDigitalTwin
from policy.loader import PolicyLoader
from policy.models import (
    PolicyEvaluationResult,
    PolicyRule,
    PolicyVersion,
    RuleEvaluationResult,
    RuleEvaluationStatus,
)

logger = get_logger("policy_engine")


class PolicyEngine:
    """
    Executes versioned statutory policy rules against ProjectDigitalTwin models.
    Guarantees that historical projects are evaluated under the historically applicable rules.
    """

    def __init__(self, loader: Optional[PolicyLoader] = None, default_policy_id: str = "MPLADS_GUIDELINES"):
        self.loader = loader or PolicyLoader()
        self.default_policy_id = default_policy_id

    def evaluate(
        self,
        twin: ProjectDigitalTwin,
        policy_id: Optional[str] = None,
        override_version: Optional[str] = None,
    ) -> PolicyEvaluationResult:
        """
        Evaluates applicable policy rules for a given digital twin.
        """
        pid = policy_id or self.default_policy_id
        
        # 1. Resolve Policy Version
        if override_version:
            version_obj = self.loader.get_version(pid, override_version)
        else:
            target_date = self._determine_project_date(twin)
            version_obj = self.loader.resolve_for_date(pid, target_date)

        if not version_obj:
            logger.warning("policy_engine.no_version_found", policy_id=pid, project_id=twin.project_id)
            return PolicyEvaluationResult(
                policy_id=pid,
                policy_version="UNKNOWN",
                project_id=twin.project_id,
                evaluated_at=datetime.now(timezone.utc).isoformat(),
                overall_status=RuleEvaluationStatus.INSUFFICIENT_EVIDENCE,
            )

        # 2. Build Evaluation Context
        eval_context = self._build_context(twin)

        # 3. Evaluate each rule
        results: list[RuleEvaluationResult] = []
        passed_count = 0
        failed_count = 0
        warned_count = 0
        na_count = 0

        for rule in version_obj.rules:
            res = self._evaluate_rule(rule, twin, eval_context)
            results.append(res)
            
            if res.status == RuleEvaluationStatus.PASS:
                passed_count += 1
            elif res.status == RuleEvaluationStatus.FAIL:
                failed_count += 1
            elif res.status == RuleEvaluationStatus.WARNING:
                warned_count += 1
            elif res.status == RuleEvaluationStatus.NOT_APPLICABLE:
                na_count += 1

        # 4. Determine overall status
        if failed_count > 0:
            overall = RuleEvaluationStatus.FAIL
        elif warned_count > 0:
            overall = RuleEvaluationStatus.WARNING
        else:
            overall = RuleEvaluationStatus.PASS

        return PolicyEvaluationResult(
            policy_id=version_obj.policy_id,
            policy_version=version_obj.version,
            project_id=twin.project_id,
            evaluated_at=datetime.now(timezone.utc).isoformat(),
            overall_status=overall,
            rule_results=results,
            rules_passed=passed_count,
            rules_failed=failed_count,
            rules_warned=warned_count,
            rules_not_applicable=na_count,
        )

    def _determine_project_date(self, twin: ProjectDigitalTwin) -> date:
        if hasattr(twin, "sanction") and twin.sanction and twin.sanction.sanction_date:
            return twin.sanction.sanction_date if isinstance(twin.sanction.sanction_date, date) else twin.sanction.sanction_date.date()
        if getattr(twin, "sanction_date", None):
            sd = twin.sanction_date
            return sd.date() if isinstance(sd, datetime) else sd
        if getattr(twin, "start_date", None):
            st = twin.start_date
            return st.date() if isinstance(st, datetime) else st
        return date.today()

    def _build_context(self, twin: ProjectDigitalTwin) -> Dict[str, Any]:
        """Extracts variables for rule condition evaluation."""
        doc_types = list(getattr(twin, "document_types_present", []) or [])
        if getattr(twin, "documents", None):
            for d in twin.documents:
                dtype = getattr(d, "document_type", None)
                if not dtype and hasattr(d, "custom") and d.custom:
                    dtype = d.custom.get("document_type")
                if dtype and str(dtype) not in doc_types:
                    doc_types.append(str(dtype))

        sanctioned = float(twin.sanctioned_amount) if getattr(twin, "sanctioned_amount", None) is not None else 0.0
        expenditure = float(twin.total_expenditure) if getattr(twin, "total_expenditure", None) is not None else 0.0
        budget = float(twin.approved_budget) if getattr(twin, "approved_budget", None) is not None else sanctioned

        return {
            "project_id": twin.project_id,
            "category": str(twin.category or "").upper(),
            "sanctioned_amount": sanctioned,
            "approved_budget": budget,
            "expenditure": expenditure,
            "financial_progress": float(twin.financial_progress or 0.0),
            "physical_progress": float(twin.physical_progress or 0.0),
            "is_overdue": bool(twin.is_overdue),
            "delay_days": int(twin.delay_days or 0),
            "document_types": doc_types,
            "data_completeness": float(twin.data_completeness_score or 0.0),
        }

    def _evaluate_rule(
        self,
        rule: PolicyRule,
        twin: ProjectDigitalTwin,
        context: Dict[str, Any],
    ) -> RuleEvaluationResult:
        # Check applicability
        if "ALL" not in rule.applicable_categories:
            if context["category"] not in [c.upper() for c in rule.applicable_categories]:
                return RuleEvaluationResult(
                    rule_id=rule.rule_id,
                    rule_name=rule.name,
                    status=RuleEvaluationStatus.NOT_APPLICABLE,
                    severity=rule.severity,
                    message="Rule not applicable to project category.",
                    citation_section=rule.citation_section,
                )

        if rule.min_amount and context["sanctioned_amount"] < rule.min_amount:
            return RuleEvaluationResult(
                rule_id=rule.rule_id,
                rule_name=rule.name,
                status=RuleEvaluationStatus.NOT_APPLICABLE,
                severity=rule.severity,
                message="Project sanction below rule threshold.",
                citation_section=rule.citation_section,
            )

        # Safe expression evaluation
        try:
            # Safe builtins
            safe_globals = {"__builtins__": {}}
            passed = bool(eval(rule.condition_expression, safe_globals, context))
            
            if passed:
                return RuleEvaluationResult(
                    rule_id=rule.rule_id,
                    rule_name=rule.name,
                    status=RuleEvaluationStatus.PASS,
                    severity=rule.severity,
                    message=f"Complies with {rule.name}.",
                    evidence_values=context,
                    citation_section=rule.citation_section,
                )
            else:
                status = RuleEvaluationStatus.FAIL if rule.severity in ["CRITICAL", "HIGH"] else RuleEvaluationStatus.WARNING
                return RuleEvaluationResult(
                    rule_id=rule.rule_id,
                    rule_name=rule.name,
                    status=status,
                    severity=rule.severity,
                    message=f"Violation of {rule.name}: {rule.description}",
                    evidence_values=context,
                    citation_section=rule.citation_section,
                    remediation=rule.remediation_guidance,
                )
        except Exception as e:
            logger.error("policy_engine.eval_error", rule_id=rule.rule_id, error=str(e))
            return RuleEvaluationResult(
                rule_id=rule.rule_id,
                rule_name=rule.name,
                status=RuleEvaluationStatus.INSUFFICIENT_EVIDENCE,
                severity=rule.severity,
                message=f"Evaluation failed due to context error: {e}",
                citation_section=rule.citation_section,
            )
