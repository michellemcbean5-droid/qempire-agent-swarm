# Play Store Compliance Checklist — Q-Empire Android v1.1.0

**Status**: 🔴 NOT READY  
**Owner**: Michelle McBean  
**Timestamp**: 2026-08-05T01:26:06Z  
**Next Action**: Complete store listing metadata, Data Safety form, and legal link hosting

---

## 1. Play Store Listing Metadata

| Field | Required | Value | Status |
|-------|----------|-------|--------|
| App name | Yes | "Q-Empire: AI Business Builder" | ✅ |
| Package name | Yes | `com.qempire.automation` | ✅ |
| Short description | Yes (80 chars max) | 🔴 Not written | 🔴 |
| Full description | Yes (4000 chars max) | 🔴 Not written | 🔴 |
| Category | Yes | Business / Productivity | 🟡 Pending entry |
| Contact email | Yes | 🔴 Not set | 🔴 |
| Website URL | Recommended | 🔴 Not set | 🔴 |

**Next Action**: Draft short + full description. Set contact email and website in Play Console.

---

## 2. Screenshots / Icon / Feature Graphic

| Asset | Spec | Status |
|-------|------|--------|
| App icon | 512×512 px PNG, ≤1024KB | 🟡 `./assets/icon.png` exists — verify dimensions |
| Adaptive icon (foreground) | Configured | ✅ `./assets/adaptive-icon.png` |
| Feature graphic | 1024×500 px JPG/PNG | 🔴 Not confirmed |
| Phone screenshots (portrait) | Min 2, max 8 — 1080×1920 recommended | 🔴 Not prepared |
| 7-inch tablet screenshots | Optional | ⏸️ Deferred |
| 10-inch tablet screenshots | Optional | ⏸️ Deferred |

**Next Action**: Produce at least 4 phone screenshots covering: Home, Dashboard, AI screen, Subscription/upgrade screen.

---

## 3. Privacy Policy URL & Content Alignment

| Check | Status | Notes |
|-------|--------|-------|
| Privacy policy hosted at public URL | 🔴 NOT CONFIRMED | e.g. `https://qempire.ai/privacy` |
| URL entered in Play Console | 🔴 NOT CONFIRMED | Required before submission |
| Policy covers data collected by app | 🔴 NOT CONFIRMED | Must include: PostHog analytics, Sentry crash data, RevenueCat purchase data |
| Policy covers AI-generated content | 🔴 NOT CONFIRMED | Required for AI/automation apps |
| Policy covers account deletion | 🔴 NOT CONFIRMED | Google requires account deletion support as of Dec 2023 |
| GDPR/CCPA provisions included | 🔴 NOT CONFIRMED | Required for EU/CA users |

**Next Action**: Generate and publish privacy policy. Minimum viable: use privacypolicies.com generator, customize for Q-Empire data practices.

---

## 4. Terms of Service / Support Links

| Link | Status |
|------|--------|
| Terms of Service URL | 🔴 NOT CONFIRMED |
| Support email / URL | 🔴 NOT CONFIRMED |
| Refund policy URL or statement | 🔴 NOT CONFIRMED |

**Next Action**: Publish ToS and support contact. Can be hosted on same domain as privacy policy.

---

## 5. Permission Disclosure Clarity

Permissions declared in `app.json` Android section:

| Permission | Justification Required | Status |
|------------|----------------------|--------|
| `INTERNET` | Standard network access | ✅ Self-evident |
| `ACCESS_NETWORK_STATE` | Check connectivity | ✅ Self-evident |
| `RECEIVE_BOOT_COMPLETED` | Background agent/notification on boot | 🟡 Justify in store listing |
| `WAKE_LOCK` | Keep agent running | 🟡 Justify in store listing |
| `VIBRATE` | Notifications | ✅ Standard |
| `CAMERA` | QR scanning / profile photos | 🟡 Must be used; if not, remove |
| `READ_EXTERNAL_STORAGE` | Photo upload | 🟡 Use scoped storage API instead (Android 13+) |
| `WRITE_EXTERNAL_STORAGE` | File save | 🟡 Deprecated Android 13+ — review necessity |

**Next Action**: Audit which permissions are actually exercised in code. Remove unused permissions. Camera usage description already set in `infoPlist` for iOS — add equivalent Android justification.

---

## 6. Data Safety Form Inputs

Google Play requires disclosure of all data collected, used, and shared.

| Data Type | Collected | Shared | Encrypted | Optional | Status |
|-----------|-----------|--------|-----------|----------|--------|
| User email / account info | Yes (auth) | No | Yes (HTTPS) | No | 🟡 Declare |
| Purchase / payment info | Via RevenueCat | RevenueCat (processor) | Yes | No | 🟡 Declare |
| App activity (analytics) | Yes (PostHog) | PostHog (processor) | Yes | Yes (opt-out) | 🟡 Declare |
| Crash logs | Yes (Sentry) | Sentry (processor) | Yes | Yes | 🟡 Declare |
| Device identifiers | Yes (AdMob) | Google AdMob | Yes | Free tier only | 🟡 Declare |
| AI prompts / content | Via HuggingFace API | HuggingFace | Yes (HTTPS) | No | 🟡 Declare |

