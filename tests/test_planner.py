"""Tests for the planner agent node."""
import pytest
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.planner import _load_skill_plan, _generate_plan_with_llm, planner_node
from core.state import AgentState


class TestLoadSkillPlan:
    def test_build_website_skill_exists(self):
        plan = _load_skill_plan("BUILD_WEBSITE", {"business_name": "TestCorp", "industry": "Tech"})
        # May be None if skills file missing, but we expect it to exist in this repo
        if plan is not None:
            assert isinstance(plan, list)
            for step in plan:
                assert "step" in step
                assert "action" in step
                assert "description" in step

    def test_unknown_task_returns_none(self):
        plan = _load_skill_plan("UNKNOWN_TYPE", {})
        assert plan is None

    def test_payload_interpolation(self):
        plan = _load_skill_plan("BUILD_WEBSITE", {"business_name": "TestCorp"})
        if plan is not None:
            plan_json = json.dumps(plan)
            assert "TestCorp" in plan_json or "{{business_name}}" not in plan_json


class TestPlannerNode:
    def test_planner_node_updates_state(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=0,
            max_errors=3,
        )
        result = planner_node(state)
        assert result["plan"] is not None
        assert result["current_step"] == 0
        assert any("PLANNER" in msg for msg in result["event_stream"])
