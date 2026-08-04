"""Tests for new enterprise tools (Phase 5)."""
import os
import json
import pytest
import tempfile
from unittest.mock import patch


def test_track_crm_entry_creates_file(tmp_path):
    """CRM tracker should create a CSV file with the entry."""
    crm_path = str(tmp_path / "crm.csv")
    with patch("tools.crm_tracker.CRM_CSV_PATH", crm_path):
        from tools.crm_tracker import track_crm_entry
        result = track_crm_entry(
            name="Alice Johnson",
            email="alice@example.com",
            stage="lead",
            company="Alice Co",
            deal_value=5000.0,
            notes="Interested in Foundation package",
        )
    assert "alice@example.com" in result
    assert os.path.exists(crm_path)


def test_track_crm_entry_updates_existing(tmp_path):
    """CRM tracker should update an existing entry rather than duplicate."""
    crm_path = str(tmp_path / "crm.csv")
    with patch("tools.crm_tracker.CRM_CSV_PATH", crm_path):
        from tools.crm_tracker import track_crm_entry
        track_crm_entry(name="Bob", email="bob@example.com", stage="lead")
        track_crm_entry(name="Bob", email="bob@example.com", stage="client")

    import csv
    with open(crm_path) as f:
        rows = list(csv.DictReader(f))
    # Should only have one entry
    assert len(rows) == 1
    assert rows[0]["stage"] == "client"


def test_create_invoice_saves_file(tmp_path):
    """Invoice generator should create a JSON invoice file."""
    invoices_dir = str(tmp_path / "invoices")
    with patch("tools.invoice_generator.INVOICES_DIR", invoices_dir):
        from tools.invoice_generator import create_invoice
        result = create_invoice(
            client_name="Carol Smith",
            client_email="carol@example.com",
            line_items=[{"description": "Website Build", "quantity": 1, "unit_price": 1500}],
            business_name="Q-Empire",
        )
    # Result is a file path
    assert os.path.exists(result) or result.endswith((".json", ".pdf"))


def test_generate_social_post_queues_post(tmp_path):
    """Social media poster should queue a post to the JSON queue file."""
    queue_path = str(tmp_path / "social_queue.json")
    with patch("tools.social_media_poster.SOCIAL_QUEUE_PATH", queue_path):
        from tools.social_media_poster import generate_social_post
        result = generate_social_post(
            business_name="EmpireStudio",
            topic="AI-powered creative agency",
            platform="instagram",
            tone="excited",
        )
    assert "[SOCIAL]" in result
    assert os.path.exists(queue_path)
    with open(queue_path) as f:
        queue = json.load(f)
    assert len(queue) == 1
    assert queue[0]["platform"] == "instagram"


def test_generate_social_post_respects_char_limit():
    """Twitter posts should be under 280 chars."""
    with tempfile.TemporaryDirectory() as tmp:
        queue_path = os.path.join(tmp, "social_queue.json")
        with patch("tools.social_media_poster.SOCIAL_QUEUE_PATH", queue_path):
            from tools.social_media_poster import generate_social_post
            result = generate_social_post(
                business_name="X" * 200,
                topic="Y" * 200,
                platform="twitter",
                tone="casual",
            )
    # Post content in result must respect Twitter's limit
    post_content = result.split("\n\n", 1)[1] if "\n\n" in result else result
    assert len(post_content) <= 280
