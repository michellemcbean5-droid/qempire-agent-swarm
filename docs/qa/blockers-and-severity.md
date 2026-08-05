# Q-Empire Agent Swarm — Blockers and Severity Register

**Repository:** `michellemcbean5-droid/qempire-agent-swarm`  
**Report Date:** 2026-08-05  
**Build Ref:** Static code analysis  
**Severity Scale:** P0 = Release blocker / Store rejection | P1 = Critical pre-launch fix | P2 = High-priority post-launch fix

---

## P0 Blockers — Must Fix Before Any Release

---

### BLK-001 — Checkout Performs No Real Payment
**Severity:** P0  
**Category:** Monetization / Revenue  
**File:** `mobile/src/screens/CheckoutScreen.tsx` line 16–23

**Description:**  
The "Pay with PayPal" button calls `showSuccess()` and navigates back to `Main` after a 2-second delay. No payment SDK, no PayPal API, no RevenueCat purchase is invoked. Users believe they have paid but no money is collected and no tier is upgraded.

**Reproduction Steps:**
1. Open app → Profile → tap any paid tier card → Checkout screen loads
2. Tap "Pay with PayPal"
3. Toast shows "Selected [Plan]. Redirecting to payment..." 
4. After 2 seconds, app navigates to Dashboard with no tier change

**Expected:** RevenueCat `purchasePackage()` is called; on success `upgradeTier()` is called and user's subscription is updated.  
**Actual:** No payment occurs. User tier unchanged. No revenue collected.  
**Environment:** All builds (debug, preview, production)

**Suggested Fix:**  
Replace `handlePurchase` body with a real RevenueCat purchase call:
```typescript
const customerInfo = await monetizationService.purchasePackage(pkg.id);
if (customerInfo.activeSubscriptions.size > 0) {
  upgradeTier(pkg.tier);
  analyticsService.track('purchase_complete', { packageId: pkg.id });
}
```

---

### BLK-002 — RevenueCat API Keys Are Placeholder Strings
**Severity:** P0  
**Category:** Monetization / Configuration  
**File:** `mobile/src/services/monetizationService.ts` lines 5–10

**Description:**  
RevenueCat is initialised with the literal strings `'rc_apple_api_key'` and `'rc_google_api_key'`. These are not real API keys. The `initialize()` call will fail or silently proceed in a degraded state, making all purchase, offering retrieval, and restore operations non-functional.

**Reproduction Steps:**
1. Build app with current source
2. Open app (RevenueCat `initialize()` fires on mount in `App.tsx`)
3. Navigate to Checkout → tap "Pay with PayPal"
4. Even if checkout were wired, `getOfferings()` will return null

**Expected:** Real RevenueCat project API keys loaded from environment variables.  
**Actual:** Hardcoded placeholder strings used unconditionally.  
**Environment:** All builds

**Suggested Fix:**  
Move keys to environment variables:
```typescript
const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
});
```
Add keys to `mobile/.env.example` and populate in EAS secrets.

---

### BLK-003 — Master Access Code and Promo Codes Embedded in APK Bundle
**Severity:** P0  
**Category:** Security / Paywall Bypass  
**Files:** `mobile/src/constants/index.ts` line 65; `mobile/src/stores/authStore.ts` lines 80–95

**Description:**  
The master code `QEMP2024ELITE` is exported as a constant and checked client-side. Three promo codes (`START50`, `PROBOOST`, `ELITEACCESS`) with their tier-upgrade effects are also hardcoded in `authStore.ts`. Any user who decompiles the React Native bundle (trivially done with `metro-hermes-decompiler` or `apktool`) can extract these codes and claim free Elite access.

**Reproduction Steps:**
1. Download APK from Play Store (or sideload debug APK)
2. Extract APK; locate the Hermes bytecode bundle
3. Disassemble or search bundle text for string `QEMP`
4. Apply extracted code in-app → Elite tier granted, all paywalls bypassed

**Expected:** No tier-granting logic or promo codes executable without server-side validation.  
**Actual:** Client-side check against hardcoded strings grants Elite access instantly.  
**Environment:** Any APK build

