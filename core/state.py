"""Shared state schema for the Q-Empire Agent Swarm."""
from typing import TypedDict, Any


class PlanStep(TypedDict):
    """A single step in the execution plan."""
    step: int
    action: str
    params: dict
    description: str
    status: str  # pending, in_progress, completed, failed
    result: Any


class AgentState(TypedDict):
    """Shared state passed between all agent nodes."""
    task_id: str
    task_type: str
    payload: dict
    plan: list[PlanStep]
    current_step: int
    event_stream: list[str]
    final_result: dict | None
    error_count: int
    max_errors: int
    # Q-Bot / agent customization fields
    agent_profiles: list[Any]        # list of AgentProfile dicts
    active_agent: Any                # AgentProfile dict for the agent handling this task
    qbot_context: dict               # extra Q-Bot metadata (routing rationale, etc.)
