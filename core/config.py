"""Configuration and constants for the Q-Empire Agent Swarm."""
import os
from dotenv import load_dotenv

load_dotenv()

# ─── Repo root (works both inside Docker /app and in dev/CI) ─────────────────
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DEFAULT_BRIDGE = os.path.join(_REPO_ROOT, "memory", "bridge.json")
_DEFAULT_OUTPUT = os.path.join(_REPO_ROOT, "output")

# LLM Configuration
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL = "claude-sonnet-4-20250514"
LLM_TEMPERATURE = 0.3
LLM_MAX_TOKENS = 4096

# GitHub Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "")

# Google Sheets Configuration
GOOGLE_CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH", "/app/credentials.json")
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "")

# Email Configuration
GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")

# Agent Configuration
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "300"))
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))

# Bridge path: prefer env var, then Docker default /app, then repo-relative fallback
BRIDGE_PATH = os.getenv("BRIDGE_PATH", "/app/memory/bridge.json" if os.path.isdir("/app") else _DEFAULT_BRIDGE)

# Admin API key (for protected admin endpoints)
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")

# Output Directories — fall back to repo-local paths when not in Docker
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/home/ubuntu/output" if os.path.isdir("/home/ubuntu") else os.path.join(_REPO_ROOT, "output"))
WEBSITES_DIR = f"{OUTPUT_DIR}/websites"
DOCUMENTS_DIR = f"{OUTPUT_DIR}/documents"
WORKSPACE_DIR = os.getenv("WORKSPACE_DIR", "/home/ubuntu/workspace" if os.path.isdir("/home/ubuntu") else os.path.join(_REPO_ROOT, "workspace"))

# AI Cost Controls
MAX_TOKENS_PER_TASK = int(os.getenv("MAX_TOKENS_PER_TASK", "8000"))   # Hard cap per agent task
COST_PER_1K_INPUT_TOKENS = 0.003   # Claude Sonnet approximate USD/1K input tokens
COST_PER_1K_OUTPUT_TOKENS = 0.015  # Claude Sonnet approximate USD/1K output tokens
MAX_COST_PER_TASK_USD = float(os.getenv("MAX_COST_PER_TASK_USD", "0.50"))  # $0.50 default cap

# Task Types
TASK_TYPES = [
    "BUILD_WEBSITE",
    "BUILD_BLUEPRINT",
    "BUILD_PITCH_DECK",
    "SETUP_AUTOMATIONS",
    "RESEARCH_FUNDING",
    "GENERATE_BRANDING",
    "FULL_FOUNDATION",
    "FULL_EMPIRE_PRO",
    "FULL_ENTERPRISE",
    # Phase 3 additions
    "SETUP_CRM",
    "CREATE_INVOICE",
    "POST_SOCIAL_MEDIA",
    "RESEARCH_COMPETITOR",
    "SEND_DAILY_REPORT",
    "GENERATE_CONTRACT",
    "ANALYZE_SEO",
    # Internal / content
    "GENERATE_CONTENT",
]

# Package Definitions
PACKAGES = {
    "foundation": {
        "name": "Foundation Launchpad",
        "price": 1997,
        "tasks": ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING"],
        "max_automations": 3,
        "max_pages": 3,
    },
    "empire-pro": {
        "name": "Empire Builder Pro",
        "price": 4997,
        "tasks": ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING", "GENERATE_BRANDING"],
        "max_automations": 10,
        "max_pages": 7,
    },
    "enterprise": {
        "name": "Enterprise AI",
        "price": 15000,
        "tasks": ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS"],
        "max_automations": 999,
        "max_pages": 999,
    },
    "payg": {
        "name": "Pay-As-You-Go",
        "price": 250,
        "tasks": [],  # Dynamic based on modules selected
        "max_automations": 999,
        "max_pages": 999,
    },
}

# Feature Flags — runtime toggles (can be overridden via admin API)
DEFAULT_FEATURE_FLAGS: dict[str, bool] = {
    "ai_generation_enabled": True,
    "onboarding_enabled": True,
    "new_task_queue_enabled": True,
    "spend_cap_enforced": True,
}
