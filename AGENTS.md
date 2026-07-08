# Agent Instructions for Q-Empire Agent Swarm

## Project Overview

This repository contains an autonomous AI agent system that builds entire businesses on autopilot. It is a Python agent swarm (inspired by Manus AI) with a React/Vite frontend and a React Native (Expo) mobile app.

- **Backend**: Python 3.11+ — LangGraph orchestration, Playwright browser automation, FastAPI webhooks
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Mobile**: React Native + Expo SDK 52 + TypeScript + Zustand + React Navigation
- **Infrastructure**: Docker + Docker Compose
- **Default branch**: `master` (not `main`)

## Architecture

```
core/          # LangGraph agent nodes (planner, executor, verifier, state, config)
tools/         # Sandbox tools (browser, shell, file system, content gen, website builder, etc.)
bridge/        # Task queue monitor and webhook receiver (FastAPI)
frontend/      # React web client app (checkout, onboarding wizard, client portal)
mobile/        # React Native Expo app (iOS + Android) — 10 screens, AI integration, monetization
skills/        # JSON skill definitions for each task type
memory/        # Runtime state (bridge.json, context files)
tests/         # Unit tests for Python core and tools
docs/          # Architecture docs, Copilot prompts, self-service app guide, mobile docs
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
| `mobile/App.tsx` | Root mobile component with navigation, notifications, deep linking |
| `mobile/src/navigation/RootNavigator.tsx` | Stack + Bottom tabs navigation |
| `mobile/src/stores/` | Zustand stores (auth, app, subscription) |
| `mobile/src/services/aiService.ts` | HuggingFace AI integration (free tier) |
| `mobile/src/services/monetizationService.ts` | RevenueCat + AdMob configuration |
| `mobile/eas.json` | EAS build profiles (dev, preview, production) |

## Testing

- Python tests: `pytest tests/ -v`
- Frontend build: `cd frontend && npm run build`
- TypeScript check: `cd frontend && npx tsc --noEmit`
- Mobile tests: `cd mobile && npm run test:ci`
- Mobile type check: `cd mobile && npm run typecheck`
- Mobile lint: `cd mobile && npm run lint`

## Linting / Formatting

- Python: `black`, `flake8`, `mypy`
- Frontend: `eslint` (TypeScript/React)
- Mobile: `eslint` (TypeScript/React Native)

## Adding a New Tool

1. Create the tool module in `tools/` (e.g., `tools/my_tool.py`)
2. Import and register it in `tools/__init__.py` inside `TOOL_REGISTRY`
3. Add tests in `tests/`
4. Update `core/planner.py` planner prompt so the LLM knows the tool exists

## Adding a New Skill

1. Create a JSON file in `skills/` (e.g., `skills/my_skill.json`)
2. Follow the existing schema: `steps` array with `step`, `action`, `description`, `params_template`
3. Map the task type in `core/planner.py` `_load_skill_plan()` `skill_map`

## Adding a Mobile Screen

1. Create the screen in `mobile/src/screens/` (e.g., `mobile/src/screens/MyScreen.tsx`)
2. Add route to `mobile/src/navigation/RootNavigator.tsx` type definitions and stack
3. Add tab icon if it's a main tab screen
4. Add tests in `mobile/src/tests/`

## Environment Variables

Copy `.env.example` to `.env` and fill in all keys. Key variables:
- `ANTHROPIC_API_KEY` — LLM provider
- `GITHUB_TOKEN` + `GITHUB_USERNAME` — GitHub Pages deployment
- `GOOGLE_SHEET_ID` + `GOOGLE_CREDENTIALS_PATH` — CRM bridge
- `GMAIL_ADDRESS` + `GMAIL_APP_PASSWORD` — Client notifications
- `POLL_INTERVAL` (seconds) + `MAX_RETRIES` — Agent tuning

Mobile environment variables (in `mobile/.env`):
- `EXPO_PUBLIC_HF_API_KEY` — HuggingFace Inference API token
- `EXPO_PUBLIC_POSTHOG_KEY` — PostHog analytics project key
- `EXPO_PUBLIC_POSTHOG_HOST` — PostHog instance URL
- `EXPO_PUBLIC_WEBHOOK_URL` — Q-Empire API endpoint

## Docker

```bash
docker compose up --build
```

This starts two services:
- `agent` — runs `bridge/monitor.py` (background polling loop)
- `webhook` — runs `bridge/webhook_receiver.py` (HTTP API on port 8080)

## Mobile App Quick Start

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your API keys
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan QR with Expo Go.

## Important Notes

- The agent uses **LangGraph** (not plain LangChain) for the state machine.
- `bridge.json` is the single source of truth for the task queue.
- The frontend is built with **Vite** — no CRA/Webpack. Output goes to `frontend/dist/`.
- The mobile app uses **Expo SDK 52** with React Navigation v7 and Zustand for state management.
- The default branch is `master`. All PRs should target `master`.
- Never commit `.env` files or API keys. Use `.env.example` as templates only.
