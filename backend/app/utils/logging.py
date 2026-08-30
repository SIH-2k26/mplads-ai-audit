"""
app/utils/logging.py
Structured logging setup with fallback to standard logging if structlog is missing.
"""
import logging
import sys
from typing import Any, Optional

try:
    import structlog
    HAS_STRUCTLOG = True
except ImportError:
    HAS_STRUCTLOG = False

def configure_logging(log_level: str = "INFO") -> None:
    if HAS_STRUCTLOG:
        structlog.configure(
            processors=[
                structlog.contextvars.merge_contextvars,
                structlog.processors.add_log_level,
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.dev.set_exc_info,
                structlog.processors.StackInfoRenderer(),
                structlog.dev.ConsoleRenderer()
                if log_level == "DEBUG"
                else structlog.processors.JSONRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(
                getattr(logging, log_level.upper(), logging.INFO)
            ),
            context_class=dict,
            logger_factory=structlog.PrintLoggerFactory(sys.stdout),
            cache_logger_on_first_use=True,
        )
    else:
        logging.basicConfig(
            level=getattr(logging, log_level.upper(), logging.INFO),
            format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            stream=sys.stdout
        )

class StandardLoggerAdapter:
    def __init__(self, name: str, context: dict[str, Any]):
        self._logger = logging.getLogger(name)
        self._context = context

    def info(self, msg: str, **kwargs):
        ctx = {**self._context, **kwargs}
        ctx_str = " ".join(f"{k}={v}" for k, v in ctx.items() if v is not None)
        self._logger.info(f"{msg} | {ctx_str}" if ctx_str else msg)

    def warning(self, msg: str, **kwargs):
        ctx = {**self._context, **kwargs}
        ctx_str = " ".join(f"{k}={v}" for k, v in ctx.items() if v is not None)
        self._logger.warning(f"{msg} | {ctx_str}" if ctx_str else msg)

    def error(self, msg: str, **kwargs):
        ctx = {**self._context, **kwargs}
        ctx_str = " ".join(f"{k}={v}" for k, v in ctx.items() if v is not None)
        self._logger.error(f"{msg} | {ctx_str}" if ctx_str else msg)

    def exception(self, msg: str, **kwargs):
        ctx = {**self._context, **kwargs}
        ctx_str = " ".join(f"{k}={v}" for k, v in ctx.items() if v is not None)
        self._logger.exception(f"{msg} | {ctx_str}" if ctx_str else msg)

def get_logger(
    name: str,
    project_id: Optional[str] = None,
    agent_id: Optional[str] = None,
    document_id: Optional[str] = None,
    case_id: Optional[str] = None,
    **kwargs: Any,
) -> Any:
    ctx: dict[str, Any] = {k: v for k, v in {
        "project_id": project_id,
        "agent_id": agent_id,
        "document_id": document_id,
        "case_id": case_id,
        **kwargs,
    }.items() if v is not None}
    
    if HAS_STRUCTLOG:
        logger = structlog.get_logger(name)
        if ctx:
            logger = logger.bind(**ctx)
        return logger
    else:
        return StandardLoggerAdapter(name, ctx)
