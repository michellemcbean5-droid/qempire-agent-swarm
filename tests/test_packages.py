"""Tests for Q-Empire subscription package configuration and API."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_package_definitions():
    """Test that subscription tiers are defined and aligned with blueprint."""
    from core.config import PACKAGES

    assert "starter" in PACKAGES
    assert "foundation" in PACKAGES
    assert "empire-pro" in PACKAGES
    assert "enterprise" in PACKAGES

    for pkg_id, config in PACKAGES.items():
        assert "name" in config
        assert "price" in config
        assert "tasks" in config
        assert "max_automations" in config
        assert "max_pages" in config
        assert isinstance(config["tasks"], list)
        assert config["max_automations"] > 0
        assert config["max_pages"] > 0

    print("✓ Package definitions are valid")


def test_empire_pro_has_branding():
    """Test that Empire Pro includes branding generation."""
    from core.config import PACKAGES

    empire_pro = PACKAGES["empire-pro"]
    assert "GENERATE_BRANDING" in empire_pro["tasks"]
    assert empire_pro["max_automations"] == 10
    assert empire_pro["max_pages"] == 7
    print("✓ Empire Pro package configured correctly")


def test_webhook_package_endpoint():
    """Test the /packages endpoint returns subscription tiers."""
    from fastapi.testclient import TestClient
    from bridge.webhook_receiver import app

    client = TestClient(app)
    response = client.get("/packages")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["packages"]) >= 4

    package_ids = {pkg["id"] for pkg in data["packages"]}
    assert "starter" in package_ids
    assert "foundation" in package_ids
    assert "empire-pro" in package_ids
    assert "enterprise" in package_ids
    print("✓ /packages endpoint returns subscription tiers")


def test_webhook_onboard_validation():
    """Test that onboarding rejects invalid package IDs."""
    from fastapi.testclient import TestClient
    from bridge.webhook_receiver import app

    client = TestClient(app)
    response = client.post("/onboard", json={
        "package_id": "invalid-package",
        "email": "test@example.com",
        "business_name": "TestCo",
    })
    assert response.status_code == 400
    print("✓ /onboard validates package IDs")


def test_webhook_onboard_creates_tasks():
    """Test that onboarding creates tasks for a valid package."""
    import tempfile
    import json
    from fastapi.testclient import TestClient
    from bridge import webhook_receiver
    from bridge.webhook_receiver import app

    # Use a temporary bridge file
    with tempfile.NamedTemporaryFile(mode="w+", suffix=".json", delete=False) as f:
        json.dump({"pending": [], "needs_clarification": [], "completed": []}, f)
        temp_bridge = f.name

    original_bridge_path = webhook_receiver.BRIDGE_PATH
    try:
        webhook_receiver.BRIDGE_PATH = temp_bridge
        client = TestClient(app)
        response = client.post("/onboard", json={
            "package_id": "foundation",
            "email": "test@example.com",
            "business_name": "TestCo",
            "automations_selected": ["lead-chatbot", "email-welcome"],
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["package"] == "foundation"
        assert len(data["tasks_created"]) > 0
        print(f"✓ /onboard created {len(data['tasks_created'])} tasks")
    finally:
        webhook_receiver.BRIDGE_PATH = original_bridge_path
        os.remove(temp_bridge)


if __name__ == "__main__":
    print("Running Q-Empire Package Tests...")
    print("=" * 40)
    test_package_definitions()
    test_empire_pro_has_branding()
    test_webhook_package_endpoint()
    test_webhook_onboard_validation()
    test_webhook_onboard_creates_tasks()
    print("=" * 40)
    print("All package tests passed!")