**Suggested Fix:**  
Move promo/master code validation to the backend. Client sends code to `POST /promo/validate`; server checks against a secure database and returns a signed token. Client-side constants file must not contain any code with monetary value.

---

### BLK-004 — Session Data Stored in Unencrypted AsyncStorage
**Severity:** P0  
**Category:** Security / Data Protection  
**Files:** `mobile/src/stores/authStore.ts`; `mobile/src/stores/appStore.ts`; `mobile/src/stores/subscriptionStore.ts`

**Description:**  
User objects (email, subscription tier, referral code, credits), project data, and AI insights are all persisted to React Native `AsyncStorage`, which is stored in plaintext on Android in the app's data directory. On rooted devices or via ADB backup on debug builds, this data is fully accessible.

**Reproduction Steps:**
1. Register in app → user object written to AsyncStorage key `user`
2. On rooted Android device: `adb shell run-as com.qempire.app cat /data/data/com.qempire.app/databases/RKStorage`  
   (or via `AsyncStorage` inspection tools for Expo)
3. JSON payload with email, tier, referral code visible in plaintext

**Expected:** Sensitive user data stored using `expo-secure-store` (AES-256 encrypted, hardware-backed on Android 6+).  
**Actual:** Plaintext `AsyncStorage`.  
**Environment:** All Android builds; especially critical on rooted devices

**Suggested Fix:**  
Replace `AsyncStorage` for sensitive keys with `expo-secure-store`. The dependency is already in `package.json`. Non-sensitive bulk data (projects, insights) may remain in AsyncStorage.

---

### BLK-005 — No Privacy Policy Link in App (Play Store Rejection)
**Severity:** P0  
**Category:** Store Compliance / Legal  
**Files:** All screens — absent

**Description:**  
Google Play requires every app that collects personal data to display an accessible link to its privacy policy within the app. Q-Empire collects email addresses, usage data (PostHog), crash data (Sentry), and potentially payment information. No privacy policy link exists in any screen.

**Reproduction Steps:**
1. Submit APK to Google Play
2. Play Store review process flags missing in-app privacy policy link
3. App rejected or taken down

**Expected:** Tappable "Privacy Policy" link visible in OnboardingScreen, SettingsScreen, and ProfileScreen.  
**Actual:** No privacy policy link anywhere in the app.  
**Environment:** Play Store submission

**Suggested Fix:**  
1. Host a privacy policy at `https://qempire.app/privacy`
2. Add `<TouchableOpacity onPress={() => Linking.openURL('https://qempire.app/privacy')}>` to OnboardingScreen and SettingsScreen
3. Add link to `app.json` store metadata

---

### BLK-006 — No Account Deletion Path (Play Store Policy)
**Severity:** P0  
**Category:** Store Compliance / Legal  
**Files:** `mobile/src/screens/SettingsScreen.tsx`; `mobile/src/screens/ProfileScreen.tsx`

**Description:**  
Google Play's policy (effective May 2023) requires all apps that allow account creation to also provide an in-app path to request account and data deletion. Q-Empire has no "Delete Account" button in any screen. The `logout()` function only removes the local `AsyncStorage` entry — there is no backend data deletion.

**Reproduction Steps:**
1. Create account in app
2. Navigate to Settings or Profile
3. No "Delete Account" option exists
4. App submitted to Play Store → rejected

**Expected:** "Delete Account" option in Settings; on confirmation, sends deletion request to backend which removes all user data within 30 days per GDPR/CCPA requirements.  
**Actual:** No delete account feature exists.  
**Environment:** Play Store submission

**Suggested Fix:**  
Add `DELETE /user/:id` endpoint to backend. Add "Delete Account" button to SettingsScreen with a confirmation dialog. Notify user by email and delete all stored data within 30 days.

---

### BLK-007 — Authentication Is a Client-Side Mock
**Severity:** P0  
**Category:** Security / Authentication  
**Files:** `mobile/src/stores/authStore.ts` lines 35–60

**Description:**  
`login()` and `register()` create a user object locally using `Date.now()` as the ID without any server call. Any email and any password combination "succeeds." There is no password hashing, no server verification, no JWT issuance, and no duplicate email prevention. Two users can register with the same email. After logout, the same email can be "logged in" as a completely new user with no relationship to the previous account.

