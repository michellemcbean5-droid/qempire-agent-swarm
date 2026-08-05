"""Tests for the AI credit wallet."""
import pytest
import os
import json
import tempfile
import time
from unittest.mock import patch


@pytest.fixture(autouse=True)
def tmp_credits(tmp_path, monkeypatch):
    """Use a temp file for credits in each test."""
    path = str(tmp_path / "credits.json")
    monkeypatch.setenv("CREDITS_PATH", path)
    # Patch the module-level variable directly
    import core.credit_wallet as cw
    monkeypatch.setattr(cw, "CREDITS_PATH", path)
    yield path


def test_get_wallet_creates_default(tmp_credits):
    import importlib
    import core.credit_wallet as cw
    importlib.reload(cw)
    cw.CREDITS_PATH = tmp_credits
    wallet = cw.get_wallet("user_001", "free")
    assert wallet["balance"] == 50  # free tier initial
    assert wallet["tier"] == "free"
    assert wallet["spent_today"] == 0


def test_get_wallet_pro_initial_credits(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    wallet = cw.get_wallet("user_pro", "pro")
    assert wallet["balance"] == 2000


def test_can_spend_allows_when_sufficient(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_001", "pro")
    allowed, reason = cw.can_spend("user_001", "generate_content", "pro")
    assert allowed is True
    assert reason == "ok"


def test_can_spend_blocks_when_balance_zero(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_broke", "free")
    data = json.loads(open(tmp_credits).read())
    data["users"]["user_broke"]["balance"] = 0
    with open(tmp_credits, "w") as f:
        json.dump(data, f)
    allowed, reason = cw.can_spend("user_broke", "generate_content", "free")
    assert allowed is False
    assert "credits" in reason.lower()


def test_deduct_credits_reduces_balance(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_001", "pro")
    result = cw.deduct_credits("user_001", "generate_content", "pro")
    assert result["cost"] == 10
    assert result["balance"] == 2000 - 10
    assert result["spent_today"] == 10


def test_deduct_credits_raises_on_insufficient(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_broke", "free")
    data = json.loads(open(tmp_credits).read())
    data["users"]["user_broke"]["balance"] = 0
    with open(tmp_credits, "w") as f:
        json.dump(data, f)
    with pytest.raises(ValueError, match="credits"):
        cw.deduct_credits("user_broke", "generate_content", "free")


def test_daily_cap_blocks_overspend(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_001", "free")
    # Set spent_today near cap and set the cap
    data = json.loads(open(tmp_credits).read())
    data["users"]["user_001"]["spent_today"] = 490
    data["admin"] = {"daily_cap": 500}
    with open(tmp_credits, "w") as f:
        json.dump(data, f)
    # generate_content costs 10; 490+10=500 which equals the cap (>= check uses >)
    # Use a cost > remaining: remaining = 10, any cost > 10
    # Use shell_exec (cost=1) pushing from 490 to 491 — still allowed
    # Use generate_content (cost=10) pushing from 490 to 500 — equals cap, still ok
    # Use generate_website (cost=20) pushing from 490 to 510 — blocked
    allowed, reason = cw.can_spend("user_001", "generate_website", "free")
    assert allowed is False
    assert "cap" in reason.lower()


def test_top_up_increases_balance(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_001", "free")
    result = cw.top_up_credits("user_001", 100, "free", "test")
    assert result["added"] == 100
    assert result["balance"] == 150  # 50 initial + 100


def test_admin_summary(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    cw.get_wallet("user_a", "free")
    cw.get_wallet("user_b", "pro")
    summary = cw.get_admin_summary()
    assert summary["total_users"] == 2
    assert summary["total_balance_remaining"] > 0


def test_set_daily_cap(tmp_credits):
    import core.credit_wallet as cw
    cw.CREDITS_PATH = tmp_credits
    result = cw.set_daily_cap(999)
    assert result["daily_cap"] == 999
    data = cw._load_credits()
    assert data["admin"]["daily_cap"] == 999
