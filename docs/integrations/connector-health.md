# Q-Empire — Connector Health Audit

**Date**: 2026-08-05  
**Branch**: `feat/ship-readiness-pass`

---

## Overview

Q-Empire uses the following external connectors. This document captures their health status, known failure modes, and mitigations.

---

## 1. Anthropic Claude API (Primary LLM)

| Attribute | Value |
|-----------|-------|
| Used by | `tools/content_gen.py`, `core/planner.py` |
| Auth | `ANTHROPIC_API_KEY` env var |
| Retry | ✅ `with_retry(max_attempts=3)` (added this PR) |
| Rate limiting | Handled by Anthropic SDK 429 responses |
| Failure mode | Missing key → tool returns error string (non-fatal) |
| Status | ✅ Healthy |

---

## 2. HuggingFace Inference API (Mobile free-tier AI)

| Attribute | Value |
|-----------|-------|
| Used by | `mobile/src/services/aiService.ts` |
| Auth | `EXPO_PUBLIC_HF_API_KEY` env var |
| Retry | ❌ TODO: add axios retry interceptor |
| Rate limiting | Free tier: 10k requests/month — no burst protection |
| Failure mode | `aiService.generateText` returns fallback string |
| Status | 🔶 Partial — no retry |

**Recommended fix**: Add `axios-retry` to aiService with 3 retries and exponential backoff.

---

## 3. Gmail SMTP

| Attribute | Value |
|-----------|-------|
| Used by | `tools/email_sender.py` |
| Auth | `GMAIL_ADDRESS` + `GMAIL_APP_PASSWORD` env vars |
| Retry | ✅ `@with_retry(max_attempts=3)` on `_smtp_send()` (added this PR) |
| Rate limiting | Gmail: 500 emails/day (free tier) |
| Failure mode | Missing credentials → queued (logged, non-fatal) |
| Status | ✅ Healthy |

---

## 4. Google Sheets CRM

| Attribute | Value |
|-----------|-------|
| Used by | `tools/crm_tracker.py` |
| Auth | `GOOGLE_CREDENTIALS_PATH` service account JSON |
| Retry | 🔶 Local CSV fallback exists; Google Sheets path has no retry |
| Rate limiting | Google API: 300 requests/minute |
| Failure mode | Falls back to local CSV if Google Sheets unavailable |
| Status | 🔶 Partial |

**Recommended fix**: Wrap `gspread` calls with `@with_retry`.

---

## 5. GitHub API (Pages deployment)

| Attribute | Value |
|-----------|-------|
| Used by | `tools/website_builder.py` |
| Auth | `GITHUB_TOKEN` env var |
| Retry | ❌ No retry on git push operations |
| Rate limiting | GitHub: 5000 API requests/hour |
| Failure mode | Deployment failure logged; task marked failed |
| Status | 🔶 Partial |

---

## 6. RevenueCat (Mobile subscriptions)

| Attribute | Value |
|-----------|-------|
| Used by | `mobile/src/services/monetizationService.ts` |
| Auth | Platform-specific API keys (placeholder) |
| Retry | Handled by RevenueCat SDK |
| Failure mode | Graceful failure — returns null, falls back to cached tier |
| Status | 🔶 Partial — placeholder API keys |

**Required before launch**: Replace `rc_apple_api_key` / `rc_google_api_key` with real keys.

---

## 7. AdMob (Mobile ads)

| Attribute | Value |
|-----------|-------|
| Used by | `mobile/src/services/monetizationService.ts` |
| Auth | App ID in `app.json` + `google-services.json` |
| Status | 🔶 Test mode IDs only — replace before production |

---

## 8. PostHog Analytics

| Attribute | Value |
|-----------|-------|
| Used by | `mobile/src/services/analyticsService.ts` |
| Auth | `EXPO_PUBLIC_POSTHOG_KEY` env var |
| Failure mode | Silent failure — analytics are best-effort |
| Status | ✅ Healthy |

---

## Connector Reliability Summary

| Connector | Retry | Auth Guard | Failure Safe | Launch Ready |
|-----------|-------|-----------|--------------|-------------|
| Anthropic Claude | ✅ | ✅ | ✅ | ✅ |
| HuggingFace | ❌ | ✅ | ✅ | 🔶 |
| Gmail SMTP | ✅ | ✅ | ✅ | ✅ |
| Google Sheets | ❌ | ✅ | ✅ (CSV fallback) | 🔶 |
| GitHub Pages | ❌ | ✅ | ❌ | 🔶 |
| RevenueCat | SDK | 🔶 placeholder | ✅ | 🔶 |
| AdMob | SDK | 🔶 test IDs | ✅ | 🔶 |
| PostHog | SDK | ✅ | ✅ | ✅ |

---

## Recommended Follow-up (P1)

1. Add `axios-retry` to `aiService.ts`
2. Wrap `gspread` calls in `crm_tracker.py` with `@with_retry`
3. Add retry to GitHub push in `website_builder.py`
4. Replace RevenueCat + AdMob placeholder keys with production credentials
