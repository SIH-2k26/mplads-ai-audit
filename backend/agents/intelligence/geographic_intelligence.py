"""
agents/intelligence/geographic_intelligence.py
Geographic Intelligence Agent — cluster and density analysis.
"""
from __future__ import annotations
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


class GeographicIntelligenceAgent(BaseAgent):
    agent_id = "geographic_intelligence_agent"
    agent_name = "Geographic Intelligence Agent"
    version = "1.0.0"

    NEARBY_PROJECT_THRESHOLD = 5   # >5 projects within 5km = cluster
    CONTRACTOR_CONCENTRATION = 3   # Same contractor in >3 nearby projects

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin.location is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        location = twin.location
        if not location:
            return AgentEvidence.not_applicable(
                self.agent_id, self.agent_name, "No location data available"
            )

        evidence.append(EvidenceDataPoint(
            label="Location",
            value=f"{location.district}, {location.state}",
            source="project_record",
        ))

        # ── Geographic cluster data from graph ────────────────────────────────
        graph_data = context.graph_data or {}
        nearby_projects = graph_data.get("nearby_projects", [])
        nearby_count = len(nearby_projects)
        geographic_clusters = graph_data.get("geographic_clusters", [])

        evidence.append(EvidenceDataPoint(
            label="Nearby Projects (5km radius)", value=nearby_count, source="graph_db"
        ))

        # ── High project density ───────────────────────────────────────────────
        if nearby_count >= self.NEARBY_PROJECT_THRESHOLD:
            signals.append(AgentSignal(
                signal_type="HIGH_PROJECT_DENSITY",
                description=f"{nearby_count} MPLADS projects within 5km radius — geographic concentration",
                severity=Severity.MEDIUM if nearby_count < 10 else Severity.HIGH,
                value=nearby_count,
                unit="projects",
                confidence=0.8,
                metadata={"radius_km": 5},
            ))
            score += 15.0 if nearby_count < 10 else 25.0

        # ── Same contractor in nearby projects ────────────────────────────────
        if nearby_projects:
            nearby_contractors = {}
            for p in nearby_projects:
                cname = p.get("contractor_name")
                if cname:
                    nearby_contractors[cname] = nearby_contractors.get(cname, 0) + 1

            for contractor, count in nearby_contractors.items():
                if count >= self.CONTRACTOR_CONCENTRATION:
                    signals.append(AgentSignal(
                        signal_type="CONTRACTOR_CONCENTRATION_IN_AREA",
                        description=f"Contractor '{contractor}' associated with {count} projects in nearby area",
                        severity=Severity.MEDIUM,
                        value=count,
                        unit="nearby projects",
                        confidence=0.75,
                    ))
                    score += 20.0

        # ── Clustering signal from graph analytics ─────────────────────────────
        for cluster in geographic_clusters:
            if twin.project_id in (cluster.get("project_ids") or []):
                cluster_size = cluster.get("project_count", 0)
                shared_contractors = len(cluster.get("shared_contractors", []))
                if shared_contractors > 1:
                    signals.append(AgentSignal(
                        signal_type="IN_CONTRACTOR_GEOGRAPHIC_CLUSTER",
                        description=f"Project is in a geographic cluster of {cluster_size} projects sharing {shared_contractors} contractors",
                        severity=Severity.HIGH if shared_contractors > 2 else Severity.MEDIUM,
                        value={"cluster_size": cluster_size, "shared_contractors": shared_contractors},
                        confidence=0.8,
                    ))
                    score += 20.0

        # ── Cost clustering ───────────────────────────────────────────────────
        if nearby_count > 0:
            similar_cost_nearby = graph_data.get("similar_cost_nearby_count", 0)
            if similar_cost_nearby >= 3:
                signals.append(AgentSignal(
                    signal_type="SIMILAR_COST_CLUSTERING",
                    description=f"{similar_cost_nearby} nearby projects have similar sanctioned amounts — cost clustering indicator",
                    severity=Severity.LOW,
                    value=similar_cost_nearby,
                    confidence=0.65,
                ))
                score += 10.0

        score = min(100.0, score)
        confidence = 0.8 if location.latitude and location.longitude else 0.5

        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=confidence,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["graph_db", "project_record"],
        )