**Reproduction Steps:**
1. Register with `test@example.com` / `password123` → "success"
2. Logout
3. Login with `test@example.com` / `wrongpassword` → "success" (new user object created)
4. Previous user's data is gone (different `id`)

**Expected:** Server-side auth with unique email constraint, password hashing (bcrypt), JWT issuance, and session validation.  
**Actual:** Client-side mock that always succeeds.  
**Environment:** All builds

**Suggested Fix:**  
Implement a real auth backend. Options: Firebase Auth, Supabase Auth, Auth0, or a custom FastAPI endpoint with bcrypt password hashing and JWT. The webhook receiver already has a FastAPI foundation to extend.

---

### BLK-008 — AI Credit Deduction Not Implemented
**Severity:** P0  
**Category:** AI Credits / Cost Controls  
**Files:** `mobile/src/stores/authStore.ts`; `mobile/src/stores/subscriptionStore.ts`; `mobile/src/screens/AIScreen.tsx`

**Description:**  
The `User` type has a `credits` field, initialised to 10 on registration. `AIScreen` calls `incrementAIRequest()` to track daily count, but `user.credits` is never decremented on any AI usage. There is no mechanism to consume credits, enforce a credit cap, or prevent unlimited AI usage. The backend has no credit-tracking or cost-accounting layer either.

**Reproduction Steps:**
1. Register → user.credits = 10
2. Use AI feature 100 times
3. user.credits still = 10 after all requests

**Expected:** Each AI request decrements `user.credits` by the appropriate amount; at 0 credits, AI usage is blocked with an upgrade/top-up prompt.  
**Actual:** Credits are never decremented; no cost accounting of any kind.  
**Environment:** All builds

**Suggested Fix:**  
In `incrementAIRequest()`, also call `useAuthStore.getState().deductCredits(cost)`. Add `deductCredits(amount: number)` to authStore that decrements `user.credits`, persists to AsyncStorage, and calls a backend endpoint to keep server-side balance in sync. Add a credit balance widget to the dashboard and a hard block when `credits <= 0`.

---

### BLK-009 — No Terms of Service Link in App
**Severity:** P0  
**Category:** Store Compliance / Legal  
**Files:** All screens — absent

**Description:**  
Google Play requires apps that charge users or collect personal data to provide accessible terms of service. No ToS link exists in the app.

**Reproduction Steps:**
1. Open app → Onboarding
2. No ToS/legal agreement checkbox or link presented
3. User can create account and pay without agreeing to any terms

**Expected:** ToS link visible during registration; optional checkbox "I agree to the Terms of Service."  
**Actual:** No ToS anywhere.

**Suggested Fix:**  
Add ToS link alongside privacy policy in OnboardingScreen.

---

## P1 Issues — Must Fix Before Launch

