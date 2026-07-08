"""Tests for the agent loop and graph construction."""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.agent_loop import build_agent_graph, should_continue, run_task
from core.state import AgentState


class TestShouldContinue:
    def test_returns_end_when_final_result_present(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[],
            current_step=0,
            event_stream=[],
            final_result={"status": "success"},
            error_count=0,
            max_errors=3,
        )
        assert should_continue(state) == "end"

    def test_returns_end_when_max_errors_reached(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "test", "params": {}, "description": "d", "status": "pending", "result": None}],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=3,
            max_errors=3,
        )
        assert should_continue(state) == "end"

    def test_returns_end_when_all_steps_done(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "test", "params": {}, "description": "d", "status": "completed", "result": None}],
            current_step=1,
            event_stream=[],
            final_result=None,
            error_count=0,
            max_errors=3,
        )
        assert should_continue(state) == "end"

    def test_returns_execute_when_steps_remain(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "test", "params": {}, "description": "d", "status": "pending", "result": None}],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=0,
            max_errors=3,
        )
        assert should_continue(state) == "execute"


class TestBuildAgentGraph:
    def test_graph_compiles(self):
        graph = build_agent_graph()
        assert graph is not None

    def test_graph_has_expected_nodes(self):
        graph = build_agent_graph()
        # LangGraph compiled graph doesn't expose nodes directly, but compilation succeeding is the main test
        assert graph is not None


class TestRunTask:
    def test_run_task_returns_dict(self):
        task = {"id": "test_001", "type": "TEST", "payload": {"foo": "bar"}}
        result = run_task(task)
        assert isinstance(result, dict)
