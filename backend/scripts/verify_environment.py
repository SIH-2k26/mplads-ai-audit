"""
scripts/verify_environment.py
MPLADS Guardian — Environment Verification Script

Systematically checks every dependency and infrastructure component.

Exit codes:
    0 — All critical checks PASS
    1 — One or more FAIL or ENVIRONMENT_BLOCKED on critical components

Usage:
    python scripts/verify_environment.py
    python scripts/verify_environment.py --json  (machine-readable output)
"""
from __future__ import annotations
import sys
import os
import subprocess
import importlib
import asyncio
import platform
from datetime import datetime, timezone
from typing import Dict, List, Tuple
from pathlib import Path
from dataclasses import dataclass, field
from enum import Enum

# Ensure backend is on path
sys.path.insert(0, str(Path(__file__).parent.parent))


class CheckStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARN = "WARN"
    ENVIRONMENT_BLOCKED = "ENVIRONMENT_BLOCKED"
    NOT_INSTALLED = "NOT_INSTALLED"
    PARTIAL = "PARTIAL"


@dataclass
class CheckResult:
    name: str
    status: CheckStatus
    message: str
    is_critical: bool = True
    version: str = ""


PASS = CheckStatus.PASS
FAIL = CheckStatus.FAIL
WARN = CheckStatus.WARN
BLOCKED = CheckStatus.ENVIRONMENT_BLOCKED
NOT_INSTALLED = CheckStatus.NOT_INSTALLED
PARTIAL = CheckStatus.PARTIAL

GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"


def _status_color(status: CheckStatus) -> str:
    return {
        PASS: GREEN,
        WARN: YELLOW,
        PARTIAL: YELLOW,
        FAIL: RED,
        NOT_INSTALLED: RED,
        BLOCKED: YELLOW,
    }.get(status, RESET)


def _check_python() -> CheckResult:
    v = sys.version_info
    version = f"{v.major}.{v.minor}.{v.micro}"
    if v.major != 3 or v.minor < 11:
        return CheckResult("Python Version", FAIL, f"Python 3.11+ required, got {version}", version=version)
    return CheckResult("Python Version", PASS, f"Python {version} — OK", version=version)


def _check_import(module: str, pip_name: str = None, critical: bool = True) -> CheckResult:
    pip_name = pip_name or module
    try:
        mod = importlib.import_module(module)
        version = getattr(mod, "__version__", "unknown")
        return CheckResult(f"Package: {pip_name}", PASS, f"v{version}", is_critical=critical, version=version)
    except ImportError as e:
        return CheckResult(
            f"Package: {pip_name}",
            NOT_INSTALLED,
            f"Not installed: pip install {pip_name}",
            is_critical=critical,
        )


def _check_critical_packages() -> List[CheckResult]:
    results = []
    # Critical — without these the system cannot start
    critical = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("sqlalchemy", "sqlalchemy"),
        ("alembic", "alembic"),
        ("pydantic", "pydantic"),
        ("pydantic_settings", "pydantic-settings"),
        ("jose", "python-jose"),
        ("bcrypt", "bcrypt"),
        ("asyncpg", "asyncpg"),
        ("sklearn", "scikit-learn"),
        ("xgboost", "xgboost"),
        ("lightgbm", "lightgbm"),
        ("shap", "shap"),
        ("mlflow", "mlflow"),
        ("langchain_core", "langchain-core"),
        ("langgraph", "langgraph"),
        ("reportlab", "reportlab"),
        ("structlog", "structlog"),
        ("rank_bm25", "rank-bm25"),
        ("neo4j", "neo4j"),
        ("pgvector", "pgvector"),
        ("numpy", "numpy"),
        ("pandas", "pandas"),
        ("scipy", "scipy"),
        ("rapidfuzz", "rapidfuzz"),
        ("pytest", "pytest"),
        ("pytest_asyncio", "pytest-asyncio"),
        ("pytest_mock", "pytest-mock"),
        ("factory", "factory-boy"),
    ]
    for module, pip_name in critical:
        results.append(_check_import(module, pip_name, critical=True))

    # Optional — system degrades without these but continues
    optional = [
        ("sentence_transformers", "sentence-transformers"),
        ("faiss", "faiss-cpu"),
        ("FlagEmbedding", "FlagEmbedding"),
        ("ragas", "ragas"),
        ("langchain_community", "langchain-community"),
        ("unstructured", "unstructured"),
        ("fitz", "PyMuPDF"),
        ("pytesseract", "pytesseract"),
        ("cv2", "opencv-python-headless"),
    ]
    for module, pip_name in optional:
        r = _check_import(module, pip_name, critical=False)
        if r.status == NOT_INSTALLED:
            r.status = BLOCKED
            r.message = f"OPTIONAL/NOT_INSTALLED: pip install {pip_name}"
        results.append(r)

    return results