| ID | Issue | File | Fix Summary |
|----|-------|------|-------------|
| P1-001 | Checkout tier mapping mismatch — two conflicting pricing models | `constants/index.ts` | Unify `PACKAGES` and `SUBSCRIPTION_TIERS` into one model or clearly map them |
| P1-002 | `/agents` endpoint present in backend but mobile `fetchAgents()` falls back to defaults because responses don't match expected shape | `agentStore.ts`, `webhook_receiver.py` | Align API response format with `AgentProfile` type |
| P1-003 | `AgentManagementScreen` uses its own hardcoded `DEFAULT_AGENTS` instead of `agentStore` | `AgentManagementScreen.tsx` | Import and use `useAgentStore` to display live state |
| P1-004 | QBotScreen has no rate-limiting or credit check | `QBotScreen.tsx` | Add `canUseFeature('ai_requests')` guard before each message send |
| P1-005 | No pause/stop controls for running agent tasks | All screens, `webhook_receiver.py` | Add `POST /task/:id/cancel` endpoint; add cancel button to ProjectDetailScreen |
| P1-006 | Failed tasks show error status with no explanation | `ProjectDetailScreen.tsx` | Pass error message from backend to task object; display in error state UI |
| P1-007 | No trial period logic anywhere | `subscriptionStore.ts`, backend | Add trial start/end timestamp to user object; enforce trial expiry gating |
| P1-008 | Project and automation count limits defined but not enforced | `ProjectsScreen.tsx` | Check `maxProjects` before allowing `addProject()`; show gated upgrade prompt |
| P1-009 | No skill assignment UI | `AgentDetailScreen.tsx` | Add skill toggle list reading from `skills/` JSON definitions |
| P1-010 | No connector setup or status screen in mobile | Mobile app | Add ConnectorsScreen showing each backend tool's configured/unconfigured status |
| P1-011 | No retry/backoff logic in any connector tool | `tools/*.py` | Add exponential backoff wrapper (e.g., `tenacity` library) to all connector calls |
| P1-012 | Crash reporting SDK (`@sentry/react-native`) in package.json but not initialised in code | `App.tsx` | Add `Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN })` to App.tsx |
| P1-013 | No subscription cancellation or downgrade flow | `ProfileScreen.tsx`, RevenueCat | Use `Purchases.getCustomerInfo()` to check active entitlements; surface management link |
| P1-014 | Credit balance never displayed in UI | `DashboardScreen.tsx`, `ProfileScreen.tsx` | Add credit balance widget using `user.credits` from authStore |
| P1-015 | No admin panel of any kind | Entire codebase | Build minimal admin panel (web) with agent status, task queue, and user lookup |

---

## P2 Issues — High Priority Post-Launch

| ID | Issue | File | Fix Summary |
|----|-------|------|-------------|
| P2-001 | AI model `gpt2` produces incoherent business advice | `aiService.ts` | Upgrade to `mistralai/Mistral-7B-Instruct-v0.3` or use `Zephyr-7B` on HuggingFace |
| P2-002 | No streaming for AI responses; 30s timeout freezes UI | `aiService.ts`, `QBotScreen.tsx` | Implement streaming via `EventSource` or chunked response |
| P2-003 | No revenue goal input field | `DashboardScreen.tsx` | Add goal-setting modal; persist to appStore |
| P2-004 | Upgrade prompt in AIScreen has no action button | `AIScreen.tsx` | Add "Upgrade Now" button that navigates to `Checkout` |
| P2-005 | Delegation events not surfaced in mobile app | `QBotScreen.tsx`, backend | Stream agent event_stream events to mobile via SSE or polling |
| P2-006 | No per-agent usage accounting | Backend, `agentStore.ts` | Track `credits_used` per agent in AgentProfile; display in AgentDetailScreen |
| P2-007 | Biometric login toggle not wired to `expo-local-authentication` | `SettingsScreen.tsx` | Implement `LocalAuthentication.authenticateAsync()` on toggle enable |
| P2-008 | Referral code copy button is not functional | `ProfileScreen.tsx` | Use `Clipboard.setStringAsync(referralCode)` from `expo-clipboard` |
| P2-009 | Monetization events not tracked in analytics | `CheckoutScreen.tsx` | Add PostHog `analyticsService.track('purchase_complete')` calls |
| P2-010 | No audit log or task execution log view | Mobile app, backend | Store event_stream to a log file; add LogViewerScreen in mobile app |
| P2-011 | Dark mode toggle in settings has no effect | `SettingsScreen.tsx` | Wire toggle to a theme context/provider |
| P2-012 | No end-to-end tests | All | Add Detox (mobile) and Playwright (web) E2E test suites |
| P2-013 | No connector health-check on backend startup | `bridge/webhook_receiver.py` | Add startup event that validates each configured connector |
| P2-014 | No rate limiting on webhook API endpoints | `bridge/webhook_receiver.py` | Add `slowapi` or similar rate limiting middleware |
| P2-015 | `POST /task` has no authentication/authorization | `bridge/webhook_receiver.py` | Add webhook signature validation via `WEBHOOK_SECRET` env var |

---

## Severity Summary

| Severity | Count | Status |
|----------|-------|--------|
| P0 — Release Blockers | 9 | Must fix before any submission |
| P1 — Critical Pre-Launch | 15 | Must fix before public launch |
| P2 — High Priority | 15 | Fix within first 2 sprints post-launch |
| **Total** | **39** | |
