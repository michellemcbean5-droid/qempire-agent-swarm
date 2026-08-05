# Release Readiness Report — Q-Empire Android App

**Date:** 2026-08-05  
**Target:** Google Play Store (Android)  
**Assessment:** ⚠️ NOT GO — P1 blockers remain

---

## Go/No-Go Verdict

| Category | Status | Notes |
|----------|--------|-------|
| Core user journey E2E | ✅ GO | Onboard → AI chat → plan generation → agent kickoff |
| Credit controls | ✅ GO | Wallet, caps, alerts all implemented |
| Agent framework | ✅ GO | 6 agents, configurable, tested |
| Admin controls | ✅ GO | Feature flags, credit grants, system overview |
| Python test suite | ✅ GO | 80/82 pass (2 require live API key) |
| Mobile build config | ✅ GO | EAS profiles for dev/preview/production |
| In-app purchase config | ❌ BLOCKER | RevenueCat keys are placeholder strings |
| Authentication | ❌ BLOCKER | Login/register is mock — no real backend auth |
| Privacy policy | ❌ BLOCKER | Required by Play Store; not present |
| AdMob production IDs | ❌ BLOCKER | Using Google test unit IDs |
| Play Console account | ❓ UNKNOWN | Not verified in this audit |
| App content rating | ❓ UNKNOWN | IARC rating questionnaire not documented |

**Overall: NO-GO for production. 4 hard blockers before Play Store submission.**

---

## P1 Blockers (Must Fix Before Release)

### 1. RevenueCat API Keys
- **File:** `mobile/src/services/monetizationService.ts`
- **Current:** `'rc_apple_api_key'` / `'rc_google_api_key'` (literal strings)
- **Fix:** Create a RevenueCat project, get real keys, inject via EAS secrets:
  ```bash
  eas secret:create --scope project --name REVENUECAT_ANDROID_KEY --value "goog_..."
  eas secret:create --scope project --name REVENUECAT_IOS_KEY --value "appl_..."
  ```
- **mobile/.env.example** should document these.

### 2. Authentication Backend
- **File:** `mobile/src/stores/authStore.ts`
- **Current:** `login()` and `register()` are client-side only; no password hashed, no JWT
- **Fix:** Add FastAPI auth endpoints `/auth/login` and `/auth/register` with bcrypt + JWT; update mobile store to call real API
- **Estimate:** 1–2 days

### 3. Privacy Policy URL
- **Required:** Google Play requires a privacy policy URL in the store listing
- **Fix:** Create policy at `https://qempire.app/privacy` (or similar) and add to `app.json`

### 4. AdMob Production Unit IDs
- **File:** `mobile/src/services/monetizationService.ts`
- **Current:** Google test IDs (`ca-app-pub-3940256099942544/...`)
- **Fix:** Create real AdMob account, create ad units, update with real IDs via environment or EAS secrets

---

## P2 Pre-Launch Items (Strongly Recommended)

| Item | Description |
|------|-------------|
| Server-side credit sync | Credits currently local-only; need `/credits/balance` API endpoint |
| Webhook API authentication | `/task` and `/onboard` have no auth; add API key middleware |
| Token counting in executor | `MAX_TOKENS_PER_TASK` config exists but executor doesn't enforce it yet |
| `deploy_to_github` sanitization | Validate `repo_name` to prevent shell injection |
| Play Store screenshots | 2–8 screenshots per form factor required |
| Short/full description | Store listing copy not yet written |

---

## Test Evidence

### Python Backend Tests
```
80 passed, 2 failed (API key required)
New tests: 18 E2E + 6 feature flag = 24 new passing tests
Coverage areas: agent routing, plan generation, task queue, admin API,
                feature flags, customer simulation journey (12 steps)
```

### Mobile Tests (Pending Runner)
```
Files: authStore.test.ts, appStore.test.ts, subscriptionStore.test.ts,
       aiService.test.ts, components.test.tsx, creditStore.test.ts (new)
creditStore: 18 test cases covering canAfford, deductCredits, grantCredits,
             spend caps, low-balance alerts, usage percentage
Status: Pass expected; requires Node.js test environment
```

---

## Release Build Path

When P1 blockers are resolved:

```bash
# 1. Set EAS secrets
eas secret:create --scope project --name REVENUECAT_ANDROID_KEY --value "..."
eas secret:create --scope project --name HF_API_KEY --value "..."

# 2. Build production AAB
cd mobile
eas build --profile production --platform android

# 3. Submit to Play Store
eas submit --platform android --latest

# 4. Backend deployment
docker compose up --build -d
```

---

## Environment Variables Checklist

| Variable | Required | Set? |
|----------|----------|------|
| `ANTHROPIC_API_KEY` | Backend | ❓ |
| `GITHUB_TOKEN` | Backend | ❓ |
| `GOOGLE_SHEET_ID` | Backend | ❓ |
| `GMAIL_ADDRESS` | Backend | ❓ |
| `ADMIN_API_KEY` | Backend | ❓ (optional but recommended) |
| `EXPO_PUBLIC_HF_API_KEY` | Mobile | ❓ |
| `EXPO_PUBLIC_WEBHOOK_URL` | Mobile | ❓ |
| `EXPO_PUBLIC_POSTHOG_KEY` | Mobile | ❓ |
| `REVENUECAT_ANDROID_KEY` | Mobile | ❌ Not set |
| `ADMOB_ANDROID_BANNER_ID` | Mobile | ❌ Not set |

---

## Summary

The Q-Empire codebase has a **solid production-quality architecture** and the core journey works end-to-end. The app is **feature-complete for MVP** with all major workflows implemented. The remaining blockers are operational (API keys, auth, policy) rather than architectural — they can be resolved in 1–3 days of focused work.

**Recommended path to go-live:**
1. Fix P1 blockers (RevenueCat, auth, privacy policy, AdMob) — 2–3 days
2. Run mobile test suite with real keys — 1 day  
3. Internal QA on Android device — 1 day
4. Submit to Play Store internal testing track — then graduate to production
