"""
backend/orchestration/config.py
Configuration for LangChain and LangGraph Orchestration in Sanchay AI.
Supports multi-provider LLM abstraction with an offline Mock Mode for CI/testing.
"""
from __future__ import annotations
import os
from typing import Optional
from pydantic import BaseModel, Field


class OrchestrationConfig(BaseModel):
    """Configuration settings for LLM reasoning agents and LangGraph workflow."""
    llm_provider: str = Field(default_factory=lambda: os.getenv("LLM_PROVIDER", "mock").lower())
    llm_model: str = Field(default_factory=lambda: os.getenv("LLM_MODEL", "gpt-4o-mini"))
    llm_temperature: float = Field(default_factory=lambda: float(os.getenv("LLM_TEMPERATURE", "0.0")))
    llm_timeout_seconds: float = Field(default_factory=lambda: float(os.getenv("LLM_TIMEOUT", "15.0")))
    max_tokens: int = Field(default_factory=lambda: int(os.getenv("MAX_TOKENS", "1024")))
    llm_mode: str = Field(default_factory=lambda: os.getenv("LLM_MODE", "mock").lower())
    enable_checkpointing: bool = Field(default_factory=lambda: os.getenv("ENABLE_CHECKPOINTING", "true").lower() == "true")
    critical_risk_threshold: float = Field(default=70.0)
    max_evidence_retries: int = Field(default=3)


_config_instance: Optional[OrchestrationConfig] = None


def get_orchestration_config() -> OrchestrationConfig:
    global _config_instance
    if _config_instance is None:
        _config_instance = OrchestrationConfig()
    return _config_instance
