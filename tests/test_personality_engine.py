"""Tests for the personality engine."""
import pytest
from core.personality_engine import build_agent_system_prompt, inject_personality_into_prompt
from core.agent_profile import DEFAULT_AGENTS


def _get_agent(agent_id: str):
    return next(a for a in DEFAULT_AGENTS if a["id"] == agent_id)


def test_build_system_prompt_includes_name():
    agent = _get_agent("marketing-agent")
    prompt = build_agent_system_prompt(agent)
    assert "Maya" in prompt


def test_build_system_prompt_includes_specialty():
    agent = _get_agent("finance-agent")
    prompt = build_agent_system_prompt(agent)
    assert "finance" in prompt.lower()


def test_build_system_prompt_includes_personality():
    agent = _get_agent("sales-agent")
    prompt = build_agent_system_prompt(agent)
    # Sales agent is aggressive — check for intensity/urgency language
    assert "intensity" in prompt.lower() or "results" in prompt.lower()


def test_inject_personality_prepends_identity():
    agent = _get_agent("tech-agent")
    result = inject_personality_into_prompt("Build a website", agent)
    assert "AGENT IDENTITY" in result
    assert "Build a website" in result


def test_all_default_agents_have_valid_personality():
    for agent in DEFAULT_AGENTS:
        prompt = build_agent_system_prompt(agent)
        assert len(prompt) > 50
        assert agent["name"] in prompt
