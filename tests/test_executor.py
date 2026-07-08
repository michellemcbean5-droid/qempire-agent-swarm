"""Tests for the executor agent node."""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.executor import executor_node
from core.state import AgentState


class TestExecutorNode:
    def test_no_steps_does_nothing(self):
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
        result = executor_node(state)
        assert result["current_step"] == 0

    def test_step_marked_in_progress(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "shell_exec", "params": {"command": "echo hello"}, "description": "Say hello", "status": "pending", "result": None}],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=0,
            max_errors=3,
        )
        result = executor_node(state)
        assert result["plan"][0]["status"] in ("completed", "failed")
        assert any("Q-BOT" in msg for msg in result["event_stream"])

    def test_error_increments_error_count(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "unknown_tool", "params": {}, "description": "Bad tool", "status": "pending", "result": None}],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=0,
            max_errors=3,
        )
        result = executor_node(state)
        assert result["error_count"] >= 1
        assert result["plan"][0]["status"] == "failed"
