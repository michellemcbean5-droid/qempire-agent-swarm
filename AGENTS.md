# Agent Instructions for Q-Empire Agent Swarm

## Project Overview

This repository contains an autonomous AI agent system that builds entire businesses on autopilot. It is a Python agent swarm (inspired by Manus AI) with a React/Vite frontend.

- **Backend**: Python 3.11+ — LangGraph orchestration, Playwright browser automation, FastAPI webhooks
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Infrastructure**: Docker + Docker Compose
- **Default branch**: `master` (not `main`)

## Architecture

```
core/          # LangGraph agent nodes (planner, executor, verifier, state, config)
tools/         # Sandbox tools (browser, shell, file system, content gen, website builder, etc.)
bridge/        # Task queue monitor and webhook receiver (FastAPI)
frontend/      # React client app (checkout, onboarding wizard, client portal)
skills/        # JSON skill definitions for each task type
memory/        # Runtime state (bridge.json, context files)
tests/         # Unit tests for Python core and tools
docs/          # Architecture docs, Copilot prompts, self-service app guide
```

## Key Files

| File | Purpose |
|------|---------|
| `core/agent_loop.py` | Main LangGraph orchestrator — builds the 3-agent graph |
| `core/planner.py` | Planner node — breaks tasks into executable steps |
| `core/executor.py` | Executor node — runs tools via `tools.execute_tool()` |
| `core/verifier.py` | Verifier node — validates results and advances pipeline |
| `core/state.py` | TypedDict schemas for `AgentState` and `PlanStep` |
| `core/config.py` | Environment-driven config, package definitions, constants |
| `bridge/monitor.py` | Polls `bridge.json` every `POLL_INTERVAL` seconds |
| `bridge/webhook_receiver.py` | FastAPI app with `/task`, `/onboard`, `/tasks` endpoints |
| `tools/__init__.py` | `TOOL_REGISTRY` and `execute_tool()` dispatcher |
| `frontend/package.json` | React 19 + Vite + Tailwind + wouter (router) + react-hook-form + zod |

## Testing

- Python tests: `pytest tests/ -v`
- Frontend build: `cd frontend && npm run build`
- TypeScript check: `cd frontend && npx tsc --noEmit`

## Linting / Formatting

- Python: `black`, `flake8`, `mypy`
- Frontend: `eslint` (TypeScript/React)

## Adding a New Tool

1. Create the tool module in `tools/` (e.g., `tools/my_tool.py`)
2. Import and register it in `tools/__init__.py` inside `TOOL_REGISTRY`
3. Add tests in `tests/`
4. Update `core/planner.py` planner prompt so the LLM knows the tool exists

## Adding a New Skill

1. Create a JSON file in `skills/` (e.g., `skills/my_skill.json`)
2. Follow the existing schema: `steps` array with `step`, `action`, `description`, `params_template`
3. Map the task type in `core/planner.py` `_load_skill_plan()` `skill_map`

## Environment Variables

Copy `.env.example` to `.env` and fill in all keys. Key variables:
- `ANTHROPIC_API_KEY` — LLM provider
- `GITHUB_TOKEN` + `GITHUB_USERNAME` — GitHub Pages deployment
- `GOOGLE_SHEET_ID` + `GOOGLE_CREDENTIALS_PATH` — CRM bridge
- `GMAIL_ADDRESS` + `GMAIL_APP_PASSWORD` — Client notifications
- `POLL_INTERVAL` (seconds) + `MAX_RETRIES` — Agent tuning

## Docker

```bash
docker compose up --build
```

This starts two services:
- `agent` — runs `bridge/monitor.py` (background polling loop)
- `webhook` — runs `bridge/webhook_receiver.py` (HTTP API on port 8080)

## Important Notes

- The agent uses **LangGraph** (not plain LangChain) for the state machine.
- `bridge.json` is the single source of truth for the task queue.
- The frontend is built with **Vite** — no CRA/Webpack. Output goes to `frontend/dist/`.
- The default branch is `master`. All PRs should target `master`.
