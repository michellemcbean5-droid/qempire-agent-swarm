"""Tests for the verifier agent node."""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.verifier import verifier_node, _build_final_result, _extract_deliverables
from core.state import AgentState


class TestBuildFinalResult:
    def test_success_result(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "test", "params": {}, "description": "d", "status": "completed", "result": None}],
            current_step=1,
            event_stream=["msg1"],
            final_result=None,
            error_count=0,
            max_errors=3,
        )
        result = _build_final_result(state)
        assert result["status"] == "success"
        assert result["task_id"] == "t1"
        assert result["steps_completed"] == 1
        assert "event_log" in result


class TestExtractDeliverables:
    def test_extracts_url(self):
        plan = [{"step": 1, "action": "deploy_to_github", "params": {}, "description": "Deploy site", "status": "completed", "result": "https://user.github.io/repo"}]
        d = _extract_deliverables(plan)
        assert "Deploy site" in d

    def test_extracts_file_path(self):
        plan = [{"step": 1, "action": "generate_document", "params": {}, "description": "Make doc", "status": "completed", "result": "/home/ubuntu/output/doc.pdf"}]
        d = _extract_deliverables(plan)
        assert "Make doc" in d


class TestVerifierNode:
    def test_all_steps_done_sets_final_result(self):
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
        result = verifier_node(state)
        assert result["final_result"] is not None
        assert result["final_result"]["status"] == "success"
        assert any("MICHELLE" in msg for msg in result["event_stream"])

    def test_failed_step_with_retry_remaining(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "test", "params": {}, "description": "d", "status": "failed", "result": "oops"}],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=1,
            max_errors=3,
        )
        result = verifier_node(state)
        assert result["plan"][0]["status"] == "pending"
        assert any("Retry" in msg for msg in result["event_stream"])

    def test_max_errors_aborts(self):
        state = AgentState(
            task_id="t1",
            task_type="TEST",
            payload={},
            plan=[{"step": 1, "action": "test", "params": {}, "description": "d", "status": "failed", "result": "oops"}],
            current_step=0,
            event_stream=[],
            final_result=None,
            error_count=3,
            max_errors=3,
        )
        result = verifier_node(state)
        assert result["final_result"] is not None
        assert result["final_result"]["status"] == "partial_failure"
        assert any("Max errors" in msg for msg in result["event_stream"])
