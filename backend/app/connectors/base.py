"""Base connector framework for Q-Empire Mermaid OS."""
from abc import ABC, abstractmethod
from typing import Any, ClassVar

from backend.app.core.logging import get_logger


class ConnectorBase(ABC):
    """Abstract base class for all Q-Empire connectors."""

    key: ClassVar[str] = ""
    name: ClassVar[str] = ""
    description: ClassVar[str] = ""
    category: ClassVar[str] = ""
    auth_type: ClassVar[str] = "api_key"
    config_schema: ClassVar[dict[str, Any]] = {}

    def __init__(self, credentials: dict[str, Any], tenant_id: str | None = None):
        self.credentials = credentials
        self.tenant_id = tenant_id
        self.logger = get_logger(tenant_id=tenant_id, source=f"connector:{self.key}")

    @abstractmethod
    async def execute(self, action: str, params: dict[str, Any]) -> dict[str, Any]:
        """Execute a connector action."""
        raise NotImplementedError

    async def test(self) -> dict[str, Any]:
        """Test the connector credentials. Override in subclasses."""
        return {"success": True, "message": "No test implemented"}

    def get_headers(self) -> dict[str, str]:
        """Default headers for API-key based connectors."""
        return {
            "Authorization": f"******'api_key', '')}"",
            "Content-Type": "application/json",
        }


class ConnectorRegistry:
    """Registry of all available connectors."""

    _connectors: dict[str, type[ConnectorBase]] = {}

    @classmethod
    def register(cls, connector_class: type[ConnectorBase]) -> type[ConnectorBase]:
        cls._connectors[connector_class.key] = connector_class
        return connector_class

    @classmethod
    def get(cls, key: str) -> type[ConnectorBase] | None:
        return cls._connectors.get(key)

    @classmethod
    def list_connectors(cls) -> list[dict[str, Any]]:
        return [
            {
                "key": c.key,
                "name": c.name,
                "description": c.description,
                "category": c.category,
                "auth_type": c.auth_type,
                "config_schema": c.config_schema,
            }
            for c in cls._connectors.values()
        ]

    @classmethod
    def build_connector(cls, key: str, credentials: dict[str, Any], tenant_id: str | None = None) -> ConnectorBase:
        connector_class = cls.get(key)
        if not connector_class:
            raise ValueError(f"Unknown connector: {key}")
        return connector_class(credentials=credentials, tenant_id=tenant_id)