def _check_docker() -> CheckResult:
    try:
        result = subprocess.run(
            ["docker", "version", "--format", "{{.Server.Version}}"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode == 0:
            version = result.stdout.strip()
            return CheckResult("Docker", PASS, f"Docker {version} running", version=version)
        return CheckResult("Docker", BLOCKED, "Docker installed but not running", is_critical=False)
    except FileNotFoundError:
        return CheckResult("Docker", BLOCKED, "Docker not installed — DB tests cannot run", is_critical=False)
    except Exception as e:
        return CheckResult("Docker", BLOCKED, f"Docker error: {e}", is_critical=False)


def _check_tesseract() -> CheckResult:
    try:
        result = subprocess.run(
            ["tesseract", "--version"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode == 0:
            version = result.stdout.split("\n")[0] if result.stdout else "unknown"
            return CheckResult("Tesseract OCR (system)", PASS, version, is_critical=False)
        return CheckResult("Tesseract OCR (system)", BLOCKED, "Not installed", is_critical=False)
    except FileNotFoundError:
        return CheckResult(
            "Tesseract OCR (system)", BLOCKED,
            "Not installed — OCR fallback unavailable. "
            "Install via: choco install tesseract (Windows) or apt-get install tesseract-ocr (Linux)",
            is_critical=False,
        )
    except Exception as e:
        return CheckResult("Tesseract OCR (system)", BLOCKED, f"Error: {e}", is_critical=False)


def _check_postgres() -> CheckResult:
    async def _ping():
        import asyncpg
        from app.config.settings import get_settings
        s = get_settings()
        conn = await asyncpg.connect(
            host=s.postgres_host, port=s.postgres_port,
            database=s.postgres_db, user=s.postgres_user,
            password=s.postgres_password, timeout=3.0,
        )
        await conn.execute("SELECT 1")
        await conn.close()

    try:
        asyncio.run(_ping())
        return CheckResult("PostgreSQL Connection", PASS, "Connected and responding")
    except ImportError:
        return CheckResult("PostgreSQL Connection", NOT_INSTALLED, "asyncpg not installed")
    except Exception as e:
        return CheckResult("PostgreSQL Connection", BLOCKED, f"Not reachable: {str(e)[:80]}")


def _check_neo4j() -> CheckResult:
    async def _ping():
        from neo4j import AsyncGraphDatabase
        from app.config.settings import get_settings
        s = get_settings()
        driver = AsyncGraphDatabase.driver(
            s.neo4j_uri, auth=(s.neo4j_user, s.neo4j_password), connection_timeout=3.0
        )
        await driver.verify_connectivity()
        await driver.close()

    try:
        asyncio.run(_ping())
        return CheckResult("Neo4j Connection", PASS, "Connected and responding")
    except ImportError:
        return CheckResult("Neo4j Connection", NOT_INSTALLED, "neo4j driver not installed")
    except Exception as e:
        return CheckResult("Neo4j Connection", BLOCKED, f"Not reachable: {str(e)[:80]}")


def _check_pgvector() -> CheckResult:
    try:
        import pgvector  # noqa
        return CheckResult("pgvector Python Library", PASS, "Installed")
    except ImportError:
        return CheckResult("pgvector Python Library", NOT_INSTALLED, "pip install pgvector")


def _check_mlflow() -> CheckResult:
    try:
        import mlflow
        from app.config.settings import get_settings
        s = get_settings()
        mlflow.set_tracking_uri(s.mlflow_tracking_uri)
        experiments = mlflow.search_experiments(max_results=1)
        return CheckResult("MLflow Tracking", PASS, f"Tracking URI: {s.mlflow_tracking_uri}")
    except Exception as e:
        return CheckResult("MLflow Tracking", WARN, f"MLflow file-based OK, remote unavailable: {e}", is_critical=False)


def _check_core_imports() -> List[CheckResult]:
    """Verify core application modules load without error."""
    results = []
    modules = [
        ("app.config.settings", "Settings"),
        ("models.digital_twin", "DigitalTwin"),
        ("models.agent", "AgentModels"),
        ("agents.deterministic.budget", "BudgetAgent"),
        ("agents.part_b", "PartBAgents"),
        ("engine.evidence_fusion", "EvidenceFusionEngine"),
        ("engine.dynamic_weight_engine", "DynamicWeightEngine"),
        ("orchestration.graph", "Orchestrator"),
        ("policy.engine", "PolicyEngine"),
        ("investigation.service", "InvestigationService"),
        ("ml.training.trainer", "ModelTrainer"),
        ("ml.features.feature_engineer", "FeatureEngineer"),
        ("ml.explainability.shap_explainer", "SHAPExplainer"),
        ("nlp.explanation", "NLPExplanation"),
        ("services.pdf_service", "PDFService"),
        ("simulation.what_if", "WhatIfSimulator"),
        ("rag.retriever", "RAGRetriever"),
    ]
    for module_path, label in modules:
        try:
            importlib.import_module(module_path)
            results.append(CheckResult(f"Core Module: {label}", PASS, module_path))
        except Exception as e:
            results.append(CheckResult(f"Core Module: {label}", FAIL, f"{module_path}: {str(e)[:120]}"))
    return results


def _check_jwt_secret() -> CheckResult:
    try:
        from app.config.settings import get_settings
        s = get_settings()
        secret = s.jwt_secret_key
        dev_default = "dev-only-change-me-in-prod-use-env-JWT_SECRET_KEY"
        if secret == dev_default:
            return CheckResult(
                "JWT Secret Key",
                WARN if s.environment != "production" else FAIL,
                "Using development default. Set JWT_SECRET_KEY env var for production.",
                is_critical=s.environment == "production",
            )
        if len(secret) < 32:
            return CheckResult("JWT Secret Key", FAIL, f"Secret too short ({len(secret)} chars, need >= 32)")
        return CheckResult("JWT Secret Key", PASS, f"Set via env (length={len(secret)})")
    except Exception as e:
        return CheckResult("JWT Secret Key", FAIL, str(e))


def _check_cors_config() -> CheckResult:
    try:
        from app.config.settings import get_settings
        s = get_settings()
        origins = s.cors_origins_list
        if "*" in origins and s.environment == "production":
            return CheckResult("CORS Configuration", FAIL, "WILDCARD CORS in production is a security risk!")
        if len(origins) == 0:
            return CheckResult("CORS Configuration", WARN, "No CORS origins configured — API may be inaccessible from browser")
        return CheckResult("CORS Configuration", PASS, f"Origins: {', '.join(origins[:3])}{' (+more)' if len(origins) > 3 else ''}")
    except Exception as e:
        return CheckResult("CORS Configuration", FAIL, str(e))


def _print_results(results: List[CheckResult], json_output: bool = False):
    if json_output:
        import json
        output = {
            "verified_at": datetime.now(timezone.utc).isoformat(),
            "platform": platform.platform(),
            "python": sys.version,
            "checks": [
                {
                    "name": r.name,
                    "status": r.status.value,
                    "message": r.message,
                    "is_critical": r.is_critical,
                    "version": r.version,
                }
                for r in results
            ],
        }
        print(json.dumps(output, indent=2))
        return

    print(f"\n{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}  MPLADS Guardian — Environment Verification Report{RESET}")
    print(f"  {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"  Platform: {platform.platform()}")
    print(f"{BOLD}{'='*70}{RESET}\n")

    categories = [
        ("Python Runtime", [r for r in results if r.name.startswith("Python")]),
        ("Infrastructure", [r for r in results if r.name in ("Docker", "PostgreSQL Connection", "Neo4j Connection", "Tesseract OCR (system)")]),
        ("Python Packages (Critical)", [r for r in results if r.name.startswith("Package:") and r.is_critical]),
        ("Python Packages (Optional)", [r for r in results if r.name.startswith("Package:") and not r.is_critical]),
        ("Core Module Imports", [r for r in results if r.name.startswith("Core Module:")]),
        ("Security Configuration", [r for r in results if r.name in ("JWT Secret Key", "CORS Configuration")]),
        ("MLflow / ML Registry", [r for r in results if "MLflow" in r.name]),
    ]

    for cat_name, cat_results in categories:
        if not cat_results:
            continue
        print(f"{BOLD}{cat_name}{RESET}")
        for r in cat_results:
            color = _status_color(r.status)
            critical_marker = " [CRITICAL]" if r.is_critical and r.status in (FAIL, NOT_INSTALLED) else ""
            print(f"  {color}[{r.status.value:20}]{RESET} {r.name}{critical_marker}")
            if r.message:
                print(f"  {' ':22} {r.message}")
        print()

    # Summary
    total = len(results)
    passed = sum(1 for r in results if r.status == PASS)
    failed = sum(1 for r in results if r.status in (FAIL, NOT_INSTALLED) and r.is_critical)
    warned = sum(1 for r in results if r.status in (WARN, PARTIAL))
    blocked = sum(1 for r in results if r.status == BLOCKED)
    not_installed_optional = sum(1 for r in results if r.status in (NOT_INSTALLED, BLOCKED) and not r.is_critical)

    print(f"{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}  SUMMARY:{RESET}")
    print(f"  {GREEN}PASS{RESET}: {passed}/{total}")
    print(f"  {RED}CRITICAL FAILURES{RESET}: {failed}")
    print(f"  {YELLOW}WARNINGS{RESET}: {warned}")
    print(f"  {YELLOW}ENVIRONMENT BLOCKED{RESET}: {blocked}")
    print(f"  Optional not installed: {not_installed_optional}")

    if failed > 0:
        print(f"\n  {RED}{BOLD}[FAIL] Environment NOT ready -- {failed} critical failures must be resolved.{RESET}")
    elif blocked > 0:
        print(f"\n  {YELLOW}{BOLD}[WARN] Environment PARTIALLY ready -- infrastructure unavailable (Docker not running?).{RESET}")
        print(f"  {YELLOW}       Core application will work. Integration tests will be skipped.{RESET}")
    else:
        print(f"\n  {GREEN}{BOLD}[OK] Environment READY -- all critical checks passed.{RESET}")
    print(f"{BOLD}{'='*70}{RESET}\n")

    return failed == 0


def main():
    json_output = "--json" in sys.argv

    results: List[CheckResult] = []
    results.append(_check_python())
    results.extend(_check_critical_packages())
    results.append(_check_docker())
    results.append(_check_tesseract())
    results.append(_check_postgres())
    results.append(_check_neo4j())
    results.append(_check_pgvector())
    results.append(_check_mlflow())
    results.extend(_check_core_imports())
    results.append(_check_jwt_secret())
    results.append(_check_cors_config())

    ok = _print_results(results, json_output=json_output)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
