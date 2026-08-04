"""
Q-Bot — Master Orchestrator Agent
The supreme commander of the Q-Empire swarm.
All tasks flow through Q-Bot, which routes them to the appropriate specialized agent.
"""
import json
import os
from core.state import AgentState
from core.agent_profile import (
    AgentProfile,
    DEFAULT_AGENTS,
    TASK_AGENT_MAP,
)
from core.scheduler import is_agent_available

PROFILES_PATH = os.getenv("AGENT_PROFILES_PATH", "/app/memory/agent_profiles.json")


def _load_profiles() -> list[AgentProfile]:
    """Load agent profiles from disk (or use defaults)."""
    if os.path.exists(PROFILES_PATH):
        with open(PROFILES_PATH, "r") as f:
            return json.load(f)
    return DEFAULT_AGENTS


def _save_profiles(profiles: list[AgentProfile]) -> None:
    """Persist agent profiles to disk."""
    os.makedirs(os.path.dirname(PROFILES_PATH), exist_ok=True)
    with open(PROFILES_PATH, "w") as f:
        json.dump(profiles, f, indent=2)


def _find_agent_for_task(task_type: str, profiles: list[AgentProfile]) -> AgentProfile:
    """Find the best available agent for a given task type."""
    target_specialty = TASK_AGENT_MAP.get(task_type, "general")

    # First try: matching specialty + available
    for profile in profiles:
        if profile["specialty"] == target_specialty and is_agent_available(profile):
            return profile

    # Second try: matching specialty (even if outside schedule — urgent fallback)
    for profile in profiles:
        if profile["specialty"] == target_specialty and profile["active"]:
            return profile

    # Final fallback: Q-Bot itself
    for profile in profiles:
        if profile["id"] == "qbot":
            return profile

    return profiles[0]


def qbot_node(state: AgentState) -> AgentState:
    """
    Q-Bot orchestrator node. Runs before the planner.
    - Loads agent profiles
    - Selects the best agent for this task type
    - Injects agent context into state
    """
    profiles = _load_profiles()
    task_type = state["task_type"]

    active_agent = _find_agent_for_task(task_type, profiles)

    state["agent_profiles"] = profiles
    state["active_agent"] = active_agent
    state["event_stream"].append(
        f"[Q-BOT] 👑 Routing task '{task_type}' to {active_agent['name']} "
        f"({active_agent['personality']} / {active_agent['attitude']})"
    )

    return state


def get_all_profiles() -> list[AgentProfile]:
    """Public API: return all agent profiles."""
    return _load_profiles()


def update_profile(agent_id: str, updates: dict) -> AgentProfile | None:
    """Public API: update a single agent's profile fields."""
    profiles = _load_profiles()
    for i, profile in enumerate(profiles):
        if profile["id"] == agent_id:
            profiles[i] = {**profile, **updates}
            _save_profiles(profiles)
            return profiles[i]
    return None


def get_profile(agent_id: str) -> AgentProfile | None:
    """Public API: get a single agent profile by ID."""
    for profile in _load_profiles():
        if profile["id"] == agent_id:
            return profile
    return None
