# Q-Empire — Launch Checklist

**Target**: Google Play Store (Internal Testing → Production)  
**Date**: 2026-08-04

---

## Pre-Launch: Technical

### Backend
- [ ] All environment variables set in production `.env`
- [ ] Docker Compose production config validated
- [ ] Webhook receiver returns 200 for `/health`
- [ ] Bridge monitor polls correctly at `POLL_INTERVAL`
- [ ] Anthropic API key valid and has sufficient credits
- [ ] Email sending (Gmail SMTP) tested end-to-end
- [ ] GitHub Pages deployment tested
- [ ] All 6 skill JSON files load without error

### Frontend
- [ ] `npm run build` passes with no errors
- [ ] `npx tsc --noEmit` passes
- [ ] ESLint passes (`npm run lint`)
- [ ] Checkout flow tested with real Stripe test keys
- [ ] Onboarding wizard completes successfully
- [ ] Client portal loads deliverables correctly

### Mobile App
- [ ] `npm run typecheck` passes (zero TS errors)
- [ ] `npm run lint` passes (zero ESLint errors)
- [ ] `npm run test:ci` passes (all tests green)
- [ ] Expo Go QR code tested on physical Android device
- [ ] Push notifications received on device
- [ ] Deep links open correct screens
- [ ] All 11 screens render without crash
- [ ] Subscription purchase flow tested (RevenueCat sandbox)
- [ ] AdMob test ads display correctly

### EAS Build
- [ ] `eas build --platform android --profile production` completes
- [ ] AAB file (Android App Bundle) generated
- [ ] App signed with production keystore
- [ ] `versionCode` incremented in `app.json`

---

## Pre-Launch: Store Listing

### Google Play Console
- [ ] App created in Google Play Console
- [ ] Package name matches `app.json` (`bundleIdentifier`)
- [ ] App title: "Q-Empire: AI Business Builder"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Feature graphic (1024×500 px)
- [ ] App icon (512×512 px, PNG)
- [ ] Screenshots: phone (min 2), 7-inch tablet (optional), 10-inch tablet (optional)
- [ ] Privacy Policy URL entered
- [ ] Content rating questionnaire complete
- [ ] Data Safety form complete
- [ ] Category: Business / Productivity

### Pricing
- [ ] Free with in-app purchases selected
- [ ] Subscription products created in Play Console matching RevenueCat products
- [ ] Subscription pricing verified per country

---

## Pre-Launch: Marketing

- [ ] Landing page live at domain
- [ ] Social media accounts created (Instagram, TikTok, LinkedIn, X)
- [ ] Launch post drafted and scheduled
- [ ] Email list pre-launch campaign ready
- [ ] Beta testers recruited (minimum 10 for internal testing track)
- [ ] Product Hunt launch scheduled

---

## Launch Day

- [ ] Internal testing track published to Google Play
- [ ] Share testing link with beta testers
- [ ] Monitor Firebase Crashlytics for crashes
- [ ] Monitor PostHog for funnel drop-offs
- [ ] Respond to beta feedback within 24 hours

---

## Post-Launch (Week 1)

- [ ] Promote to closed testing (100 testers)
- [ ] Fix P0 bugs within 24 hours
- [ ] Submit for production review (if ratings ≥ 4.0)
- [ ] Run first paid marketing campaign
