# P0 Fixes Completed

**Date:** 2026-08-05  
**Branch:** master  
**Prior test count:** 57 passed, 7 failed  
**Post-fix test count:** 80 passed, 2 failed (both require live API key — expected)

---

## P0-1 ✅ AI Credit Wallet + Usage Metering + Spend Caps + Alerts

**File:** `mobile/src/stores/creditStore.ts` (new)

**What was built:**
- Full credit wallet Zustand store with AsyncStorage persistence
- Monthly allotment by subscription tier: free=20, basic=200, pro=1000, elite=9999
- Credit cost table (`CREDIT_COSTS`) for all operations: chat_message=1, generate_text=2, generate_plan=5, agent_task=10, etc.
- `canAfford(operation)` — checks balance AND spend cap before any AI call
- `deductCredits(operation)` — atomic deduct + transaction ledger (last 100 kept)
- Hard spend cap: `spendCapEnabled` + `spendCapAmount` — any operation that would exceed the cap is blocked
- Low-balance alert: fires when remaining balance ≤ 15% of monthly allotment; sets `alertFired=true`
- `getLowBalanceWarning()` — returns human-readable warning string shown in UI
- Monthly auto-reset: on init, if billing period has changed the credits reset
- Credit grant API for admin promo/referral grants

**Tests:** `mobile/src/tests/creditStore.test.ts` — 18 test cases covering all paths

---

## P0-2 ✅ QBot Chat and AI Screen Enforce Credit Gates

**Files:** `mobile/src/screens/QBotScreen.tsx`, `mobile/src/screens/AIScreen.tsx`

**What was fixed:**
- Both screens now import `useCreditStore`
- Before any AI call: `canAfford(operation)` is checked; if false, shows a user-friendly blocked message
- After each successful AI call: `deductCredits(operation)` is called
- Credit balance displayed in QBot header (`💳 {balance}`) and AI Screen subtitle
- Low-balance warning bar shown when `alertFired` is true

---

## P0-3 ✅ Admin Controls Endpoint (Feature Flags + System Overview + Credit Grants)

**Files:** `core/feature_flags.py` (new), `bridge/webhook_receiver.py` (updated)

**What was built:**
- `core/feature_flags.py` — persistent feature flag store (JSON file, env-configurable path)
- Default flags: `ai_generation_enabled`, `onboarding_enabled`, `new_task_queue_enabled`, `spend_cap_enforced`
- Admin endpoints added to FastAPI (require `X-Admin-Key` header when `ADMIN_API_KEY` env is set):
  - `GET /admin/overview` — task counts, agent statuses, feature flags
  - `GET /admin/flags` — list all flags
  - `PATCH /admin/flags` — update one or more flags (kill switch for AI or onboarding)
  - `POST /admin/flags/reset` — reset to defaults
  - `POST /admin/credits/grant` — grant credits to a user (logged to bridge.json audit trail)
- Feature flag gates added to `/task` and `/onboard` endpoints

**Tests:** `tests/test_feature_flags.py` (6 tests), `tests/test_e2e_simulation.py` test_11 + test_12

---

## P0-4 ✅ Backend Bridge Path Fixed (Docker vs Dev/CI)

**File:** `core/config.py`

**What was fixed:**
- `BRIDGE_PATH` now resolves to `/app/memory/bridge.json` inside Docker (when `/app` dir exists), and falls back to `{repo_root}/memory/bridge.json` in dev/CI
- `OUTPUT_DIR` and `WORKSPACE_DIR` use same logic — Docker paths when available, repo-relative fallback otherwise
- `ADMIN_API_KEY` env var added for admin endpoint auth
- `GENERATE_CONTENT` added to `TASK_TYPES` (was missing, causing webhook to log "UNKNOWN")
- `DEFAULT_FEATURE_FLAGS` dict added to config

**Tests:** `test_config.py::test_directories_defined` updated to assert consistency instead of hardcoded Docker paths

---

## P0-5 ✅ Shell Tool Fixed (workspace directory)

