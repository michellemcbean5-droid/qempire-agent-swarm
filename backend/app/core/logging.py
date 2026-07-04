"""Structured logging for Q-Empire Mermaid OS."""
import json
import uuid
from datetime import datetime, timezone
from typing import Any


class QEmpireLogger:
    """Simple structured logger for workflow and agent events."""

    def __init__(self, tenant_id: str | None = None, source: str = "system"):
        self.tenant_id = tenant_id
        self.source = source

    def _log(self, level: str, message: str, metadata: dict[str, Any] | None = None):
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "source": self.source,
            "message": message,
            "tenant_id": self.tenant_id,
            "metadata": metadata or {},
        }
        print(json.dumps(entry))

    def info(self, message: str, metadata: dict[str, Any] | None = None):
        self._log("info", message, metadata)

    def warning(self, message: str, metadata: dict[str, Any] | None = None):
        self._log("warning", message, metadata)

    def error(self, message: str, metadata: dict[str, Any] | None = None):
        self._log("error", message, metadata)


def get_logger(tenant_id: str | None = None, source: str = "system") -> QEmpireLogger:
    return QEmpireLogger(tenant_id=tenant_id, source=source)
