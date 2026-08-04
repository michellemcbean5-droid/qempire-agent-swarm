# Phase 2 — Q-Bot Master Agent + Customization Layer

**Goal**: Implement Q-Bot as the supreme orchestrator and add the agent personality/scheduling customization system.

## Tasks (15)

1. [x] Create `core/qbot.py` — Q-Bot master agent that routes tasks to specialized agents
2. [x] Create `core/agent_profile.py` — AgentProfile TypedDict with personality, attitude, schedule, specialty
3. [x] Update `core/state.py` — add `agent_profiles`, `active_agent`, `qbot_context` to AgentState
4. [x] Create `core/personality_engine.py` — prompt modifier based on personality + attitude settings
5. [x] Update `core/agent_loop.py` — add Q-Bot node as entry point before planner
6. [x] Create `core/scheduler.py` — check if agent is within its work schedule before executing
7. [x] Create default agent profiles in `memory/agent_profiles.json` (Marketing, Finance, Tech, Legal, Sales)
8. [x] Update `tools/__init__.py` — add `get_agent_status`, `set_agent_profile` tools
9. [x] Update `bridge/webhook_receiver.py` — add `/agents`, `/agents/{id}`, `/agents/{id}/configure` endpoints
10. [x] Create `skills/agent_management.json` — skill plan for configuring agents
11. [x] Write unit tests in `tests/test_qbot.py`
12. [x] Write unit tests in `tests/test_personality_engine.py`
13. [x] Write unit tests in `tests/test_scheduler.py`
14. [x] Update planner prompt to include agent personality context
15. [x] Document agent profile API in `docs/api-reference.md`

## Deliverables

- `core/qbot.py`
- `core/agent_profile.py`
- `core/personality_engine.py`
- `core/scheduler.py`
- `memory/agent_profiles.json`
- 3 new test files
- Updated webhook endpoints
