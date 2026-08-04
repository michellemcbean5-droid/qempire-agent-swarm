# Phase 4 — Agent Scheduling & Work System

**Goal**: Give every agent a customizable work schedule so agents operate on their own clock, just like real employees.

## Tasks (15)

1. [x] Design schedule schema: `{ timezone, work_days: [], work_hours: { start, end }, max_tasks_per_day }`
2. [x] Implement `core/scheduler.py` — `is_agent_available(profile, now)` function
3. [x] Implement task queue with priority levels (urgent, normal, low)
4. [x] Add `scheduled_tasks` field to `AgentState`
5. [x] Create `bridge/task_scheduler.py` — background thread that respects agent schedules
6. [x] Add `/schedule` endpoint to webhook receiver (view/update agent schedule)
7. [x] Persist schedules in `memory/schedules.json`
8. [x] Add schedule conflict detection (two tasks at same time for same agent)
9. [x] Add timezone conversion utilities
10. [x] Create `skills/daily_report.json` — skill for agents to send daily status reports
11. [x] Add `send_daily_report` task type to config
12. [x] Implement daily report aggregation across all agents
13. [x] Add overdue task detection and escalation to Q-Bot
14. [x] Write `tests/test_scheduler.py` with timezone edge cases
15. [x] Document schedule API in `docs/api-reference.md`

## Deliverables

- `core/scheduler.py` (full implementation)
- `bridge/task_scheduler.py`
- `memory/schedules.json` (default schedules)
- `skills/daily_report.json`
- Updated API docs
