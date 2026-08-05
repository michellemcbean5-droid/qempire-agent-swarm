"""Tests for the bridge monitor and webhook receiver."""
import pytest
import sys
import os
import json
import tempfile
import shutil

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bridge.monitor import load_bridge, save_bridge, process_pending_tasks
from bridge.webhook_receiver import app
from fastapi.testclient import TestClient

ADMIN_KEY = "test-admin-secret"


class TestBridgeMonitor:
    def test_load_bridge_creates_default(self, tmp_path):
        bridge_path = str(tmp_path / "bridge.json")
        import bridge.monitor as monitor
        original_path = monitor.BRIDGE_PATH
        monitor.BRIDGE_PATH = bridge_path
        try:
            data = load_bridge()
            assert "pending" in data
            assert "completed" in data
            assert "needs_clarification" in data
        finally:
            monitor.BRIDGE_PATH = original_path

    def test_save_and_load_roundtrip(self, tmp_path):
        bridge_path = str(tmp_path / "bridge.json")
        import bridge.monitor as monitor
        original_path = monitor.BRIDGE_PATH
        monitor.BRIDGE_PATH = bridge_path
        try:
            data = {"pending": [{"id": "t1"}], "completed": [], "needs_clarification": []}
            save_bridge(data)
            loaded = load_bridge()
            assert loaded["pending"][0]["id"] == "t1"
        finally:
            monitor.BRIDGE_PATH = original_path


class TestWebhookReceiver:
    @pytest.fixture(autouse=True)
    def patch_bridge_path(self, tmp_path, monkeypatch):
        """Redirect bridge writes to a temp dir to avoid /app permission errors."""
        import bridge.webhook_receiver as wr
        import core.config as cfg
        bridge_path = str(tmp_path / "bridge.json")
        monkeypatch.setattr(wr, "load_bridge", lambda: {"pending": [], "needs_clarification": [], "completed": []})
        monkeypatch.setattr(wr, "save_bridge", lambda data: None)

    def test_root_health_check(self):
        client = TestClient(app)
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "online"

    def test_create_task(self):
        client = TestClient(app)
        payload = {"type": "BUILD_WEBSITE", "payload": {"business_name": "Test"}}
        response = client.post("/task", json=payload)
        assert response.status_code == 200
        assert response.json()["status"] == "queued"
        assert "task_id" in response.json()

    def test_list_tasks(self):
        client = TestClient(app)
        response = client.get("/tasks")
        assert response.status_code == 200
        assert "pending" in response.json()
        assert "completed" in response.json()

    def test_onboard_endpoint(self):
        client = TestClient(app)
        payload = {"package_id": "foundation", "email": "test@example.com", "business_name": "TestCo"}
        response = client.post("/onboard", json=payload)
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["package"] == "foundation"
        assert len(response.json()["tasks_created"]) > 0


class TestAdminAuth:
    """Admin endpoints must reject requests without valid key."""

    def test_patch_agents_requires_admin_key(self, tmp_path, monkeypatch):
        monkeypatch.setenv("ADMIN_API_KEY", ADMIN_KEY)
        import bridge.webhook_receiver as wr
        wr.ADMIN_API_KEY = ADMIN_KEY
        client = TestClient(app)
        # No key → 401
        resp = client.patch("/agents/qbot", json={"active": False})
        assert resp.status_code in (401, 403, 422)

    def test_patch_agents_with_valid_key(self, tmp_path, monkeypatch):
        monkeypatch.setenv("ADMIN_API_KEY", ADMIN_KEY)
        import bridge.webhook_receiver as wr
        wr.ADMIN_API_KEY = ADMIN_KEY
        from unittest.mock import patch as mpatch
        from core.agent_profile import DEFAULT_AGENTS
        client = TestClient(app)
        # Mock update_profile AND the audit log write to avoid /app path issues
        with mpatch("bridge.webhook_receiver.update_profile", return_value={**DEFAULT_AGENTS[0], "active": False}), \
             mpatch("bridge.webhook_receiver._write_audit", return_value=None):
            resp = client.patch(
                "/agents/qbot",
                json={"active": False},
                headers={"X-Admin-Key": ADMIN_KEY},
            )
        assert resp.status_code == 200

    def test_admin_flags_endpoint(self, monkeypatch, tmp_path):
        monkeypatch.setenv("ADMIN_API_KEY", ADMIN_KEY)
        monkeypatch.setenv("FLAGS_PATH", str(tmp_path / "flags.json"))
        import bridge.webhook_receiver as wr
        wr.ADMIN_API_KEY = ADMIN_KEY
        wr.FLAGS_PATH = str(tmp_path / "flags.json")
        client = TestClient(app)
        resp = client.get("/admin/flags", headers={"X-Admin-Key": ADMIN_KEY})
        assert resp.status_code == 200
        assert "flags" in resp.json()

    def test_kill_switch_disables_flags(self, monkeypatch, tmp_path):
        monkeypatch.setenv("ADMIN_API_KEY", ADMIN_KEY)
        monkeypatch.setenv("FLAGS_PATH", str(tmp_path / "flags.json"))
        monkeypatch.setenv("AUDIT_LOG_PATH", str(tmp_path / "audit.json"))
        import bridge.webhook_receiver as wr
        wr.ADMIN_API_KEY = ADMIN_KEY
        wr.FLAGS_PATH = str(tmp_path / "flags.json")
        wr.AUDIT_LOG_PATH = str(tmp_path / "audit.json")
        client = TestClient(app)
        resp = client.post("/admin/kill-switch", headers={"X-Admin-Key": ADMIN_KEY})
        assert resp.status_code == 200
        flags = resp.json()["flags"]
        assert flags["agent_execution_enabled"] is False
        assert flags["new_task_submission_enabled"] is False


class TestCreditEndpoints:
    def test_get_credits_creates_wallet(self, tmp_path, monkeypatch):
        monkeypatch.setenv("CREDITS_PATH", str(tmp_path / "credits.json"))
        import core.credit_wallet as cw
        cw.CREDITS_PATH = str(tmp_path / "credits.json")
        client = TestClient(app)
        resp = client.get("/credits/user_test?tier=free")
        assert resp.status_code == 200
        assert resp.json()["balance"] == 50

    def test_deduct_credits_endpoint(self, tmp_path, monkeypatch):
        monkeypatch.setenv("CREDITS_PATH", str(tmp_path / "credits.json"))
        import core.credit_wallet as cw
        cw.CREDITS_PATH = str(tmp_path / "credits.json")
        # Seed wallet
        cw.get_wallet("user_test", "pro")
        client = TestClient(app)
        resp = client.post("/credits/user_test/deduct", json={"action": "ai_chat", "tier": "pro"})
        assert resp.status_code == 200
        assert resp.json()["cost"] == 5
        assert resp.json()["balance"] == 2000 - 5

    def test_deduct_credits_returns_402_when_broke(self, tmp_path, monkeypatch):
        monkeypatch.setenv("CREDITS_PATH", str(tmp_path / "credits.json"))
        import core.credit_wallet as cw
        cw.CREDITS_PATH = str(tmp_path / "credits.json")
        cw.get_wallet("user_broke", "free")
        # Drain balance
        data = json.load(open(cw.CREDITS_PATH))
        data["users"]["user_broke"]["balance"] = 0
        json.dump(data, open(cw.CREDITS_PATH, "w"))
        client = TestClient(app)
        resp = client.post("/credits/user_broke/deduct", json={"action": "generate_content", "tier": "free"})
        assert resp.status_code == 402
