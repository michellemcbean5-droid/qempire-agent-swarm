"""Admin setup — paste platform keys into one screen instead of editing .env.

Flow:
  * First run: no password exists, so /admin lets the owner *claim* one.
  * After that: unlock with that password, then paste/update keys.

Keys are written to the server's .env (so they survive restarts) and applied to
the running API process (best effort) so most changes take effect immediately.
The background agent worker picks them up on its next run. Secret values are
never returned in full — only masked previews.
"""
import importlib
import os

from core import config

# Only these keys may be set through the admin page (allowlist).
ALLOWED_KEYS = [
    # Model
    "KIMI_API_KEY", "KIMI_MODEL", "KIMI_BASE_URL", "ANTHROPIC_API_KEY",
    # Billing (Stripe)
    "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_CURRENT", "STRIPE_PRICE_REEF", "STRIPE_PRICE_DEEP_BLUE",
    "STRIPE_PRICE_PACK_5K", "STRIPE_PRICE_PACK_20K",
    # Deploy / comms
    "GITHUB_TOKEN", "GITHUB_USERNAME",
    "GMAIL_ADDRESS", "GMAIL_APP_PASSWORD",
    "GOOGLE_SHEET_ID",
]

# Keys treated as secret (masked in status). The rest are shown in full.
SECRET_KEYS = {
    "KIMI_API_KEY", "ANTHROPIC_API_KEY",
    "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET",
    "GITHUB_TOKEN", "GMAIL_APP_PASSWORD",
}


class AdminDisabled(RuntimeError):
    """No admin password has been claimed yet, or input invalid."""


class AdminUnauthorized(RuntimeError):
    """Provided token doesn't match / claim not allowed."""


def is_configured() -> bool:
    """True once an admin password has been claimed."""
    return bool(config.ADMIN_TOKEN)


def _check(token: str) -> None:
    if not config.ADMIN_TOKEN:
        raise AdminDisabled("No admin password set yet — claim one first.")
    if not token or token != config.ADMIN_TOKEN:
        raise AdminUnauthorized("Wrong admin password.")


def _mask(value: str) -> str:
    if not value:
        return ""
    if len(value) <= 8:
        return "••••"
    return value[:4] + "…" + value[-4:]


def _read_env() -> dict:
    data = {}
    if os.path.exists(config.ENV_PATH):
        with open(config.ENV_PATH) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                data[k.strip()] = v.strip()
    return data


def _write_env(updates: dict) -> None:
    """Merge updates into the .env file, preserving other lines and comments."""
    lines = []
    seen = set()
    if os.path.exists(config.ENV_PATH):
        with open(config.ENV_PATH) as f:
            for line in f:
                raw = line.rstrip("\n")
                stripped = raw.strip()
                if stripped and not stripped.startswith("#") and "=" in stripped:
                    key = stripped.split("=", 1)[0].strip()
                    if key in updates:
                        lines.append(f"{key}={updates[key]}")
                        seen.add(key)
                        continue
                lines.append(raw)
    for k, v in updates.items():
        if k not in seen:
            lines.append(f"{k}={v}")
    os.makedirs(os.path.dirname(config.ENV_PATH) or ".", exist_ok=True)
    with open(config.ENV_PATH, "w") as f:
        f.write("\n".join(lines) + "\n")


def _apply_live(updates: dict) -> None:
    """Apply to the running API process so it doesn't need a restart.

    core.llm and bridge.billing bind config values as module globals at import
    time, so we rebind those globals directly; the Stripe price maps are shared
    dict objects, so we update them in place.
    """
    for k, v in updates.items():
        os.environ[k] = v
        if hasattr(config, k):
            setattr(config, k, v)

    for mod_name in ("core.llm", "bridge.billing"):
        try:
            mod = importlib.import_module(mod_name)
        except Exception:
            continue
        for k, v in updates.items():
            if hasattr(mod, k):
                setattr(mod, k, v)

    # Refresh the shared Stripe price dicts in place.
    price_to_plan = {
        "STRIPE_PRICE_CURRENT": "diy-standard",
        "STRIPE_PRICE_REEF": "diy-plus",
        "STRIPE_PRICE_DEEP_BLUE": "diy-pro",
    }
    for env_key, plan_id in price_to_plan.items():
        if env_key in updates:
            config.STRIPE_PRICES[plan_id] = updates[env_key]
    if "STRIPE_PRICE_PACK_5K" in updates:
        config.STRIPE_CREDIT_PACKS["pack-5k"] = (updates["STRIPE_PRICE_PACK_5K"], 5000)
    if "STRIPE_PRICE_PACK_20K" in updates:
        config.STRIPE_CREDIT_PACKS["pack-20k"] = (updates["STRIPE_PRICE_PACK_20K"], 20000)


def status(token: str) -> dict:
    """Return which keys are set (masked). Requires the admin token."""
    _check(token)
    env = _read_env()
    keys = {}
    for k in ALLOWED_KEYS:
        val = os.environ.get(k) or env.get(k, "")
        keys[k] = {"set": bool(val), "preview": _mask(val) if k in SECRET_KEYS else val}
    return {"configured": True, "keys": keys}


def claim(new_token: str) -> dict:
    """First-run only: set the admin password. Fails if one already exists."""
    if config.ADMIN_TOKEN:
        raise AdminUnauthorized("An admin password already exists.")
    new_token = (new_token or "").strip()
    if len(new_token) < 6:
        raise AdminDisabled("Choose a password with at least 6 characters.")
    _write_env({"ADMIN_TOKEN": new_token})
    os.environ["ADMIN_TOKEN"] = new_token
    config.ADMIN_TOKEN = new_token
    return status(new_token)


def save(token: str, keys: dict) -> dict:
    """Save provided keys to .env and apply them live. Requires the admin token."""
    _check(token)
    updates = {k: str(v).strip() for k, v in (keys or {}).items() if k in ALLOWED_KEYS and str(v).strip()}
    if updates:
        _write_env(updates)
        _apply_live(updates)
    result = status(token)
    result["saved"] = len(updates)
    return result
