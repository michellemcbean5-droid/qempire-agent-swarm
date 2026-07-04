"""Base Pydantic models for Q-Empire Mermaid OS."""
from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class QEmpireBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TenantBase(QEmpireBaseModel):
    name: str
    slug: str
    plan: str = "starter"


class TenantCreate(TenantBase):
    pass


class Tenant(TenantBase):
    id: UUID
    created_at: datetime
    updated_at: datetime


class UserBase(QEmpireBaseModel):
    email: str
    full_name: str | None = None
    role: str = "member"


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: UUID
    tenant_id: UUID
    is_active: bool
    created_at: datetime


class ConnectorBase(QEmpireBaseModel):
    key: str
    name: str
    description: str | None = None
    category: str
    auth_type: str = "api_key"
    logo_url: str | None = None
    is_premium: bool = False
    is_active: bool = True
    config_schema: dict[str, Any] = {}


class Connector(ConnectorBase):
    id: UUID
    created_at: datetime


class ConnectorCredentialBase(QEmpireBaseModel):
    connector_id: UUID
    label: str | None = None
    auth_type: str = "api_key"
    scopes: list[str] = []
    is_active: bool = True


class ConnectorCredentialCreate(ConnectorCredentialBase):
    secret: str


class ConnectorCredential(ConnectorCredentialBase):
    id: UUID
    tenant_id: UUID
    last_tested_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class WorkflowNode(QEmpireBaseModel):
    id: str
    type: str
    position: dict[str, float] = {"x": 0, "y": 0}
    data: dict[str, Any] = {}


class WorkflowEdge(QEmpireBaseModel):
    id: str
    source: str
    target: str
    label: str | None = None
    condition: str | None = None


class WorkflowBase(QEmpireBaseModel):
    name: str
    description: str | None = None
    status: str = "draft"
    nodes: list[WorkflowNode] = []
    edges: list[WorkflowEdge] = []
    trigger_type: str | None = None
    schedule_cron: str | None = None
    webhook_path: str | None = None


class WorkflowCreate(WorkflowBase):
    pass


class Workflow(WorkflowBase):
    id: UUID
    tenant_id: UUID
    created_by: UUID | None = None
    created_at: datetime
    updated_at: datetime


class WorkflowRunBase(QEmpireBaseModel):
    workflow_id: UUID
    status: str = "pending"
    input: dict[str, Any] | None = None
    output: dict[str, Any] | None = None
    error_message: str | None = None


class WorkflowRun(WorkflowRunBase):
    id: UUID
    tenant_id: UUID
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime


class AgentBase(QEmpireBaseModel):
    name: str
    description: str | None = None
    agent_type: str = "custom"
    system_prompt: str | None = None
    tools: list[str] = []
    model: str = "claude-sonnet-4-20250514"
    temperature: float = 0.3
    is_public: bool = False
    is_active: bool = True


class AgentCreate(AgentBase):
    pass


class Agent(AgentBase):
    id: UUID
    tenant_id: UUID | None = None
    created_by: UUID | None = None
    created_at: datetime
    updated_at: datetime


class LogEntry(QEmpireBaseModel):
    id: UUID
    tenant_id: UUID
    workflow_run_id: UUID | None = None
    level: str
    source: str
    message: str
    metadata: dict[str, Any]
    created_at: datetime
