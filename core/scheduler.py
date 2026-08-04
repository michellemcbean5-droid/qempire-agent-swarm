"""
Scheduler — Determines whether an agent is available to work based on its schedule.
Handles timezone conversion and daily task limits.
"""
from datetime import datetime
import zoneinfo
from core.agent_profile import AgentProfile, WorkSchedule


def is_agent_available(profile: AgentProfile, now: datetime | None = None) -> bool:
    """
    Return True if the agent is active and within its work schedule right now.

    Args:
        profile: The agent's profile (includes schedule + active flag)
        now: The current datetime (UTC). Defaults to datetime.utcnow() if None.

    Returns:
        bool: True if the agent should accept new tasks
    """
    if not profile["active"]:
        return False

    schedule: WorkSchedule = profile["schedule"]
    tz_name = schedule.get("timezone", "UTC")

    try:
        tz = zoneinfo.ZoneInfo(tz_name)
    except Exception:
        tz = zoneinfo.ZoneInfo("UTC")

    if now is None:
        now = datetime.utcnow().replace(tzinfo=zoneinfo.ZoneInfo("UTC"))

    # Convert to agent's local timezone
    local_now = now.astimezone(tz)

    # Check day of week (0=Mon ... 6=Sun, matching Python's weekday())
    if local_now.weekday() not in schedule.get("work_days", [0, 1, 2, 3, 4]):
        return False

    # Parse work hours
    try:
        start_h, start_m = map(int, schedule["work_start"].split(":"))
        end_h, end_m = map(int, schedule["work_end"].split(":"))
    except (KeyError, ValueError):
        # If schedule is malformed, default to always available
        return True

    work_start = local_now.replace(hour=start_h, minute=start_m, second=0, microsecond=0)
    work_end = local_now.replace(hour=end_h, minute=end_m, second=0, microsecond=0)

    return work_start <= local_now <= work_end


def get_next_available_time(profile: AgentProfile, now: datetime | None = None) -> str:
    """
    Return a human-readable string of when this agent will next be available.
    """
    if is_agent_available(profile, now):
        return "Available now"

    schedule = profile["schedule"]
    work_days = schedule.get("work_days", [0, 1, 2, 3, 4])
    work_start = schedule.get("work_start", "09:00")
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    if not work_days:
        return "Not scheduled"

    next_day = day_names[work_days[0]]
    return f"Next available: {next_day} at {work_start} ({schedule.get('timezone', 'UTC')})"
