"""Configuration and constants for the Q-Empire Agent Swarm."""
import os
from dotenv import load_dotenv

load_dotenv()

# LLM Configuration
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL = "claude-sonnet-4-20250514"
LLM_TEMPERATURE = 0.3
LLM_MAX_TOKENS = 4096

# Kimi / Moonshot (default model for paid users — OpenAI-compatible API).
# Provide KIMI_API_KEY (a.k.a. MOONSHOT_API_KEY) to run the swarm on Kimi.
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "") or os.getenv("MOONSHOT_API_KEY", "")
KIMI_BASE_URL = os.getenv("KIMI_BASE_URL", "https://api.moonshot.ai/v1")
KIMI_MODEL = os.getenv("KIMI_MODEL", "kimi-k2.5")

# ---- Credit economics (see docs/PRICING_ECONOMICS.md) ----
# 1 credit meters this many blended Kimi tokens. Charging ceil(tokens / TOKENS_PER_CREDIT)
# credits per run keeps every task at/above the target markup by construction.
TOKENS_PER_CREDIT = int(os.getenv("TOKENS_PER_CREDIT", "1700"))
CREDIT_SELL_USD = float(os.getenv("CREDIT_SELL_USD", "0.0035"))   # our price per credit (30% below Manus $0.005)
TARGET_MARKUP = float(os.getenv("TARGET_MARKUP", "0.45"))         # 45% markup goal

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
BRIDGE_PATH = os.getenv("BRIDGE_PATH", "/app/memory/bridge.json")

# Output Directories
OUTPUT_DIR = "/home/ubuntu/output"
WEBSITES_DIR = f"{OUTPUT_DIR}/websites"
DOCUMENTS_DIR = f"{OUTPUT_DIR}/documents"
WORKSPACE_DIR = "/home/ubuntu/workspace"

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