**File:** `tools/shell.py`

**What was fixed:**
- `WORKSPACE_DIR` now resolves to `/home/ubuntu/workspace` inside Docker and `{repo_root}/workspace` outside
- `os.makedirs(WORKSPACE_DIR, exist_ok=True)` ensures the directory is created before executing commands
- Was: `FAILED tests/test_tools.py::test_shell_exec — No such file or directory: '/home/ubuntu/workspace'`
- Now: **PASSING**

---

## P0-6 ✅ Test Failures Fixed

| Test | Was | Now |
|------|-----|-----|
| `test_bridge.py::test_create_task` | PermissionError: /app | PASS (tmp_path monkeypatch) |
| `test_bridge.py::test_onboard_endpoint` | PermissionError: /app | PASS (tmp_path monkeypatch) |
| `test_tools.py::test_shell_exec` | No such file: /home/ubuntu/workspace | PASS |
| `test_tools.py::test_bridge_json` | PermissionError: /app | PASS |
| `test_branding.py::test_skills_use_michelle_qbot_voice` | Missing 'Michelle' in create_invoice.json | PASS |
| `test_config.py::test_directories_defined` | Hardcoded Docker path | PASS |

Remaining expected failures (require live API key):
- `test_agent_loop.py::TestRunTask::test_run_task_returns_dict` — calls real Anthropic API
- `test_planner.py::TestPlannerNode::test_planner_node_updates_state` — calls real Anthropic API

These pass when `ANTHROPIC_API_KEY` is set. They are marked as environment-dependent.

---

## P0-7 ✅ Onboarding Connected to Webhook

**File:** `mobile/src/screens/OnboardingScreen.tsx`

**What was fixed:**
- After `register()` succeeds, the app now POSTs all onboarding data (email, business name, industry, revenue goal, timeline, selected plan) to `{EXPO_PUBLIC_WEBHOOK_URL}/onboard`
- This triggers the full agent task queue for the client's package
- Completes the core user journey: Onboard → agent execution kickoff

---

## P0-8 ✅ E2E Customer Simulation Test Suite

**File:** `tests/test_e2e_simulation.py` (new — 12 test cases)

**Journey tested:**
1. Health check — service is online
2. Onboarding → tasks created (foundation package creates blueprint + website + funding tasks)
3. Tasks appear in queue after onboarding
4. QBot chat task submittable as `GENERATE_CONTENT`
5. Task status queryable by task_id
6. Tasks visible by client email (portal)
7. Agent routing (tech=website, finance=funding, marketing=pitch deck)
8. Plan generation from skill file
9. Agent plan execution (mocked tool)
10. Verifier advances step on success
11. Admin overview endpoint returns data
12. Feature flag kill switch blocks task creation (503)

**Result: 12/12 passing**

---

## New Tests Summary

| File | Tests Added | All Pass? |
|------|-------------|-----------|
| `tests/test_e2e_simulation.py` | 12 | ✅ |
| `tests/test_feature_flags.py` | 6 | ✅ |
| `mobile/src/tests/creditStore.test.ts` | 18 | Pending mobile runner |

**Python tests: 80 passed (was 57), 2 expected failures (API key required)**

---

## What's Still Outstanding (Post-P0 Backlog)

| Item | Priority | Notes |
|------|----------|-------|
| Real JWT auth backend | P1 | Currently mock-only; needs `/auth/login`, `/auth/register` |
| RevenueCat production API keys | P1 | Placeholder strings in `monetizationService.ts` |
| AdMob production unit IDs | P1 | Using Google test IDs |
| Play Store privacy policy | P1 | Required for submission |
| Upgrade flow to sync credits on server | P1 | Mobile credits are local-only |
| Token counting / cost estimation in executor | P2 | Config constants added; executor hook pending |
| `deploy_to_github` shell injection sanitization | P2 | `repo_name` not validated |
| Persistent Redis task queue | P3 | Replace bridge.json for scale |
