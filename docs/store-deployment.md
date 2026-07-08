# Store Deployment Guide — Q-Empire Mobile App

## Prerequisites

1. **Expo Account** — Create at https://expo.dev
2. **Apple Developer Account** — $99/year at https://developer.apple.com
3. **Google Play Developer Account** — $25 one-time at https://play.google.com/console
4. **RevenueCat Account** — Free tier at https://www.revenuecat.com
5. **AdMob Account** — Free at https://admob.google.com

---

## Step 1: Configure EAS

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
```

Update `eas.json` with your project ID and credentials.

---

## Step 2: Build for Preview

```bash
# Android APK (internal testing)
eas build --profile preview --platform android

# iOS Simulator build
eas build --profile preview --platform ios
```

---

## Step 3: Build for Production

```bash
# Android AAB (Google Play)
eas build --profile production --platform android

# iOS (App Store)
eas build --profile production --platform ios
```

---

## Step 4: App Store Submission (iOS)

1. Download production build from EAS
2. Open Xcode → Open App Store Connect
3. Create new app with bundle ID `com.qempire.automation`
4. Upload IPA via Transporter or Xcode
5. Fill metadata:
   - Title: "Q-Empire: AI Business Builder"
   - Subtitle: "Build your empire in 90 minutes"
   - Keywords: ai business, automation, no-code, website builder, startup tools
   - Description: See `mobile/store-metadata/description.txt`
6. Submit for review (typically 24-48 hours)

---

## Step 5: Google Play Submission (Android)

1. Download AAB from EAS
2. Go to Google Play Console
3. Create new app with package `com.qempire.automation`
4. Upload AAB to Production track
5. Fill store listing:
   - Title: "Q-Empire: AI Business Builder"
   - Short description: "Build your entire business with AI in 90 minutes"
   - Full description: See `mobile/store-metadata/description.txt`
6. Set up in-app products in Google Play Console
7. Submit for review (typically 1-3 days)

---

## Step 6: RevenueCat Setup

1. Create products in RevenueCat dashboard:
   - `qempire_basic_monthly` — $9.99
   - `qempire_pro_monthly` — $29.99
   - `qempire_elite_monthly` — $99.99
2. Configure entitlements:
   - `basic` → basic features
   - `pro` → pro features
   - `elite` → all features
3. Copy API keys to `app.json` and monetization service

---

## Step 7: AdMob Setup

1. Create app in AdMob dashboard
2. Add ad units:
   - Banner: `ca-app-pub-xxx/yyy`
   - Interstitial: `ca-app-pub-xxx/zzz`
   - Rewarded: `ca-app-pub-xxx/www`
3. Update `app.json` with real ad unit IDs
4. Test with test IDs before production

---

## Step 8: PostHog Analytics

1. Create project at https://posthog.com
2. Copy project API key
3. Set `EXPO_PUBLIC_POSTHOG_KEY` in environment
4. Verify events are flowing in dashboard

---

## Store Metadata Files

Create these in `mobile/store-metadata/`:

### `title.txt`
```
Q-Empire: AI Business Builder
```

### `subtitle.txt`
```
Build your empire in 90 minutes with AI
```

### `description.txt`
```
Q-Empire is the fastest way to turn your business idea into reality.

Powered by Michelle (the Mermaid Queen of the Deep) and Q-Bot (your AI automation agent), Q-Empire builds your entire business in under 90 minutes:

✅ Professional business plan & pitch deck
✅ Beautiful website (3-7 pages)
✅ AI-powered automations
✅ Funding strategy & grant research
✅ Branding & logo generation

Whether you're a first-time founder or a serial entrepreneur, Q-Empire handles the tech so you can focus on your vision.

FREE TIER includes:
• AI content assistant (5 requests/day)
• Project dashboard
• Progress tracking
• Community support

SUBSCRIPTION TIERS:
• Basic ($9.99/mo): 3 projects, 50 AI requests/day
• Pro ($29.99/mo): 10 projects, 200 AI requests/day, market insights
• Elite ($99.99/mo): Unlimited everything, API access, white-glove support

Download now and start building your empire today.
```

### `keywords.txt`
```
ai business builder, no code automation, website builder, startup tools, business plan generator, pitch deck creator, ai automation, entrepreneur app, small business app, funding strategy, grant finder, business automation, zapier alternative, make alternative, notion alternative
```

---

## CI/CD with GitHub Actions

See `.github/workflows/mobile-deploy.yml` for automated EAS builds on every release tag.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with "bundle identifier" error | Update `app.json` bundle ID to match Apple/Google Play |
| AdMob ads not showing | Check test vs production IDs, verify AdMob app approval |
| RevenueCat purchases failing | Verify product IDs match store console exactly |
| Push notifications not working | Check Expo push credentials, verify APNs setup |
| Deep links not opening | Verify URL scheme in `app.json` matches linking config |

---

## Post-Launch Checklist

- [ ] Monitor crash reports (Sentry)
- [ ] Track conversion funnels (PostHog)
- [ ] Respond to store reviews within 24h
- [ ] A/B test pricing tiers
- [ ] Run weekly retention analysis
- [ ] Update screenshots with seasonal themes
