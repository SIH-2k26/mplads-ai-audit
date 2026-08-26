"""
migrations/versions/001_initial_schema.py
Initial database schema — creates all tables and pgvector extension.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers
revision = "001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # pgvector extension (also in init_extensions.sql for Docker)
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    op.execute("CREATE EXTENSION IF NOT EXISTS unaccent")

    # ── projects ──────────────────────────────────────────────────────────────
    op.create_table(
        "projects",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("source_project_id", sa.String(128), nullable=True),
        sa.Column("project_name", sa.String(512), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("category", sa.String(64), nullable=True),
        sa.Column("sub_category", sa.String(64), nullable=True),
        sa.Column("mp_id", sa.String(32), nullable=True),
        sa.Column("mp_name", sa.String(256), nullable=True),
        sa.Column("constituency_id", sa.String(32), nullable=True),
        sa.Column("constituency_name", sa.String(256), nullable=True),
        sa.Column("district", sa.String(128), nullable=True),
        sa.Column("state", sa.String(128), nullable=True),
        sa.Column("district_id", sa.String(32), nullable=True),
        sa.Column("state_id", sa.String(32), nullable=True),
        sa.Column("location_json", JSONB, nullable=True),
        sa.Column("sanction_number", sa.String(128), nullable=True),
        sa.Column("sanction_date", sa.Date, nullable=True),
        sa.Column("sanctioned_amount", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("approved_budget", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("revised_budget", sa.Numeric(14, 2), nullable=True),
        sa.Column("estimated_cost", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("revised_cost", sa.Numeric(14, 2), nullable=True),
        sa.Column("total_expenditure", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("financial_progress", sa.Numeric(5, 2), nullable=True),
        sa.Column("physical_progress", sa.Numeric(5, 2), nullable=True),
        sa.Column("progress_as_of", sa.Date, nullable=True),
        sa.Column("start_date", sa.Date, nullable=True),
        sa.Column("expected_completion_date", sa.Date, nullable=True),
        sa.Column("actual_completion_date", sa.Date, nullable=True),
        sa.Column("approved_extensions", sa.Integer, nullable=False, server_default="0"),
        sa.Column("extension_days", sa.Integer, nullable=False, server_default="0"),
        sa.Column("project_status", sa.String(32), nullable=False, server_default="UNKNOWN"),
        sa.Column("agency_id", sa.String(64), nullable=True),
        sa.Column("agency_name", sa.String(256), nullable=True),
        sa.Column("contractor_id", sa.String(64), nullable=True),
        sa.Column("contractor_name", sa.String(256), nullable=True),
        sa.Column("data_completeness_score", sa.Numeric(4, 3), nullable=False, server_default="1.0"),
        sa.Column("data_quality_flags_json", JSONB, nullable=True),
        sa.Column("twin_version", sa.Integer, nullable=False, server_default="1"),
        sa.Column("twin_built_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("source_checksum", sa.String(64), nullable=True),
        sa.Column("source_name", sa.String(256), nullable=True),
        sa.Column("last_ingested_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("neo4j_node_id", sa.String(64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("sanctioned_amount >= 0", name="ck_projects_sanctioned_amount"),
        sa.CheckConstraint("total_expenditure >= 0", name="ck_projects_expenditure"),
        sa.CheckConstraint("financial_progress IS NULL OR (financial_progress >= 0 AND financial_progress <= 100)", name="ck_projects_fin_progress"),
        sa.CheckConstraint("physical_progress IS NULL OR (physical_progress >= 0 AND physical_progress <= 100)", name="ck_projects_phy_progress"),
    )
    op.create_index("ix_projects_source_id", "projects", ["source_project_id"])
    op.create_index("ix_projects_state", "projects", ["state"])
    op.create_index("ix_projects_district", "projects", ["district"])
    op.create_index("ix_projects_status", "projects", ["project_status"])
    op.create_index("ix_projects_category", "projects", ["category"])
    op.create_index("ix_projects_mp_id", "projects", ["mp_id"])
    op.create_index("ix_projects_agency_id", "projects", ["agency_id"])
    op.create_index("ix_projects_contractor_id", "projects", ["contractor_id"])

    # ── payments ──────────────────────────────────────────────────────────────
    op.create_table(
        "payments",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("payment_date", sa.Date, nullable=True),
        sa.Column("amount", sa.Numeric(14, 2), nullable=False),
        sa.Column("beneficiary", sa.String(256), nullable=True),
        sa.Column("payment_type", sa.String(64), nullable=True),
        sa.Column("voucher_number", sa.String(128), nullable=True),
        sa.Column("remarks", sa.Text, nullable=True),
        sa.Column("provenance_json", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("amount >= 0", name="ck_payments_amount"),
    )
    op.create_index("ix_payments_project_id", "payments", ["project_id"])

    # ── progress_records ──────────────────────────────────────────────────────
    op.create_table(
        "progress_records",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("as_of_date", sa.Date, nullable=False),
        sa.Column("financial_progress", sa.Numeric(5, 2), nullable=False),
        sa.Column("physical_progress", sa.Numeric(5, 2), nullable=False),
        sa.Column("reported_by", sa.String(256), nullable=True),
        sa.Column("source", sa.String(64), nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("provenance_json", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_progress_records_project_id", "progress_records", ["project_id"])

    # ── contractors / agencies ────────────────────────────────────────────────
    op.create_table(
        "contractors",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("contractor_name", sa.String(256), nullable=False),
        sa.Column("normalized_name", sa.String(256), nullable=True),
        sa.Column("registration_number", sa.String(128), nullable=True),
        sa.Column("category", sa.String(64), nullable=True),
        sa.Column("contact_info", JSONB, nullable=True),
        sa.Column("source_ids", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_table(
        "agencies",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("agency_name", sa.String(256), nullable=False),
        sa.Column("normalized_name", sa.String(256), nullable=True),
        sa.Column("agency_type", sa.String(64), nullable=True),
        sa.Column("state", sa.String(128), nullable=True),
        sa.Column("contact_info", JSONB, nullable=True),
        sa.Column("source_ids", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # ── milestones ────────────────────────────────────────────────────────────
    op.create_table(
        "milestones",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(256), nullable=False),
        sa.Column("planned_date", sa.Date, nullable=True),
        sa.Column("actual_date", sa.Date, nullable=True),
        sa.Column("is_completed", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("completion_evidence", sa.Text, nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
    )
    op.create_index("ix_milestones_project_id", "milestones", ["project_id"])

    # ── documents ────────────────────────────────────────────────────────────
    op.create_table(
        "documents",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("file_name", sa.String(512), nullable=False),
        sa.Column("file_path", sa.String(1024), nullable=True),
        sa.Column("file_type", sa.String(16), nullable=False),
        sa.Column("file_size_bytes", sa.Integer, nullable=True),
        sa.Column("checksum", sa.String(64), nullable=True, unique=True),
        sa.Column("document_type", sa.String(64), nullable=False, server_default="OTHER"),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="SET NULL"), nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="PENDING"),
        sa.Column("ocr_used", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("ocr_engine", sa.String(32), nullable=True),
        sa.Column("ocr_confidence", sa.Float, nullable=True),
        sa.Column("extraction_quality", sa.Float, nullable=True),
        sa.Column("page_count", sa.Integer, nullable=True),
        sa.Column("chunk_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("raw_text", sa.Text, nullable=True),
        sa.Column("metadata_json", JSONB, nullable=True),
        sa.Column("provenance_json", JSONB, nullable=True),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_documents_project_id", "documents", ["project_id"])
    op.create_index("ix_documents_status", "documents", ["status"])
    op.create_index("ix_documents_type", "documents", ["document_type"])

    # ── document_chunks (with pgvector) ───────────────────────────────────────
    op.create_table(
        "document_chunks",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("document_id", sa.String(64), sa.ForeignKey("documents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("project_id", sa.String(64), nullable=True),
        sa.Column("text", sa.Text, nullable=False),
        sa.Column("text_length", sa.Integer, nullable=False, server_default="0"),
        sa.Column("page", sa.Integer, nullable=True),
        sa.Column("section", sa.String(256), nullable=True),
        sa.Column("chunk_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("chunk_type", sa.String(32), nullable=False, server_default="paragraph"),
        sa.Column("embedding_model", sa.String(128), nullable=True),
        sa.Column("has_embedding", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("metadata_json", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    # Add vector column via raw SQL (Alembic doesn't know about pgvector types)
    op.execute("ALTER TABLE document_chunks ADD COLUMN embedding vector(1024)")
    op.create_index("ix_chunks_document_id", "document_chunks", ["document_id"])

    # HNSW index for fast approximate nearest-neighbor search
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_chunks_embedding_hnsw "
        "ON document_chunks USING hnsw (embedding vector_cosine_ops) "
        "WITH (m=16, ef_construction=64)"
    )

    # ── events ────────────────────────────────────────────────────────────────
    op.create_table(
        "events",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("event_type", sa.String(64), nullable=False),
        sa.Column("project_id", sa.String(64), nullable=True),
        sa.Column("entity_id", sa.String(64), nullable=True),
        sa.Column("entity_type", sa.String(64), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("schema_version", sa.String(16), nullable=False, server_default="1.0"),
        sa.Column("source", sa.String(128), nullable=False),
        sa.Column("actor", sa.String(128), nullable=True),
        sa.Column("payload", JSONB, nullable=True),
        sa.Column("changed_fields", JSONB, nullable=True),
        sa.Column("previous_values", JSONB, nullable=True),
        sa.Column("new_values", JSONB, nullable=True),
        sa.Column("provenance_json", JSONB, nullable=True),
        sa.Column("correlation_id", sa.String(64), nullable=True),
    )
    op.create_index("ix_events_project_type", "events", ["project_id", "event_type"])
    op.create_index("ix_events_timestamp", "events", ["timestamp"])

    # ── agent_results ─────────────────────────────────────────────────────────
    op.create_table(
        "agent_results",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("agent_id", sa.String(64), nullable=False),
        sa.Column("agent_name", sa.String(128), nullable=False),
        sa.Column("agent_version", sa.String(32), nullable=False),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("score", sa.Float, nullable=False, server_default="0"),
        sa.Column("severity", sa.String(32), nullable=False, server_default="UNKNOWN"),
        sa.Column("confidence", sa.Float, nullable=False, server_default="0"),
        sa.Column("applicability", sa.Float, nullable=False, server_default="1"),
        sa.Column("signals_json", JSONB, nullable=True),
        sa.Column("evidence_json", JSONB, nullable=True),
        sa.Column("data_sources", JSONB, nullable=True),
        sa.Column("provenance_json", JSONB, nullable=True),
        sa.Column("execution_time_ms", sa.Float, nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("recommendation", sa.Text, nullable=True),
        sa.Column("metadata_json", JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_agent_results_project_agent", "agent_results", ["project_id", "agent_id"])

    # ── policies ──────────────────────────────────────────────────────────────
    op.create_table(
        "policies",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("version", sa.String(32), nullable=False),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("source", sa.String(512), nullable=False),
        sa.Column("source_url", sa.String(1024), nullable=True),
        sa.Column("document_id", sa.String(64), nullable=True),
        sa.Column("effective_from", sa.DateTime(timezone=True), nullable=False),
        sa.Column("effective_to", sa.DateTime(timezone=True), nullable=True),
        sa.Column("authority", sa.String(256), nullable=False),
        sa.Column("is_current", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_table(
        "policy_rules",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("policy_id", sa.String(64), sa.ForeignKey("policies.id", ondelete="CASCADE"), nullable=False),
        sa.Column("policy_version", sa.String(32), nullable=False),
        sa.Column("rule_name", sa.String(256), nullable=False),
        sa.Column("condition", sa.Text, nullable=False),
        sa.Column("requirement", sa.Text, nullable=False),
        sa.Column("severity", sa.String(32), nullable=False),
        sa.Column("applicable_categories", JSONB, nullable=True),
        sa.Column("applicable_states", JSONB, nullable=True),
        sa.Column("source_reference", sa.String(256), nullable=True),
        sa.Column("source_text", sa.Text, nullable=True),
        sa.Column("metadata_json", JSONB, nullable=True),
    )
    op.create_index("ix_policy_rules_policy_id", "policy_rules", ["policy_id"])

    # ── investigation ─────────────────────────────────────────────────────────
    op.create_table(
        "investigation_cases",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("priority", sa.String(32), nullable=False, server_default="MEDIUM"),
        sa.Column("status", sa.String(64), nullable=False, server_default="NEW"),
        sa.Column("risk_score_at_creation", sa.Float, nullable=False),
        sa.Column("risk_level_at_creation", sa.String(32), nullable=False),
        sa.Column("risk_fingerprint_json", JSONB, nullable=True),
        sa.Column("trigger_signals", JSONB, nullable=True),
        sa.Column("agent_evidence_summary_json", JSONB, nullable=True),
        sa.Column("assigned_to", sa.String(128), nullable=True),
        sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_cases_project_id", "investigation_cases", ["project_id"])
    op.create_index("ix_cases_status", "investigation_cases", ["status"])

    op.create_table(
        "case_evidence",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("case_id", sa.String(64), sa.ForeignKey("investigation_cases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("evidence_type", sa.String(64), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("value_json", JSONB, nullable=True),
        sa.Column("source", sa.String(128), nullable=False),
        sa.Column("source_id", sa.String(64), nullable=True),
        sa.Column("document_id", sa.String(64), nullable=True),
        sa.Column("agent_id", sa.String(64), nullable=True),
        sa.Column("confidence", sa.Float, nullable=False),
        sa.Column("provenance_json", JSONB, nullable=True),
        sa.Column("added_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("added_by", sa.String(64), nullable=False, server_default="system"),
    )
    op.create_index("ix_case_evidence_case_id", "case_evidence", ["case_id"])

    op.create_table(
        "investigation_verdicts",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("case_id", sa.String(64), sa.ForeignKey("investigation_cases.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("verdict", sa.String(64), nullable=False),
        sa.Column("reason", sa.Text, nullable=False),
        sa.Column("investigator_id", sa.String(64), nullable=True),
        sa.Column("investigator_name", sa.String(256), nullable=True),
        sa.Column("investigator_role", sa.String(128), nullable=True),
        sa.Column("supporting_evidence_ids", JSONB, nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("is_feedback_consented", sa.Boolean, nullable=False, server_default="false"),
    )

    # ── audit / provenance ────────────────────────────────────────────────────
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("case_id", sa.String(64), nullable=True),
        sa.Column("project_id", sa.String(64), nullable=True),
        sa.Column("actor", sa.String(128), nullable=False),
        sa.Column("action", sa.String(128), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("before_state", JSONB, nullable=True),
        sa.Column("after_state", JSONB, nullable=True),
        sa.Column("details", JSONB, nullable=True),
    )
    op.create_index("ix_audit_logs_case_id", "audit_logs", ["case_id"])
    op.create_index("ix_audit_logs_timestamp", "audit_logs", ["timestamp"])

    op.create_table(
        "provenance_records",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("entity_type", sa.String(64), nullable=False),
        sa.Column("entity_id", sa.String(64), nullable=False),
        sa.Column("source_id", sa.String(256), nullable=False),
        sa.Column("source_type", sa.String(32), nullable=False),
        sa.Column("source_name", sa.String(512), nullable=False),
        sa.Column("document_id", sa.String(64), nullable=True),
        sa.Column("page", sa.Integer, nullable=True),
        sa.Column("section", sa.String(256), nullable=True),
        sa.Column("source_timestamp", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ingestion_timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("processing_version", sa.String(32), nullable=False, server_default="1.0.0"),
        sa.Column("checksum", sa.String(64), nullable=True),
        sa.Column("metadata_json", JSONB, nullable=True),
    )
    op.create_index("ix_provenance_entity", "provenance_records", ["entity_type", "entity_id"])

    op.create_table(
        "data_quality_issues",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("project_id", sa.String(64), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("field_name", sa.String(128), nullable=False),
        sa.Column("issue_type", sa.String(32), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("severity", sa.String(32), nullable=False),
        sa.Column("age_days", sa.Integer, nullable=True),
        sa.Column("resolved", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_data_quality_project_id", "data_quality_issues", ["project_id"])


def downgrade() -> None:
    """Drop all tables in reverse dependency order."""
    tables = [
        "data_quality_issues", "provenance_records", "audit_logs",
        "investigation_verdicts", "case_evidence", "investigation_cases",
        "policy_rules", "policies",
        "agent_results", "events",
        "document_chunks", "documents",
        "milestones", "agencies", "contractors",
        "progress_records", "payments", "projects",
    ]
    for table in tables:
        op.drop_table(table)
