"""Tests for the agent scheduler."""
import pytest
from datetime import datetime
import zoneinfo
from core.scheduler import is_agent_available, get_next_available_time
from core.agent_profile import DEFAULT_AGENTS


def _make_profile(work_days, work_start="09:00", work_end="17:00", active=True, timezone="UTC"):
    return {
        "id": "test-agent",
        "name": "Test Agent",
        "specialty": "general",
        "personality": "professional",
        "attitude": "balanced",
        "schedule": {
            "timezone": timezone,
            "work_days": work_days,
            "work_start": work_start,
            "work_end": work_end,
            "max_tasks_per_day": 10,
        },
        "active": active,
        "tasks_completed": 0,
        "current_task_id": None,
    }


def test_inactive_agent_not_available():
    profile = _make_profile([0, 1, 2, 3, 4], active=False)
    # Any time — inactive agent is never available
    assert is_agent_available(profile) is False


def test_qbot_always_available_on_weekday():
    """Q-Bot works 24/7 (work hours 00:00–23:59, all days)."""
    qbot = next(a for a in DEFAULT_AGENTS if a["id"] == "qbot")
    # Monday 10am UTC
    monday_10am = datetime(2026, 8, 3, 10, 0, 0, tzinfo=zoneinfo.ZoneInfo("UTC"))
    assert is_agent_available(qbot, monday_10am) is True


def test_agent_unavailable_outside_hours():
    profile = _make_profile([0, 1, 2, 3, 4], work_start="09:00", work_end="17:00", timezone="UTC")
    # Monday at 8am UTC — before work hours
    monday_8am = datetime(2026, 8, 3, 8, 0, 0, tzinfo=zoneinfo.ZoneInfo("UTC"))
    assert is_agent_available(profile, monday_8am) is False


def test_agent_available_during_hours():
    profile = _make_profile([0, 1, 2, 3, 4], work_start="09:00", work_end="17:00", timezone="UTC")
    # Monday at 10am UTC — within work hours
    monday_10am = datetime(2026, 8, 3, 10, 0, 0, tzinfo=zoneinfo.ZoneInfo("UTC"))
    assert is_agent_available(profile, monday_10am) is True


def test_agent_unavailable_on_weekend():
    profile = _make_profile([0, 1, 2, 3, 4], timezone="UTC")
    # Saturday at 10am UTC — weekend
    saturday = datetime(2026, 8, 8, 10, 0, 0, tzinfo=zoneinfo.ZoneInfo("UTC"))
    assert is_agent_available(profile, saturday) is False


def test_get_next_available_time_returns_string():
    profile = _make_profile([0, 1, 2, 3, 4])
    result = get_next_available_time(profile)
    assert isinstance(result, str)
    assert len(result) > 0
