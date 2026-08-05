"""
AI Credit Wallet — per-user credit tracking and enforcement.

Credits are deducted for every AI/LLM call. When balance reaches 0
or a hard cap is hit, further calls are blocked.
"""
import os
import json
import time
from typing import Optional

CREDITS_PATH = os.getenv("CREDITS_PATH", "/app/memory/credits.json")

# Default credit grants per tier
TIER_INITIAL_CREDITS = {
    "free": 50,
    "basic": 500,
    "pro": 2000,
    "elite": 10000,
}

# Cost per operation (in credits)
CREDIT_COSTS = {
    "generate_content": 10,
    "browser_navigate": 2,
    "browser_search": 2,
    "generate_website": 20,
    "generate_document": 15,
    "deploy_to_github": 5,
    "send_email": 1,
    "track_crm_entry": 1,
    "create_invoice": 2,
    "generate_social_post": 5,
    "shell_exec": 1,
    "file_write": 1,
    "file_read": 0,
    "default": 5,
}

# Hard cap: no user may spend more than this per day (in credits)
DAILY_HARD_CAP = int(os.getenv("DAILY_CREDIT_CAP", "500"))


def _load_credits() -> dict:
    if os.path.exists(CREDITS_PATH):
        with open(CREDITS_PATH, "r") as f:
            return json.load(f)
    return {"users": {}, "admin": {"daily_cap": DAILY_HARD_CAP}}


def _save_credits(data: dict) -> None:
    os.makedirs(os.path.dirname(CREDITS_PATH), exist_ok=True)
    with open(CREDITS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def _today() -> str:
    return time.strftime("%Y-%m-%d")


def get_wallet(user_id: str, tier: str = "free") -> dict:
    """Return the credit wallet for a user, creating it if needed."""
    data = _load_credits()
    users = data.setdefault("users", {})
    if user_id not in users:
        users[user_id] = {
            "balance": TIER_INITIAL_CREDITS.get(tier, TIER_INITIAL_CREDITS["free"]),
            "tier": tier,
            "spent_today": 0,
            "last_reset_date": _today(),
            "lifetime_spent": 0,
            "usage_log": [],
        }
        _save_credits(data)
    wallet = users[user_id]
    # Reset daily counter if new day
    if wallet.get("last_reset_date") != _today():
        wallet["spent_today"] = 0
        wallet["last_reset_date"] = _today()
        _save_credits(data)
    return wallet


def can_spend(user_id: str, action: str, tier: str = "free") -> tuple[bool, str]:
    """Check whether a user can spend credits for an action.

    Returns (allowed: bool, reason: str).
    """
    wallet = get_wallet(user_id, tier)
    cost = CREDIT_COSTS.get(action, CREDIT_COSTS["default"])
    admin_data = _load_credits().get("admin", {})
    daily_cap = admin_data.get("daily_cap", DAILY_HARD_CAP)

    if wallet["balance"] <= 0:
        return False, "Insufficient AI credits. Please top up your balance."
    if cost > wallet["balance"]:
        return False, f"Action requires {cost} credits but you only have {wallet['balance']}."
    if wallet["spent_today"] + cost > daily_cap:
        return False, f"Daily spend cap of {daily_cap} credits reached. Resets tomorrow."
    return True, "ok"


def deduct_credits(user_id: str, action: str, tier: str = "free", task_id: Optional[str] = None) -> dict:
    """Deduct credits for an action. Returns updated wallet snapshot.

    Raises ValueError if the user cannot afford the action.
    """
    allowed, reason = can_spend(user_id, action, tier)
    if not allowed:
        raise ValueError(reason)

    data = _load_credits()
    wallet = data["users"][user_id]
    cost = CREDIT_COSTS.get(action, CREDIT_COSTS["default"])

    wallet["balance"] -= cost
    wallet["spent_today"] += cost
    wallet["lifetime_spent"] += cost
    wallet["usage_log"].append({
        "action": action,
        "cost": cost,
        "task_id": task_id,
        "timestamp": time.time(),
        "date": _today(),
    })
    # Keep usage log bounded
    wallet["usage_log"] = wallet["usage_log"][-500:]

    _save_credits(data)
    return {
        "balance": wallet["balance"],
        "spent_today": wallet["spent_today"],
        "cost": cost,
        "action": action,
    }


def top_up_credits(user_id: str, amount: int, tier: str = "free", reason: str = "top_up") -> dict:
    """Add credits to a user's wallet (admin/billing action)."""
    data = _load_credits()
    wallet = data["users"].setdefault(user_id, {
        "balance": 0,
        "tier": tier,
        "spent_today": 0,
        "last_reset_date": _today(),
        "lifetime_spent": 0,
        "usage_log": [],
    })
    wallet["balance"] += amount
    wallet["tier"] = tier
    wallet["usage_log"].append({
        "action": f"top_up:{reason}",
        "cost": -amount,
        "task_id": None,
        "timestamp": time.time(),
        "date": _today(),
    })
    _save_credits(data)
    return {"balance": wallet["balance"], "added": amount}


def get_admin_summary() -> dict:
    """Return aggregate credit usage stats for the admin dashboard."""
    data = _load_credits()
    users = data.get("users", {})
    total_spent = sum(u.get("lifetime_spent", 0) for u in users.values())
    total_balance = sum(u.get("balance", 0) for u in users.values())
    today = _today()
    spent_today = sum(u.get("spent_today", 0) for u in users.values() if u.get("last_reset_date") == today)
    return {
        "total_users": len(users),
        "total_balance_remaining": total_balance,
        "total_lifetime_spent": total_spent,
        "total_spent_today": spent_today,
        "daily_cap": data.get("admin", {}).get("daily_cap", DAILY_HARD_CAP),
        "users": [
            {
                "user_id": uid,
                "balance": u.get("balance", 0),
                "spent_today": u.get("spent_today", 0),
                "lifetime_spent": u.get("lifetime_spent", 0),
                "tier": u.get("tier", "free"),
            }
            for uid, u in users.items()
        ],
    }


def set_daily_cap(new_cap: int) -> dict:
    """Admin: update the global daily spend cap."""
    data = _load_credits()
    data.setdefault("admin", {})["daily_cap"] = new_cap
    _save_credits(data)
    return {"daily_cap": new_cap}
