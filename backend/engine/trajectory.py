"""
engine/trajectory.py
Risk Trajectory Engine for computing longitudinal risk velocity, acceleration, stability, and directional trends.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
import numpy as np

from app.utils.logging import get_logger

logger = get_logger("risk_trajectory_engine")


class TrajectoryDirection(str, Enum):
    RISING = "RISING"
    FALLING = "FALLING"
    STABLE = "STABLE"
    VOLATILE = "VOLATILE"


@dataclass
class RiskHistoricalPoint:
    score: float
    timestamp: datetime


@dataclass
class RiskTrajectory:
    project_id: str
    current_score: float
    historical_points_count: int
    direction: TrajectoryDirection
    velocity: float             # score delta per 30 days
    acceleration: float         # change in velocity
    stability: float            # standard deviation of risk scores
    is_rapidly_escalating: bool
    summary: str


class RiskTrajectoryEngine:
    """
    Analyzes historical risk scores to detect velocity, acceleration, and early risk escalation.
    """

    RAPID_ESCALATION_THRESHOLD_VELOCITY = 12.0  # +12 pts per 30 days

    def compute_trajectory(
        self,
        project_id: str,
        current_score: float,
        history: List[RiskHistoricalPoint],
    ) -> RiskTrajectory:
        """
        Calculates trajectory metrics from a time series of historical risk scores.
        """
        if not history:
            return RiskTrajectory(
                project_id=project_id,
                current_score=current_score,
                historical_points_count=0,
                direction=TrajectoryDirection.STABLE,
                velocity=0.0,
                acceleration=0.0,
                stability=0.0,
                is_rapidly_escalating=False,
                summary="Baseline risk score established. Insufficient historical points for trajectory.",
            )

        # Sort chronologically
        sorted_points = sorted(history, key=lambda p: p.timestamp)
        scores = [p.score for p in sorted_points] + [current_score]
        
        # Calculate velocity (latest score - earliest score normalized by days)
        first_time = sorted_points[0].timestamp
        last_time = datetime.now(timezone.utc)
        if first_time.tzinfo is None:
            first_time = first_time.replace(tzinfo=timezone.utc)

        days_span = max(1.0, float((last_time - first_time).total_seconds() / 86400.0))
        delta_score = current_score - sorted_points[0].score
        velocity_30d = (delta_score / days_span) * 30.0

        # Calculate acceleration (compare recent velocity to overall velocity)
        acceleration = 0.0
        if len(scores) >= 3:
            recent_delta = scores[-1] - scores[-2]
            prev_delta = scores[-2] - scores[-3]
            acceleration = round(recent_delta - prev_delta, 2)

        # Calculate stability (std dev)
        stability = round(float(np.std(scores)), 2)

        # Determine direction
        if stability > 20.0 and len(scores) >= 4:
            direction = TrajectoryDirection.VOLATILE
        elif velocity_30d > 5.0:
            direction = TrajectoryDirection.RISING
        elif velocity_30d < -5.0:
            direction = TrajectoryDirection.FALLING
        else:
            direction = TrajectoryDirection.STABLE

        is_escalating = bool(velocity_30d >= self.RAPID_ESCALATION_THRESHOLD_VELOCITY)

        # Build summary statement
        if is_escalating:
            summary = f"CRITICAL ESCALATION: Risk is rising rapidly (+{velocity_30d:.1f} pts/month)."
        elif direction == TrajectoryDirection.RISING:
            summary = f"Risk is trending upwards at +{velocity_30d:.1f} pts/month."
        elif direction == TrajectoryDirection.FALLING:
            summary = f"Risk is mitigating at {velocity_30d:.1f} pts/month."
        else:
            summary = "Risk level is stable across evaluation checkpoints."

        return RiskTrajectory(
            project_id=project_id,
            current_score=round(current_score, 2),
            historical_points_count=len(scores),
            direction=direction,
            velocity=round(velocity_30d, 2),
            acceleration=acceleration,
            stability=stability,
            is_rapidly_escalating=is_escalating,
            summary=summary,
        )
