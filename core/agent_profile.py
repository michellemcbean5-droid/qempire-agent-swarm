"""
Agent Profile — Defines the personality, attitude, schedule, and specialty
for each agent in the Q-Empire swarm.
"""
from typing import TypedDict, Literal


# Valid personality options
Personality = Literal["professional", "friendly", "aggressive", "creative", "analytical"]

# Valid attitude options
Attitude = Literal["motivating", "strict", "relaxed", "urgent", "balanced"]

# Agent specialty areas
Specialty = Literal["marketing", "finance", "operations", "legal", "tech", "sales", "general"]


class WorkSchedule(TypedDict):
    """Agent work schedule configuration."""
    timezone: str           # e.g. "America/New_York"
    work_days: list[int]    # 0=Mon, 1=Tue, ... 6=Sun
    work_start: str         # "HH:MM" in 24h format
    work_end: str           # "HH:MM" in 24h format
    max_tasks_per_day: int


class AgentProfile(TypedDict):
    """Full profile for a customizable Q-Empire agent."""
    id: str                     # unique agent ID, e.g. "marketing-agent"
    name: str                   # display name, e.g. "Maya — Marketing"
    specialty: Specialty
    personality: Personality
    attitude: Attitude
    schedule: WorkSchedule
    active: bool                # whether this agent is enabled
    tasks_completed: int        # lifetime counter
    current_task_id: str | None # ID of task currently assigned


DEFAULT_SCHEDULE: WorkSchedule = {
    "timezone": "America/New_York",
    "work_days": [0, 1, 2, 3, 4],  # Mon–Fri
    "work_start": "09:00",
    "work_end": "17:00",
    "max_tasks_per_day": 20,
}

DEFAULT_AGENTS: list[AgentProfile] = [
    {
        "id": "qbot",
        "name": "Q-Bot — Master Orchestrator",
        "specialty": "general",
        "personality": "professional",
        "attitude": "motivating",
        "schedule": {**DEFAULT_SCHEDULE, "timezone": "UTC", "work_days": [0, 1, 2, 3, 4, 5, 6], "work_start": "00:00", "work_end": "23:59", "max_tasks_per_day": 999},
        "active": True,
        "tasks_completed": 0,
        "current_task_id": None,
    },
    {
        "id": "marketing-agent",
        "name": "Maya — Marketing",
        "specialty": "marketing",
        "personality": "creative",
        "attitude": "motivating",
        "schedule": DEFAULT_SCHEDULE,
        "active": True,
        "tasks_completed": 0,
        "current_task_id": None,
    },
    {
        "id": "finance-agent",
        "name": "Fiona — Finance",
        "specialty": "finance",
        "personality": "analytical",
        "attitude": "strict",
        "schedule": DEFAULT_SCHEDULE,
        "active": True,
        "tasks_completed": 0,
        "current_task_id": None,
    },
    {
        "id": "tech-agent",
        "name": "Theo — Tech",
        "specialty": "tech",
        "personality": "professional",
        "attitude": "balanced",
        "schedule": DEFAULT_SCHEDULE,
        "active": True,
        "tasks_completed": 0,
        "current_task_id": None,
    },
    {
        "id": "legal-agent",
        "name": "Lexi — Legal",
        "specialty": "legal",
        "personality": "professional",
        "attitude": "strict",
        "schedule": DEFAULT_SCHEDULE,
        "active": True,
        "tasks_completed": 0,
        "current_task_id": None,
    },
    {
        "id": "sales-agent",
        "name": "Sam — Sales",
        "specialty": "sales",
        "personality": "aggressive",
        "attitude": "urgent",
        "schedule": DEFAULT_SCHEDULE,
        "active": True,
        "tasks_completed": 0,
        "current_task_id": None,
    },
]

# Map task types to best-fit agent specialty
TASK_AGENT_MAP: dict[str, Specialty] = {
    "BUILD_WEBSITE": "tech",
    "BUILD_BLUEPRINT": "operations",
    "BUILD_PITCH_DECK": "marketing",
    "SETUP_AUTOMATIONS": "tech",
    "RESEARCH_FUNDING": "finance",
    "GENERATE_BRANDING": "marketing",
    "SETUP_CRM": "sales",
    "CREATE_INVOICE": "finance",
    "POST_SOCIAL_MEDIA": "marketing",
    "RESEARCH_COMPETITOR": "marketing",
    "SEND_DAILY_REPORT": "general",
    "FULL_FOUNDATION": "general",
    "FULL_EMPIRE_PRO": "general",
    "FULL_ENTERPRISE": "general",
}
