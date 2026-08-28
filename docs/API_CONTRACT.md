# MPLADS AI Audit — Strict API Contract Specification

## Endpoint: `POST /api/v1/analyze`
Executes complete hybrid ML risk prediction, anomaly scoring, regulatory rule compliance verification, and temporal RAG statutory evidence retrieval.

---

### Request Payload (`AnalysisRequest`)

```json
{
  "project": {
    "project_id": "MPLADS-000001",
    "title": "Construction of Community Hall",
    "category": "Community Infrastructure",
    "state": "Maharashtra",
    "district": "Pune",
    "constituency": "Pune",
    "sanction_amount": 2500000.0,
    "estimated_cost": 2400000.0,
    "revised_cost": 2500000.0,
    "tender_amount": 2380000.0,
    "actual_cost": 2300000.0,
    "fund_released": 2500000.0,
    "total_expenditure": 2300000.0,
    "physical_progress": 75.0,
    "financial_progress": 80.0,
    "planned_duration_days": 180,
    "actual_duration_days": 200,
    "bid_count": 4,
    "extension_count": 0,
    "contractor_id": "CONT-0001",
    "agency_id": "AGENCY-0001",
    "sanction_date": "2023-06-15"
  },
  "documents": {
    "administrative_sanction": true,
    "technical_sanction": true,
    "dpr": true,
    "work_order": true,
    "measurement_book": true,
    "utilization_certificate": true,
    "completion_certificate": true,
    "geo_tagged_photos": true
  },
  "analysis_options": {
    "include_rag": true,
    "include_explanations": true,
    "include_feature_values": true
  }
}
```

---

### Response Payload (`AnalysisResponse`)

```json
{
  "project_id": "MPLADS-000001",
  "project_title": "Construction of Community Hall",
  "risk_score": 22.5,
  "risk_level": "LOW",
  "model_probability": 0.15,
  "confidence": 0.92,
  "severity_label": "LOW RISK — 22.5/100",
  "model_probabilities": {
    "catboost": 0.15,
    "xgboost": 0.15,
    "lightgbm": 0.15,
    "random_forest": 0.15,
    "isolation_forest_anomaly": 0.15
  },
  "risk_components": {
    "supervised_ml": 5.3,
    "rule_compliance": 0.0,
    "unsupervised_anomaly": 3.0,
    "contractor_risk": 1.3,
    "evidence_integrity": 0.0
  },
  "top_risk_factors": [],
  "anomalies": ["NONE"],
  "compliance_findings": [],
  "regulatory_evidence": [
    {
      "document_id": "MPLADS-2023-REV",
      "document_title": "Revised Guidelines on MPLADS 2023",
      "authority": "Ministry of Statistics & Programme Implementation (MoSPI)",
      "chapter": "Chapter 4: Implementation and Monitoring",
      "section": "Section 4.3: Financial Progress & Milestone Verification",
      "paragraph": "Para 4.3.2",
      "page": 28,
      "effective_date": "2023-04-01",
      "citation_text": "Funds released for any approved MPLADS work shall be linked strictly to physical milestone certification recorded in the Measurement Book (MB)...",
      "relevance_score": 0.94,
      "applicability_reason": "Applicable because project was sanctioned after 01-04-2023 under the Revised MPLADS Guidelines."
    }
  ],
  "recommended_actions": [
    "Standard quarterly monitoring; proceed with scheduled milestone disbursement."
  ],
  "feature_count": 177,
  "rag_status": "operational",
  "ml_status": "operational",
  "timestamp": "2026-08-28T14:31:00Z"
}
```
