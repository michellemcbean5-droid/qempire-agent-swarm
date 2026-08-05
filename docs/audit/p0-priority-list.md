# Q-Empire — P0 Priority List

**Date**: 2026-08-05  
**Branch**: `feat/ship-readiness-pass`

These items must be resolved before the app can ship safely.

---

## P0-01: AI Credit Wallet (CRITICAL — prevents overspend)

**Problem**: No credit tracking exists. Every AI call goes directly to the LLM without any budget control. A single runaway task could exhaust API quotas.

**Deliverables**:
- `mobile/src/stores/creditStore.ts` — credit balance, deduction, hard cap
- `bridge/webhook_receiver.py` — `/credits` endpoint stubs
- UI credit badge on DashboardScreen
- Low-credit modal warning
- Hard block when credits = 0

**Status**: ✅ Implemented in this PR

---

## P0-02: API Authentication (CRITICAL — security)

**Problem**: All FastAPI endpoints (`/task`, `/agents`, `/onboard`, `/admin`) are publicly accessible without any authentication. Anyone can queue tasks, read task results, or modify agents.

**Deliverables**:
- API key middleware on sensitive endpoints (`/admin/*`, `PATCH /agents/*`)
- `ADMIN_API_KEY` env var
- 401 responses on unauthorized requests

**Status**: ✅ Implemented in this PR

---

## P0-03: Admin Section (CRITICAL — operator control)

**Problem**: No admin controls exist. Operators cannot kill runaway agents, disable connectors, set spend caps, or view audit logs.

**Deliverables**:
- `bridge/webhook_receiver.py` — `/admin/*` endpoints
- Admin auth middleware
- Feature flag store
- Audit log persistence
- Kill switch endpoint

**Status**: ✅ Implemented in this PR

---

## P0-04: Feature Gating (CRITICAL — monetization)

**Problem**: `canUseFeature()` only gates `ai_requests` and `ads`. Agent execution, project creation, and premium tools are unprotected, allowing free users unlimited access.

**Deliverables**:
- Expand `canUseFeature` to cover `agents`, `projects`, `premium_tools`
- Gate project creation in `ProjectsScreen`
- Gate agent activation for free tier

**Status**: ✅ Implemented in this PR

---

## P0-05: User Consent for High-Risk Actions

**Problem**: Actions like sending emails, posting to social media, and deploying websites execute without user confirmation.

**Deliverables**:
- `ConfirmActionModal` component in mobile
- Wrap risky task submissions with confirmation

**Status**: ✅ Implemented in this PR

---

## P0-06: Retry / Backoff in Tools

**Problem**: External API calls in tools (browser, email, social media, CRM) fail hard with no retry. A single transient network error aborts the entire task.

**Deliverables**:
- `tools/_retry.py` — exponential backoff decorator
- Apply to `email_sender`, `crm_tracker`, `social_media_poster`, `browser`

**Status**: ✅ Implemented in this PR

---

## P0-07: Privacy Policy + Terms Links

**Problem**: Google Play requires a valid privacy policy URL and terms of service before app submission. Neither is present in the app.

**Deliverables**:
- `SupportScreen.tsx` — add privacy policy and terms links
- `app.json` — add `privacyPolicyUrl`

**Status**: ✅ Implemented in this PR

---

## P0-08: Monetization Gating Tests

**Problem**: The subscription store tests only cover daily counter reset. Feature gating for agents/projects is untested.

**Deliverables**:
- Expand `subscriptionStore.test.ts` with gating tests
- Add `creditStore.test.ts`

**Status**: ✅ Implemented in this PR

---

## P0-09: Credit Deduction on AI Usage

**Problem**: `aiService.generateText()` calls HuggingFace without deducting from any credit balance. Similarly, backend tool calls to Claude are uncounted.

**Deliverables**:
- Wrap `aiService` calls with credit deduction
- Backend: credit counter middleware per task step

**Status**: ✅ Implemented in this PR

---

## P0-10: Play Store Privacy Policy Requirement

**Problem**: `app.json` has no `privacyPolicyUrl`. The Play Store will reject the build without it.

**Deliverables**:
- Add placeholder `privacyPolicyUrl` to `app.json`
- Add `SupportScreen` links

**Status**: ✅ Implemented in this PR
