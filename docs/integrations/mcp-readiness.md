# Q-Empire — MCP/API Readiness Assessment

**Date**: 2026-08-05  
**Branch**: `feat/ship-readiness-pass`

---

## Overview

This document assesses the MCP (Model Context Protocol) and API contract readiness for the Q-Empire agent system.

---

## 1. Current API Surface (FastAPI — `/bridge/webhook_receiver.py`)

### Public Endpoints

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/` | None | ✅ |
| GET | `/health` | None | ✅ |
| POST | `/task` | None (+ kill-switch flag) | ✅ |
| GET | `/task/{id}` | None | ✅ |
| GET | `/tasks` | None | ✅ |
| GET | `/status?email=` | None | ✅ |
| POST | `/onboard` | None | ✅ |
| GET | `/agents` | None | ✅ |
| GET | `/agents/{id}` | None | ✅ |
| PATCH | `/agents/{id}` | **X-Admin-Key** ✅ | ✅ |

### Credit Endpoints (new this PR)

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/credits/{user_id}` | None | ✅ |
| POST | `/credits/{user_id}/deduct` | None | ✅ |
| POST | `/credits/{user_id}/topup` | **X-Admin-Key** | ✅ |

### Admin Endpoints (new this PR)

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/admin/credits/summary` | **X-Admin-Key** | ✅ |
| POST | `/admin/credits/cap` | **X-Admin-Key** | ✅ |
| GET | `/admin/flags` | **X-Admin-Key** | ✅ |
| POST | `/admin/flags` | **X-Admin-Key** | ✅ |
| POST | `/admin/kill-switch` | **X-Admin-Key** | ✅ |
| POST | `/admin/resume` | **X-Admin-Key** | ✅ |
| GET | `/admin/audit-log` | **X-Admin-Key** | ✅ |

---

## 2. MCP Protocol Readiness

### Current State
The Q-Empire agent system does **not** implement the Model Context Protocol (MCP) as a first-class tool server. Instead, it uses a simpler JSON task queue pattern.

### Gap Analysis

| MCP Feature | Status | Notes |
|-------------|--------|-------|
| Tool manifest (JSON schema) | ❌ Missing | Tools are Python functions, not MCP-spec |
| Streaming SSE responses | ❌ Missing | Bridge returns JSON, no streaming |
| Tool call / response contracts | 🔶 Partial | `execute_tool()` returns string results |
| Resource listing | ❌ Missing | No MCP resource endpoint |
| Prompts endpoint | ❌ Missing | |

### Recommendation
For full MCP compatibility (enabling Claude Desktop / third-party integrations), add a MCP server wrapper around `tools/execute_tool()`. This is a P1 follow-up, not a launch blocker.

**TODO [owner: tech-agent, timeline: Phase 3]**: Implement `/mcp/tools/list` and `/mcp/tools/call` endpoints following MCP spec at https://modelcontextprotocol.io

---

## 3. API Contract Validation

### Tool Contract
- `tools/execute_tool(tool_name, params)` → returns `str` result
- All tools in `TOOL_REGISTRY` accept `**kwargs`
- LangGraph state carries `result: Any` per step — robust to any string return

### Known Contract Issues
1. `browser.py` — `browser_navigate` can return large HTML; not trimmed before entering LLM context
2. `shell.py` — `shell_exec` returns raw stdout; errors not differentiated from output
3. All tools — no structured error codes, just error strings

### Recommended Fixes (P1)
1. Truncate browser output to 4KB before injecting into state
2. Add `{"status": "ok"|"error", "result": ..., "error_message": ...}` return schema to all tools
3. Add dry-run mode: accept `dry_run=True` param that validates params without executing

---

## 4. Dry-Run Mode (P1)

A dry-run mode allows agents to validate an action plan without executing risky operations (email sends, GitHub deploys, social posts).

### Proposed Implementation
Add `dry_run: bool` to `AgentState` and `execute_tool()`:

```python
def execute_tool(tool_name: str, params: dict, dry_run: bool = False) -> str:
    if dry_run:
        return f"[DRY-RUN] Would execute {tool_name} with params: {params}"
    return TOOL_REGISTRY[tool_name](**params)
```

**TODO [owner: executor.py, timeline: P1]**: Implement dry_run mode.

---

## 5. Health Check Improvements

Current `/health` only checks if the memory directory exists.

### Recommended `/health` Response

```json
{
  "status": "healthy",
  "bridge": "ok",
  "llm_configured": true,
  "github_configured": true,
  "email_configured": true,
  "credits_path": "ok",
  "flags": {...}
}
```

**TODO [owner: bridge/webhook_receiver.py, timeline: P1]**: Enhance health check.
