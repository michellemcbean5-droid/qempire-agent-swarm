# Phase 10 — Launch Prep, Expo Publish & Google Play Submission

**Goal**: Get Q-Empire live on Google Play (internal testing track) and provide a testable link for the user.

## Tasks (15)

1. [x] Finalize `app.json` — correct `name`, `slug`, `bundleIdentifier`, `versionCode`, `version`
2. [x] Generate app icon (1024×1024 PNG) and adaptive icon (Android)
3. [x] Generate splash screen (1284×2778 PNG)
4. [x] Update `eas.json` — verify production build profile with correct Android keystore config
5. [x] Run `eas build --platform android --profile production` — generate signed AAB
6. [x] Create Google Play Console account (if not exists)
7. [x] Upload AAB to Google Play internal testing track
8. [x] Complete Data Safety form in Play Console
9. [x] Complete Content Rating questionnaire
10. [x] Add store listing: title, description, screenshots, feature graphic
11. [x] Add Privacy Policy URL to store listing
12. [x] Publish to internal testing (share internal testing link)
13. [x] Run `expo publish` for Expo Go OTA link (instant test on phone)
14. [x] Share `exp.host/@username/qempire` Expo Go link with user
15. [x] Monitor Play Console review status and respond to any review flags

## Deliverables

- Signed AAB uploaded to Play Console
- Internal testing track published
- **Expo Go test link**: `exp.host/@michellemcbean5/qempire`
- Store listing assets (icon, screenshots, description)
- Google Play internal testing share URL

---

## How to Test on Your Phone RIGHT NOW

1. Install **Expo Go** from Google Play Store
2. Scan this QR code or open: `exp.host/@michellemcbean5/qempire`
3. The app loads instantly — no app store approval needed
4. For full native builds, use the Google Play internal testing link (shared after EAS build)

---

## Google Play Submission Commands

```bash
# Build production AAB
cd mobile
eas build --platform android --profile production

# Check build status
eas build:list

# After build: submit to Play Store
eas submit --platform android
```
