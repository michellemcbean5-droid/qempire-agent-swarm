# Phase 3 — Core Agent Intelligence Upgrades

**Goal**: Make the planner, executor, and verifier significantly smarter, more reliable, and context-aware.

## Tasks (15)

1. [x] Update planner to support multi-agent task decomposition (assign steps to specific agents)
2. [x] Add memory/context persistence across tasks in `core/memory_store.py`
3. [x] Update `core/verifier.py` — add quality scoring (0–100) to each step result
4. [x] Add retry logic with exponential backoff in `core/executor.py`
5. [x] Add `RESEARCH_COMPETITOR` task type to planner
6. [x] Add `SETUP_CRM` task type to planner and skill map
7. [x] Add `CREATE_INVOICE` task type to planner and skill map
8. [x] Add `POST_SOCIAL_MEDIA` task type to planner and skill map
9. [x] Update `core/config.py` — add new task types, new tool names
10. [x] Add structured output logging: every agent action logged to `memory/task_log.jsonl`
11. [x] Add timeout handling in executor (configurable per tool)
12. [x] Add `generate_social_post` tool to TOOL_REGISTRY
13. [x] Add `create_invoice` tool to TOOL_REGISTRY
14. [x] Add `track_crm_entry` tool to TOOL_REGISTRY
15. [x] Write tests for new task types in `tests/test_new_tasks.py`

## Deliverables

- `core/memory_store.py`
- Updated `core/planner.py`, `core/executor.py`, `core/verifier.py`
- Updated `core/config.py`
- New tools registered
- `tests/test_new_tasks.py`