**Status**: 🔴 Form not submitted  
**Next Action**: Complete Data Safety form in Play Console covering all 6 data categories above.

---

## 7. Content Rating

| Check | Status |
|-------|--------|
| Content rating questionnaire completed | 🔴 NOT DONE |
| Expected rating | PEGI 3 / Everyone (business productivity app) |
| Questionnaire flags to watch | AI content generation — answer accurately; no adult content generated |

**Next Action**: Complete IARC content rating questionnaire in Play Console. Expected result: Everyone / PEGI 3.

---

## 8. Account Deletion / Disconnect Support

Google Play requires apps with accounts to support account deletion as of December 2023.

| Check | Status |
|-------|--------|
| Account deletion option in app settings | 🔴 NOT CONFIRMED in codebase |
| Account deletion flow tested | 🔴 NOT TESTED |
| Data deletion within 30 days post-request | 🔴 NOT CONFIRMED (backend policy needed) |
| Deletion URL provided to Play Console | 🔴 NOT SET |

**Next Action**: Implement account deletion in Settings screen. Add deletion URL (can be a web form) to Play Console listing.

---

## 9. AI / Automation Claim Wording Safety

App uses AI automation as its core value proposition. Play Store policies require accurate disclosure.

| Check | Status |
|-------|--------|
| No false claims of "fully autonomous" or "guaranteed income" | 🟡 Review store description copy |
| AI limitations disclosed | 🔴 NOT CONFIRMED |
| No deceptive automation claims in screenshots | 🟡 Screenshots not yet prepared |
| HuggingFace (free tier) limitations acknowledged in UX | 🟡 Review UX copy |
| "AI Business Builder" claim substantiated | 🟡 Ensure features match claims |

**Next Action**: Legal review of store listing copy. Include disclaimer: "AI-generated results vary. Q-Empire automates workflows but does not guarantee business outcomes."

---

## 10. Monetization Disclosure Compliance

| Check | Status |
|-------|--------|
| Subscription pricing clearly shown before purchase | ✅ RevenueCat paywall handles this |
| Auto-renewal terms displayed | 🟡 Verify RevenueCat paywall includes Google-required text |
| Subscription management link in app | 🟡 Verify Settings → Manage Subscription links to Play Store |
| Free tier limitations clearly described | 🟡 Verify in store listing |
| Trial terms disclosed (if any trials offered) | ⏸️ N/A currently |

---

## 11. Subscription Management UX Links

| Check | Status |
|-------|--------|
| "Manage Subscription" button in Settings | 🟡 Verify exists in `SettingsScreen.tsx` |
| Links to `https://play.google.com/store/account/subscriptions` | 🟡 Verify implementation |
| Cancel flow accessible without contacting support | 🟡 Verify |

---

## 12. In-App Policy Surfaces Accessibility

| Surface | Status |
|---------|--------|
| Privacy policy link in app (Settings or onboarding) | 🟡 Verify in codebase |
| Terms of service link in app | 🟡 Verify in codebase |
| Link to subscription management | 🟡 Verify in codebase |

---

## 13. Legal Disclaimer Placement

Required disclaimers to include in app and/or store listing:

- [ ] AI disclaimer: "AI-generated content may not always be accurate."
- [ ] Business disclaimer: "Results are not guaranteed. Q-Empire is a productivity tool."
- [ ] Subscription disclaimer: "Subscription renews automatically unless cancelled."
- [ ] Data disclaimer: "Your data is processed by third-party services (see Privacy Policy)."

---

## 14. Known Limitations Disclosure

The following limitations should be disclosed in store listing or onboarding:

| Limitation | Where to Disclose |
|-----------|------------------|
| Free tier: 5 AI requests/day | Store listing + in-app |
| HuggingFace free API rate limits | In-app tooltip |
| Requires internet connection | Store listing permissions section |
| Android only (iOS future roadmap) | Store listing |

---

## 15. Store-Readiness Checklist Summary

| Category | Status |
|----------|--------|
| Store listing metadata | 🔴 INCOMPLETE |
| Visual assets | 🔴 INCOMPLETE |
| Privacy policy | 🔴 MISSING |
| Terms of service | 🔴 MISSING |
| Permissions audit | 🟡 AT RISK |
| Data Safety form | 🔴 NOT SUBMITTED |
| Content rating | 🔴 NOT DONE |
| Account deletion | 🔴 NOT IMPLEMENTED |
| AI claim wording | 🟡 NEEDS REVIEW |
| Monetization disclosure | 🟡 PARTIAL |
| Subscription management UX | 🟡 UNVERIFIED |

**Overall Status**: 🔴 NOT READY FOR PLAY STORE SUBMISSION

**Top Blockers:**
1. Privacy policy not published
2. Store listing (short/full description) not written
3. Screenshots not prepared
4. Data Safety form not submitted
5. Account deletion not implemented
6. Content rating questionnaire not completed
7. Terms of service not published
