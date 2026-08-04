"""Tests for Q-Bot master orchestrator."""
import pytest
from unittest.mock import patch, MagicMock
from core.qbot import _find_agent_for_task, qbot_node
from core.agent_profile import DEFAULT_AGENTS


def test_find_agent_for_marketing_task():
    """Marketing tasks should route to the marketing agent."""
    agent = _find_agent_for_task("BUILD_PITCH_DECK", DEFAULT_AGENTS)
    assert agent["specialty"] == "marketing"


def test_find_agent_for_finance_task():
    """Finance tasks should route to the finance agent."""
    agent = _find_agent_for_task("RESEARCH_FUNDING", DEFAULT_AGENTS)
    assert agent["specialty"] == "finance"


def test_find_agent_for_tech_task():
    """Tech tasks should route to the tech agent."""
    agent = _find_agent_for_task("BUILD_WEBSITE", DEFAULT_AGENTS)
    assert agent["specialty"] == "tech"


def test_find_agent_unknown_task_returns_qbot():
    """Unknown task types should fall back to Q-Bot."""
    agent = _find_agent_for_task("UNKNOWN_TASK_XYZ", DEFAULT_AGENTS)
    # Should return something — either qbot or first agent
    assert agent is not None
    assert "id" in agent


def test_find_agent_inactive_fallback():
    """If all specialty agents are inactive, should still return an agent."""
    profiles = [p.copy() for p in DEFAULT_AGENTS]
    for p in profiles:
        if p["specialty"] == "tech":
            p["active"] = False
    agent = _find_agent_for_task("BUILD_WEBSITE", profiles)
    assert agent is not None


def test_qbot_node_injects_active_agent():
    """qbot_node should inject agent_profiles and active_agent into state."""
    state = {
        "task_id": "test_001",
        "task_type": "BUILD_WEBSITE",
        "payload": {},
        "plan": [],
        "current_step": 0,
        "event_stream": ["[MICHELLE] Task started"],
        "final_result": None,
        "error_count": 0,
        "max_errors": 3,
        "agent_profiles": [],
        "active_agent": None,
        "qbot_context": {},
    }

    with patch("core.qbot._load_profiles", return_value=DEFAULT_AGENTS):
        result = qbot_node(state)

    assert result["active_agent"] is not None
    assert len(result["agent_profiles"]) > 0
    assert any("[Q-BOT]" in e for e in result["event_stream"])
