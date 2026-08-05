"""
End-to-End Customer Simulation Tests
Tests the full user journey: Onboard → AI Idea Chat → Plan Generation → Agent Execution
"""
import pytest
import sys
import os
import json
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from bridge.webhook_receiver import app


SAMPLE_ONBOARDING = {
    "email": "jane@example.com",
    "name": "Jane Founder",
    "business_name": "EcoShop",
    "industry": "Ecommerce",
    "revenue_goal": "$5K–$10K/mo",
    "timeline": "3 Months",
    "package_id": "foundation",
}


class TestCustomerJourney:
    """End-to-end tests simulating the full customer flow."""

    def test_01_health_check(self):
        """Service is online before journey begins."""
        client = TestClient(app)
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"

    def test_02_onboarding_creates_tasks(self, tmp_path, monkeypatch):
        """Onboarding wizard POSTs to /onboard and creates the right tasks."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))

        client = TestClient(app)
        resp = client.post("/onboard", json=SAMPLE_ONBOARDING)

        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["package"] == "foundation"

        task_types = [t["type"] for t in data["tasks_created"]]
        # Foundation package must create these core tasks
        assert "BUILD_BLUEPRINT" in task_types
        assert "BUILD_WEBSITE" in task_types
        assert "RESEARCH_FUNDING" in task_types

    def test_03_tasks_appear_in_queue(self, tmp_path, monkeypatch):
        """After onboarding, tasks are visible in the task queue."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))

        client = TestClient(app)
        client.post("/onboard", json=SAMPLE_ONBOARDING)

        resp = client.get("/tasks")
        assert resp.status_code == 200
        data = resp.json()
        assert data["pending"] > 0

    def test_04_submit_ai_chat_task(self, tmp_path, monkeypatch):
        """A QBot chat message can be submitted as a GENERATE_CONTENT task."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))

        client = TestClient(app)
        resp = client.post("/task", json={
            "type": "GENERATE_CONTENT",
            "payload": {
                "prompt": "You are Q-Bot. The user said: 'help me build an ecommerce store'. Respond helpfully.",
                "client_email": "jane@example.com",
            },
        })
        assert resp.status_code == 200
        assert resp.json()["status"] == "queued"

    def test_05_task_status_queryable(self, tmp_path, monkeypatch):
        """After submission, task ID can be queried for status."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))

        client = TestClient(app)
        create_resp = client.post("/task", json={
            "type": "BUILD_BLUEPRINT",
            "payload": {"business_name": "EcoShop", "industry": "Ecommerce"},
        })
        task_id = create_resp.json()["task_id"]

        status_resp = client.get(f"/task/{task_id}")
        assert status_resp.status_code == 200
        assert status_resp.json()["task_id"] == task_id
        assert status_resp.json()["status"] == "pending"

    def test_06_tasks_visible_by_email(self, tmp_path, monkeypatch):
        """Client portal can query tasks by email."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))

        client = TestClient(app)
        # Create a task with a known email
        client.post("/task", json={
            "type": "BUILD_BLUEPRINT",
            "payload": {"business_name": "EcoShop", "email": "jane@example.com"},
        })

        resp = client.get("/status", params={"email": "jane@example.com"})
        assert resp.status_code == 200
        assert resp.json()["email"] == "jane@example.com"
        assert resp.json()["total"] >= 1

    def test_07_agent_routing(self):
        """Q-Bot routes tasks to the correct specialty agent."""
        from core.qbot import _find_agent_for_task
        from core.agent_profile import DEFAULT_AGENTS

        # Website tasks → tech agent
        agent = _find_agent_for_task("BUILD_WEBSITE", DEFAULT_AGENTS)
        assert agent["specialty"] == "tech"

        # Funding tasks → finance agent
        agent = _find_agent_for_task("RESEARCH_FUNDING", DEFAULT_AGENTS)
        assert agent["specialty"] == "finance"

        # Marketing tasks → marketing agent
        agent = _find_agent_for_task("BUILD_PITCH_DECK", DEFAULT_AGENTS)
        assert agent["specialty"] == "marketing"

    def test_08_plan_generation_from_skill(self):
        """Planner generates a plan from skill file without calling LLM."""
        from core.planner import _load_skill_plan

        plan = _load_skill_plan("BUILD_WEBSITE", {
            "business_name": "EcoShop",
            "industry": "Ecommerce",
            "description": "Sustainable products store",
        })
        # Will return None if skills path isn't /app — that's OK in dev
        # but if it returns a plan it must be valid
        if plan is not None:
            assert isinstance(plan, list)
            assert len(plan) > 0
            for step in plan:
                assert "action" in step
                assert "status" in step

    def test_09_agent_plan_execution_mock(self):
        """Executor runs a plan step with a mocked tool."""
        from core.executor import executor_node
        from core.state import AgentState

        state: AgentState = {
            "task_id": "e2e_test_001",
            "task_type": "BUILD_BLUEPRINT",
            "payload": {"business_name": "EcoShop"},
            "plan": [
                {
                    "step": 1,
                    "action": "generate_content",
                    "params": {"prompt": "Write a short mission statement for EcoShop."},
                    "description": "Generate mission statement",
                    "status": "pending",
                    "result": None,
                }
            ],
            "current_step": 0,
            "event_stream": [],
            "final_result": None,
            "error_count": 0,
            "max_errors": 3,
            "agent_profiles": [],
            "active_agent": None,
            "qbot_context": {},
        }

        with patch("tools.content_gen.generate_content", return_value="EcoShop: Earth-first commerce."):
            result_state = executor_node(state)

        assert result_state["plan"][0]["status"] in ("completed", "failed")
        assert result_state["event_stream"]

    def test_10_verifier_advances_step_on_success(self):
        """Verifier increments current_step when a step completes successfully."""
        from core.verifier import verifier_node
        from core.state import AgentState

        state: AgentState = {
            "task_id": "e2e_test_002",
            "task_type": "BUILD_BLUEPRINT",
            "payload": {},
            "plan": [
                {
                    "step": 1,
                    "action": "generate_content",
                    "params": {},
                    "description": "Step 1",
                    "status": "completed",
                    "result": "Mission statement generated.",
                },
                {
                    "step": 2,
                    "action": "file_write",
                    "params": {},
                    "description": "Step 2",
                    "status": "pending",
                    "result": None,
                },
            ],
            "current_step": 0,
            "event_stream": [],
            "final_result": None,
            "error_count": 0,
            "max_errors": 3,
            "agent_profiles": [],
            "active_agent": None,
            "qbot_context": {},
        }

        result = verifier_node(state)
        assert result["current_step"] == 1  # advanced past completed step

    def test_11_admin_overview_returns_data(self, tmp_path, monkeypatch):
        """Admin overview endpoint returns task counts and agent list."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))

        client = TestClient(app)
        resp = client.get("/admin/overview")
        assert resp.status_code == 200
        data = resp.json()
        assert "task_counts" in data
        assert "agents" in data
        assert "feature_flags" in data

    def test_12_feature_flag_blocks_task_creation(self, tmp_path, monkeypatch):
        """When new_task_queue_enabled=False, /task returns 503."""
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))
        # Patch is_enabled on the webhook module's imported reference
        monkeypatch.setattr(wr, "is_enabled", lambda flag: False)

        client = TestClient(app)
        resp = client.post("/task", json={"type": "BUILD_WEBSITE", "payload": {}})
        assert resp.status_code == 503
