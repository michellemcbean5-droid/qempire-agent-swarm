"""Q-Empire Agent Swarm - Core Module"""
from core.state import AgentState

__all__ = ["AgentState"]

# Lazy imports to avoid requiring langgraph at import time
def _get_agent_loop():
    from core.agent_loop import build_agent_graph, run_task
    return build_agent_graph, run_task
