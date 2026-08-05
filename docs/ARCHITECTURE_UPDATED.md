# Q-Empire Architecture Notes — AI Orchestration + Credit Controls

**Version:** 2.0  
**Updated:** 2026-08-05

---

## 1. System Overview

```
Mobile App (React Native + Expo)
    ↓  POST /onboard | /task
FastAPI Webhook Receiver (bridge/webhook_receiver.py)
    ↓  writes task to bridge.json
Bridge Monitor (bridge/monitor.py) — polls every POLL_INTERVAL seconds
    ↓  invokes run_task()
Agent Loop (LangGraph state machine)
    Q-Bot → Planner → Executor → Verifier → loop/end
    ↓  calls tools
Tool Registry (tools/) — browser, shell, file, AI, CRM, invoice, social
    ↓  results stored in AgentState
Final Result → written to bridge.json completed[]
    ↓  client polls via /status?email=...
```

---

## 2. AI Orchestration (LangGraph)

### Agent Graph

```
[Q-Bot] → [Planner] → [Executor] → [Verifier]
                              ↑____________|  (loop until done or max errors)
```

### Node Responsibilities

| Node | File | Responsibility |
|------|------|----------------|
| Q-Bot | `core/qbot.py` | Load agent profiles, route task to best specialty agent |
| Planner | `core/planner.py` | Load skill plan (JSON) or generate plan via LLM |
| Executor | `core/executor.py` | Execute one tool per iteration, catch errors |
| Verifier | `core/verifier.py` | Validate result, advance step, detect completion |

### Routing Logic

Q-Bot selects the active agent by matching `task_type → specialty` using `TASK_AGENT_MAP`. Priority order:
1. Matching specialty + inside work schedule
2. Matching specialty (outside schedule — urgent fallback)
3. Q-Bot itself (fallback for unknown task types)

### Plan Generation

1. **Skill-first:** Look up `skills/{task_type}.json` — instant, no API call
2. **LLM fallback:** Call Claude with `PLANNER_PROMPT` — dynamic plan for unknown task types
3. Plan is a list of `PlanStep` dicts with `action`, `params`, `status`, `result`

---

## 3. Credit Control Architecture

### Credit Wallet (Mobile)

```
useCreditStore (Zustand + AsyncStorage)
├── balance: number              — current credits
├── monthlyAllotment: number     — credits at billing period start
├── billingPeriodStart: string   — ISO date (1st of month)
├── transactions: []             — last 100 deductions (audit log)
├── alertFired: boolean          — true once low-balance alert sent
├── spendCapEnabled: boolean     — admin kill switch
└── spendCapAmount: number       — max credits per billing period
```

### Credit Costs

| Operation | Credits |
|-----------|---------|
| chat_message | 1 |
| generate_text | 2 |
| generate_plan | 5 |
| market_insight | 3 |
| agent_task | 10 |
| summarize | 1 |
| sentiment | 1 |

### Tier Allotments

| Tier | Monthly Credits |
|------|----------------|
| free | 20 |
| basic | 200 |
| pro | 1,000 |
| elite | 9,999 |

### Credit Flow

```
User action (chat/generate)
    → canAfford(operation)?
    → YES: deductCredits() → record transaction → call AI
    → NO: show blocked message (no API call made)
    → if balance ≤ 15%: alertFired = true → show warning bar
    → if balance = 0: all AI blocked until upgrade or grant
```

### Spend Cap (Admin Control)

- `spendCapEnabled: true` + `spendCapAmount: N` — hard block once `credits_spent ≥ N`
- Configurable per-deployment via admin API: `PATCH /admin/flags` or `POST /admin/credits/grant`

### Backend Cost Constants (config.py)

```python
MAX_TOKENS_PER_TASK = 8000        # Per-agent-task LLM token cap
COST_PER_1K_INPUT_TOKENS = 0.003  # Claude Sonnet USD/1K
COST_PER_1K_OUTPUT_TOKENS = 0.015
MAX_COST_PER_TASK_USD = 0.50      # $0.50 hard cap per task
```

---

## 4. Feature Flag System

```
core/feature_flags.py
├── Persistent: memory/feature_flags.json
├── Defaults: DEFAULT_FEATURE_FLAGS in config.py
└── Admin API: PATCH /admin/flags

Flags:
- ai_generation_enabled    — master AI on/off
- onboarding_enabled       — /onboard endpoint gate
- new_task_queue_enabled   — /task endpoint gate
- spend_cap_enforced       — global spend cap enforcement
```

Flags are checked at request time in `webhook_receiver.py`. Admin can toggle live without redeployment.

---

## 5. Admin API

All admin endpoints require `X-Admin-Key` header (matches `ADMIN_API_KEY` env var, or open if not set).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/overview` | GET | Task counts + agent statuses + all flags |
| `/admin/flags` | GET | List all feature flags |
| `/admin/flags` | PATCH | Update flags `{"flag": bool}` |
| `/admin/flags/reset` | POST | Reset to defaults |
| `/admin/credits/grant` | POST | Grant credits to user `{"user_id", "amount", "reason"}` |

---

## 6. Agent Framework (6 Q-Bot Agents)

| Agent | ID | Specialty | Personality | Attitude |
|-------|----|-----------|-------------|----------|
| Q-Bot | `qbot` | general | professional | motivating |
| Maya | `marketing-agent` | marketing | creative | motivating |
| Fiona | `finance-agent` | finance | analytical | strict |
| Theo | `tech-agent` | tech | professional | balanced |
| Lexi | `legal-agent` | legal | professional | strict |
| Sam | `sales-agent` | sales | aggressive | urgent |

All agents have configurable `WorkSchedule` (timezone, work_days, work_start, work_end, max_tasks_per_day).  
Profiles persist to `memory/agent_profiles.json`.  
Configurable via `PATCH /agents/{agent_id}`.

---

## 7. Consent Gates and Audit Logs

- All tasks logged to `bridge.json` with timestamp, type, payload, and result
- Credit transactions logged in mobile AsyncStorage (last 100 per user)
- Admin credit grants logged to `bridge.json` credit_grants[]
- Feature flag changes take effect immediately; no audit log yet (P2 backlog)
- Email notifications sent to clients after task completion (via `tools/email_sender.py`)

---

## 8. Known Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Mobile credits are local-only | High | Server-side credit sync planned (P1) |
| Mock auth — no real JWT | High | Backend auth endpoints planned (P1) |
| Bridge.json is not atomic | Medium | Add file locking or migrate to Redis (P3) |
| No rate limiting on webhook API | Medium | Add slowapi or nginx rate limit (P2) |
| `deploy_to_github` shell injection | Medium | Validate repo_name before use (P2) |
| Single-threaded monitor.py | Low | Docker single-container; fine for MVP |
