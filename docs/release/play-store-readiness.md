# Q-Empire — Play Store Readiness Checklist

**Date**: 2026-08-05  
**Branch**: `feat/ship-readiness-pass`

---

## App Configuration

| Item | Status | Notes |
|------|--------|-------|
| `app.json` — `name` | ✅ | "Q-Empire: AI Business Builder" |
| `app.json` — `slug` | ✅ | "qempire-agent-swarm" |
| `app.json` — `version` | ✅ | "1.1.0" |
| `app.json` — `android.package` | ✅ | "com.qempire.automation" |
| `app.json` — `android.versionCode` | ✅ | 2 |
| `app.json` — `privacyPolicyUrl` | ✅ | Added this PR |
| `app.json` — `scheme` (deep link) | ✅ | "qempire" |
| `app.json` — `icon` | ⚠️ | Asset file required at `./assets/icon.png` |
| `app.json` — `adaptiveIcon` | ⚠️ | Asset file required at `./assets/adaptive-icon.png` |
| `app.json` — `splash` | ⚠️ | Asset file required at `./assets/splash.png` |

---

## Build Configuration (EAS)

| Item | Status | Notes |
|------|--------|-------|
| `eas.json` — dev profile | ✅ | Internal distribution |
| `eas.json` — preview profile | ✅ | APK output |
| `eas.json` — production profile | ✅ | AAB output for Play Store |
| EAS project ID | ⚠️ | Replace `your-eas-project-id` in `app.json` |
| Android keystore | ⚠️ | Must be configured in EAS before production build |

### Build Commands
```bash
# Preview APK (internal testing)
eas build --profile preview --platform android

# Production AAB (Play Store submission)
eas build --profile production --platform android
```

---

## Signing

| Item | Status |
|------|--------|
| EAS managed credentials | ⚠️ Run `eas credentials` to generate/upload keystore |
| SHA-1 fingerprint for Google Play | ⚠️ Required for in-app billing (RevenueCat) |
| App signing by Google Play | ⚠️ Enroll in Play App Signing in Google Play Console |

---

## Required Environment Variables (Production)

| Variable | Purpose | Status |
|----------|---------|--------|
| `EXPO_PUBLIC_HF_API_KEY` | HuggingFace AI | ⚠️ Required |
| `EXPO_PUBLIC_POSTHOG_KEY` | Analytics | ⚠️ Required |
| `EXPO_PUBLIC_WEBHOOK_URL` | Q-Empire API | ⚠️ Required |
| RevenueCat Android key | In-app purchases | ⚠️ Replace placeholder in `monetizationService.ts` |
| AdMob App ID | Ads | ⚠️ Replace `ca-app-pub-xxxxxxx` in `app.json` |

---

## Play Store Submission Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Privacy Policy URL | ✅ | https://qempire.app/privacy (placeholder — must publish) |
| Terms of Service URL | ✅ | Linked in SupportScreen |
| App icon (512×512 PNG) | ⚠️ | Create and upload to Play Console |
| Feature graphic (1024×500 PNG) | ⚠️ | Required for Play Store listing |
| Screenshots (min 2, Android phone) | ⚠️ | Capture from emulator/device |
| Short description (≤80 chars) | ⚠️ | Write for Play Console |
| Full description (≤4000 chars) | ⚠️ | Write for Play Console |
| Content rating questionnaire | ⚠️ | Complete in Play Console |
| Target age group | ⚠️ | 18+ (business app) |
| Data safety form | ⚠️ | Declare: email, name, usage data, no financial data |
| App category | ⚠️ | Business / Productivity |

---

## Google Play Policies

| Policy | Status | Notes |
|--------|--------|-------|
| AI-generated content disclosure | ⚠️ | Must disclose AI content in listing |
| Subscription billing (Play Billing API) | ⚠️ | RevenueCat handles but keys must be real |
| Advertising ID / IDFA | ⚠️ | AdMob requires user consent in EU (GDPR) |
| No mimic of other apps | ✅ | Original implementation |
| Privacy policy required for account creation | ✅ | Added this PR |

---

## Testing Before Submission

| Step | Status |
|------|--------|
| Install APK on Android 10+ device | ⚠️ |
| Complete onboarding flow end-to-end | ⚠️ |
| Verify in-app purchase (RevenueCat sandbox) | ⚠️ |
| Verify push notifications | ⚠️ |
| Test on low-spec device (2GB RAM) | ⚠️ |
| Test with airplane mode (offline state) | ⚠️ |

---

## Fastlane Configuration

The repo includes `mobile/fastlane/` with `Appfile` and `Fastfile`. Review and update:
- `mobile/fastlane/Appfile` — set `package_name`
- `mobile/fastlane/Fastfile` — configure `supply` for automated Play Store upload

---

## Estimated Release Timeline

| Milestone | Target |
|-----------|--------|
| Internal testing track | Week 1 |
| Closed testing (alpha) | Week 2 |
| Open testing (beta) | Week 3 |
| Production release | Week 4 |
