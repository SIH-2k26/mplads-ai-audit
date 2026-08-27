"""
simulation/what_if.py
WhatIfSimulator — Part B Risk Simulation Engine.
Performs "what-if" risk simulations by applying deltas to ProjectDigitalTwin
and computing projected risk trajectories without persisting changes to DB.
"""
from __future__ import annotations
from typing import Any, Optional
from datetime import datetime, timedelta
from decimal import Decimal

from models.digital_twin import ProjectDigitalTwin
from models.project import Expenditure, ProgressRecord
from orchestration.graph import MPLADSOrchestrator, run_pipeline


class WhatIfSimulator:
    """
    Simulates parameter adjustments on an in-memory clone of ProjectDigitalTwin.

    Simulation Steps:
    1. Runs baseline risk assessment pipeline on original twin.
    2. Performs deep-copy model clone (`digital_twin.model_copy(deep=True)`).
    3. Applies parameter adjustments:
       - `delay_days_delta`: Shifts expected completion date back/forward.
       - `expenditure_delta`: Increments/decrements total expenditure INR.
       - `physical_progress_delta`: Adjusts latest physical progress percentage.
    4. Executes risk pipeline on simulated twin.
    5. Calculates score deltas: `Delta = Simulated Score - Baseline Score`.
    """

    def simulate_what_if(
        self,
        digital_twin: ProjectDigitalTwin,
        delay_days_delta: int = 0,
        expenditure_delta: float = 0.0,
        physical_progress_delta: float = 0.0,
    ) -> dict[str, Any]:
        """
        Execute what-if simulation on a cloned digital twin.

        Args:
            digital_twin: Original ProjectDigitalTwin instance.
            delay_days_delta: Days of schedule delay delta to project (+/- days).
            expenditure_delta: Financial expenditure delta to apply (+/- INR).
            physical_progress_delta: Physical progress % delta to apply (+/- %).

        Returns:
            dict[str, Any]: Baseline scores, simulated scores, calculated deltas, and risk transitions.
        """
        # 1. Run baseline pipeline
        baseline_state = run_pipeline(digital_twin)
        baseline_output = baseline_state["risk_output"]

        # 2. Clone twin and apply parameter adjustments
        sim_twin = digital_twin.model_copy(deep=True)

        # Apply delay days adjustment
        if delay_days_delta != 0 and sim_twin.expected_completion_date:
            sim_twin.expected_completion_date = sim_twin.expected_completion_date - timedelta(days=delay_days_delta)

        # Apply expenditure adjustment
        if expenditure_delta != 0.0:
            current_exp = float(sim_twin.total_expenditure or Decimal("0"))
            new_exp = max(0.0, current_exp + expenditure_delta)
            if sim_twin.expenditure:
                sim_twin.expenditure = sim_twin.expenditure.model_copy(update={"total_expenditure": Decimal(str(new_exp))})
            else:
                sim_twin.expenditure = Expenditure(total_expenditure=Decimal(str(new_exp)))

        # Apply physical progress adjustment
        if physical_progress_delta != 0.0:
            current_phy = sim_twin.physical_progress or 0.0
            new_phy = max(0.0, min(100.0, current_phy + physical_progress_delta))
            fin_prog = sim_twin.financial_progress or 0.0

            latest_prog = ProgressRecord(
                as_of_date=datetime.utcnow().date(),
                financial_progress=fin_prog,
                physical_progress=new_phy,
            )
            sim_twin.latest_progress = latest_prog

        # 3. Run pipeline on modified simulated twin
        sim_state = run_pipeline(sim_twin)
        sim_output = sim_state["risk_output"]

        # 4. Compute deltas
        overall_delta = round(sim_output.overall_risk_score - baseline_output.overall_risk_score, 2)
        current_delta = round(sim_output.current_risk - baseline_output.current_risk, 2)
        future_delta = round(sim_output.future_risk - baseline_output.future_risk, 2)
        systemic_delta = round(sim_output.systemic_risk - baseline_output.systemic_risk, 2)

        return {
            "project_id": digital_twin.project_id,
            "baseline": {
                "overall_risk_score": baseline_output.overall_risk_score,
                "risk_level": baseline_output.risk_level.value,
                "current_risk": baseline_output.current_risk,
                "future_risk": baseline_output.future_risk,
                "systemic_risk": baseline_output.systemic_risk,
            },
            "simulated": {
                "overall_risk_score": sim_output.overall_risk_score,
                "risk_level": sim_output.risk_level.value,
                "current_risk": sim_output.current_risk,
                "future_risk": sim_output.future_risk,
                "systemic_risk": sim_output.systemic_risk,
            },
            "deltas": {
                "overall_risk_delta": overall_delta,
                "current_risk_delta": current_delta,
                "future_risk_delta": future_delta,
                "systemic_risk_delta": systemic_delta,
            },
            "parameters_applied": {
                "delay_days_delta": delay_days_delta,
                "expenditure_delta": expenditure_delta,
                "physical_progress_delta": physical_progress_delta,
            },
            "risk_transition": f"{baseline_output.risk_level.value} -> {sim_output.risk_level.value}",
        }
