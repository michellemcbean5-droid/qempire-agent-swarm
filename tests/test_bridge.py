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


class TestBridgeMonitor:
    def test_load_bridge_creates_default(self, tmp_path):
        bridge_path = str(tmp_path / "bridge.json")
        # Monkey-patch BRIDGE_PATH for this test
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
    def test_root_health_check(self):
        client = TestClient(app)
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "online"

    def test_create_task(self, tmp_path, monkeypatch):
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))
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

    def test_onboard_endpoint(self, tmp_path, monkeypatch):
        import bridge.webhook_receiver as wr
        monkeypatch.setattr(wr, "BRIDGE_PATH", str(tmp_path / "bridge.json"))
        client = TestClient(app)
        payload = {"package_id": "foundation", "email": "test@example.com", "business_name": "TestCo"}
        response = client.post("/onboard", json=payload)
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["package"] == "foundation"
        assert len(response.json()["tasks_created"]) > 0
