# Q-Empire — Gap Matrix

**Date**: 2026-08-05  
**Branch**: `feat/ship-readiness-pass`

---

## Legend
- **Status**: ✅ Complete | 🔶 Partial | ❌ Missing
- **Severity**: P0 (blocks ship) | P1 (important, ship with workaround) | P2 (nice to have)

---

## Gap Matrix

| Area | Feature | Promised | Status | Severity | Notes |
|------|---------|----------|--------|----------|-------|
| **AI Credits** | Per-user credit wallet | Yes (PRD) | ❌ Missing | P0 | No credit tracking exists |
| **AI Credits** | Deduct credits on AI/tool usage | Yes (PRD) | ❌ Missing | P0 | No deduction logic |
| **AI Credits** | Hard spend cap per user | Yes (PRD) | ❌ Missing | P0 | Overspend risk |
| **AI Credits** | Live credit balance display | Yes (PRD) | ❌ Missing | P0 | No UI surface |
| **AI Credits** | Low-credit warning | Yes (PRD) | ❌ Missing | P0 | No warning flow |
| **AI Credits** | Admin spend dashboard | Yes (PRD) | ❌ Missing | P0 | No admin panel |
| **AI Credits** | Per-feature usage telemetry | Yes (PRD) | ❌ Missing | P1 | Analytics stub only |
| **Admin** | Admin auth + role checks | Yes | ❌ Missing | P0 | No API auth at all |
| **Admin** | Agent enable/disable controls | Yes | 🔶 Partial | P0 | PATCH `/agents/{id}` exists, no auth guard |
| **Admin** | Connector enable/disable | Yes | ❌ Missing | P0 | No connector registry |
| **Admin** | Credit policy controls | Yes | ❌ Missing | P0 | No credit system |
| **Admin** | Feature flags / kill switch | Yes | ❌ Missing | P0 | No flag system |
| **Admin** | Audit log viewer | Yes | ❌ Missing | P1 | Event stream exists but not persisted |
| **API Auth** | JWT / API key on backend | Implicit | ❌ Missing | P0 | All endpoints publicly accessible |
| **Core Journey** | Onboarding → AI chat end-to-end | Yes | 🔶 Partial | P0 | QBotScreen sends to API but no session state |
| **Core Journey** | Idea → plan editable output | Yes | 🔶 Partial | P1 | Plan generated but not surfaced in mobile |
| **Core Journey** | Revenue target input + persist | Yes | ❌ Missing | P1 | No revenue target field in onboarding |
| **Core Journey** | Agent kickoff progress reporting | Yes | 🔶 Partial | P1 | Event stream in backend, not polled in mobile |
| **6 Q Bot Agents** | 6 agent role profiles | Yes | ✅ Complete | — | All 6 defined (Q-Bot + 5 specialists) |
| **6 Q Bot Agents** | Per-agent config UI | Yes | ✅ Complete | — | AgentDetailScreen edits profile |
| **6 Q Bot Agents** | Memory hooks | Yes | 🔶 Partial | P1 | memory_store.py stub exists |
| **6 Q Bot Agents** | Inter-agent delegation rules | Yes | 🔶 Partial | P1 | TASK_AGENT_MAP exists, no dynamic re-routing |
| **6 Q Bot Agents** | Director-of-Ops reporting | Yes | ❌ Missing | P1 | No reporting channel to user |
| **6 Q Bot Agents** | Agent status panel | Yes | 🔶 Partial | P1 | Static display in AgentManagementScreen |
| **Monetization** | Plan tiers defined | Yes | ✅ Complete | — | free/basic/pro/elite in constants |
| **Monetization** | Feature gating by tier | Yes | 🔶 Partial | P0 | canUseFeature only gates ai_requests/ads |
| **Monetization** | RevenueCat integration | Yes | 🔶 Partial | P1 | monetizationService scaffolded, placeholder keys |
| **Monetization** | Upgrade prompts | Yes | 🔶 Partial | P1 | Some upgrade messages, no deep gate UX |
| **Monetization** | Billing state handling | Yes | 🔶 Partial | P1 | subscriptionStore works locally, no server sync |
| **Connectors** | Retry / backoff / rate limit | Yes | ❌ Missing | P0 | No retry logic in tools |
| **Connectors** | Auth re-auth flows | Yes | ❌ Missing | P1 | Google OAuth not refreshable |
| **Connectors** | Health checks / diagnostics | Yes | 🔶 Partial | P1 | `/health` endpoint basic only |
| **Connectors** | MCP/API tool contract | Yes | ❌ Missing | P1 | No MCP protocol implementation |
| **Connectors** | Dry-run mode | Yes | ❌ Missing | P1 | All actions execute immediately |
| **UX/Safety** | User consent for high-risk actions | Yes | ❌ Missing | P0 | No consent gates |
| **UX/Safety** | Explainability snippets | Yes | ❌ Missing | P1 | No "why this action" text |
| **UX/Safety** | Reduced-motion fallback | Yes | ❌ Missing | P2 | Animations exist without a11y fallback |
| **Testing** | Credit deduction tests | Yes | ❌ Missing | P0 | No credit system to test |
| **Testing** | Monetization gating tests | Yes | 🔶 Partial | P0 | subscriptionStore tests basic only |
| **Testing** | Agent orchestration e2e tests | Yes | 🔶 Partial | P1 | test_agent_loop smoke test only |
| **Release** | Play Store readiness doc | Yes | ❌ Missing | P1 | Not produced yet |
| **Release** | Signing / build steps doc | Yes | ❌ Missing | P1 | Not documented |
| **Release** | Privacy policy / terms links | Yes | ❌ Missing | P0 | Required for store submission |
| **Release** | go-no-go checklist | Yes | ❌ Missing | P1 | Not produced yet |

---

## Summary Counts

| Severity | Complete | Partial | Missing |
|----------|----------|---------|---------|
| P0 | 2 | 5 | 10 |
| P1 | 4 | 8 | 9 |
| P2 | 0 | 0 | 1 |
