"""Configuration and constants for the Social Autopilot module."""
import os

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # pragma: no cover - dotenv is optional at runtime
    pass

# --- LLM (reused from the agent swarm where available) -----------------------
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL = os.getenv("SOCIAL_LLM_MODEL", "claude-sonnet-4-20250514")
LLM_TEMPERATURE = 0.8
LLM_MAX_TOKENS = 1024

# --- Platform limits ---------------------------------------------------------
# Character limits used by the content engine to keep captions valid.
PLATFORM_LIMITS = {
    "twitter": {"caption": 280, "hashtags": 3},
    "instagram": {"caption": 2200, "hashtags": 12},
    "linkedin": {"caption": 3000, "hashtags": 5},
    "facebook": {"caption": 63206, "hashtags": 5},
    "tiktok": {"caption": 2200, "hashtags": 8},
}

# --- Default posting cadence -------------------------------------------------
# Preferred posting hours (local, 24h) per platform. The scheduler spreads a
# campaign across these slots.
POSTING_SLOTS = {
    "twitter": [9, 12, 17, 20],
    "instagram": [11, 15, 19],
    "linkedin": [8, 12, 17],
    "facebook": [10, 14, 19],
    "tiktok": [12, 18, 21],
}

# --- Brand voice defaults ----------------------------------------------------
DEFAULT_BRAND_VOICE = {
    "name": "Q-Empire",
    "tone": "bold, motivational, entrepreneurial",
    "emoji": True,
    "cta": "Automate your empire today.",
    "hashtags_base": ["#QEmpire", "#AIautomation", "#Entrepreneur"],
}

# --- Runtime -----------------------------------------------------------------
BRIDGE_PATH = os.getenv("BRIDGE_PATH", "memory/bridge.json")
OUTPUT_DIR = os.getenv("SOCIAL_OUTPUT_DIR", "output/social")

# When true (default), publishers only simulate posting and never hit a live
# API. Set SOCIAL_DRY_RUN=0 to enable real publishing (requires platform creds).
DRY_RUN = os.getenv("SOCIAL_DRY_RUN", "1") != "0"
