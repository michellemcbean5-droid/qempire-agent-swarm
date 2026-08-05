# Release Control Plan — Q-Empire Android v1.1.0

**Status**: 🟡 AT RISK  
**Owner**: Release Manager  
**Timestamp**: 2026-08-05T01:26:06Z  
**Next Action**: Complete keystore confirmation and freeze enforcement before RC cut

---

## 1. Default Branch & Release Branch Strategy

| Item | Value | Status |
|------|-------|--------|
| Default branch | `master` | ✅ Confirmed |
| Release branch naming | `release/vX.Y.Z` (e.g. `release/v1.1.0`) | ✅ Defined |
| Release candidate branch | `rc/v1.1.0-rc1` cut from `release/v1.1.0` | ✅ Defined |
| Hotfix branch naming | `hotfix/v1.1.1` cut from `release/v1.1.0` | ✅ Defined |
| Feature branches | `feat/*` merged to `master` only | ✅ Defined |

**Next Action**: Create `release/v1.1.0` branch from `master` HEAD before build kick-off.

---

## 2. Required Status Checks for Merge

All PRs to `release/*` branches require:

| Check | Tool | Status |
|-------|------|--------|
| TypeScript typecheck | `npm run typecheck` | 🟡 Pending enforcement |
| ESLint | `npm run lint` | 🟡 Pending enforcement |
| Jest CI | `npm run test:ci` | 🟡 Pending enforcement |
| Python tests | `pytest tests/ -v` | 🟡 Pending enforcement |
| Frontend build | `cd frontend && npm run build` | 🟡 Pending enforcement |
| No secret scan violations | `runtime-tools-secret_scanning` | 🟡 Pending enforcement |

**Next Action**: Enable branch protection rules in GitHub for `release/*` requiring all checks above.

---

## 3. Versioning Scheme

- **App version**: Semantic versioning — `MAJOR.MINOR.PATCH` (current: `1.1.0` in `mobile/app.json`)
- **Android `versionCode`**: Integer, auto-incremented via EAS `autoIncrement: true` (current: `2`)
- **iOS `buildNumber`**: String matching app version (current: `1.0.0` — needs update to `1.1.0`)
- **Release tag format**: `v1.1.0` on `master` post-merge
- **RC tag format**: `v1.1.0-rc1`, `v1.1.0-rc2` on release branch

**Next Action**: Bump iOS `buildNumber` in `app.json` to `1.1.0` before RC build.

---

## 4. Release Candidate Naming Convention

| Artifact | Naming Convention |
|----------|-------------------|
| Android AAB | `qempire-v1.1.0-rc1-release.aab` |
| Android APK (internal test) | `qempire-v1.1.0-rc1-debug.apk` |
| EAS Build ID | Recorded in `artifact-readiness.md` per RC |
| Git tag | `v1.1.0-rc1` |

---

## 5. Environment Config Matrix

| Env | `EXPO_PUBLIC_WEBHOOK_URL` | AdMob | RevenueCat | Analytics |
|-----|--------------------------|-------|------------|-----------|
| dev | `http://localhost:8080` | test IDs | sandbox | disabled |
| preview | staging webhook URL | test IDs | sandbox | enabled |
| production | prod webhook URL | live IDs | live | enabled |

**Status**: 🔴 BLOCKING — Production `EXPO_PUBLIC_WEBHOOK_URL` not confirmed. Placeholder EAS project ID in `app.json`. AdMob live IDs not set.  
**Next Action**: Set all production env vars before production EAS build.

---

## 6. Secrets / Keystore Availability Checklist

| Secret | Location | Status |
|--------|----------|--------|
| Android production keystore | EAS Credentials or local `.jks` | 🔴 NOT CONFIRMED |
| Google Play Service Account JSON | `./google-service-account.json` (gitignored) | 🔴 NOT CONFIRMED |
| `ANTHROPIC_API_KEY` | `.env` (production server) | 🟡 Unverified |
| `EXPO_PUBLIC_HF_API_KEY` | `mobile/.env` | 🟡 Unverified |
| `EXPO_PUBLIC_POSTHOG_KEY` | `mobile/.env` | 🟡 Unverified |
| RevenueCat API keys | `mobile/.env` / app init | 🟡 Unverified |
| AdMob live App IDs | `app.json` config | 🔴 Placeholder values |

**Next Action**: Owner (Michelle) to confirm all secrets present in EAS and production `.env` before RC build.

---

## 7. Release Owners & Incident Contacts

| Role | Owner | Contact |
|------|-------|---------|
| Release Manager | TBD | — |
| Mobile Lead | TBD | — |
| Backend Lead | TBD | — |
| Play Store Publisher | Michelle McBean | GitHub: michellemcbean5-droid |
| Incident Escalation | Michelle McBean | — |
| On-call (first 24h) | TBD | — |

---

## 8. Release Timeline & Checkpoints

| Checkpoint | Target Date | Status |
|-----------|-------------|--------|
| Release branch cut (`release/v1.1.0`) | 2026-08-05 | 🟡 Pending |
| RC1 build kick-off | 2026-08-05 | 🟡 Pending |
| RC1 internal smoke test | 2026-08-06 | 🟡 Pending |
| QA sign-off / gate review | 2026-08-07 | 🟡 Pending |
| Play Store internal testing publish | 2026-08-07 | 🟡 Pending |
| Go/No-Go meeting | 2026-08-08 | 🟡 Pending |
| Production rollout (5%) | 2026-08-08 | 🟡 Pending |
| Production rollout (50%) | 2026-08-09 | 🟡 Pending |
| Full production rollout (100%) | 2026-08-10 | 🟡 Pending |

---

## 9. Freeze Window

- **Code freeze** begins: RC1 cut (targeting 2026-08-05)
- Only P0 crash fixes and P1 blocking bugs accepted to `release/v1.1.0` after freeze
- All other features queue to `master` for v1.2.0
- Freeze enforced by: branch protection (no direct push to `release/*`)

---

## 10. Hotfix Branch Policy

1. Cut `hotfix/v1.1.1` from `release/v1.1.0` tag
2. Patch fix committed with tests
3. PR reviewed + approved by 1 engineer
4. Merge to `hotfix/v1.1.1`, tag `v1.1.1`
5. EAS build triggered automatically
6. Submit to Play Store as emergency update
7. Backport patch to `master` via separate PR

SLA: P0 hotfix deployed to production ≤ 4 hours from detection.

---

## 11. Changelog Generation

- Tool: Manual CHANGELOG.md maintained in repo root
- Format: [Keep a Changelog](https://keepachangelog.com/) standard
- Sections: `Added`, `Changed`, `Fixed`, `Removed`, `Security`
- Generated before each RC tag
- **Next Action**: Create/update `CHANGELOG.md` for v1.1.0 before release.

---

## 12. Release Notes Template (Play Store)

```
What's New in Q-Empire v1.1.0

🚀 New Features
• [Feature 1]
• [Feature 2]

🐛 Bug Fixes
• [Fix 1]

⚡ Performance
• [Improvement 1]

Questions? support@qempire.ai
```

---

## 13. Artifact Naming Policy

| Artifact | Convention |
|----------|-----------|
| Release AAB | `qempire-v{VERSION}-rc{N}.aab` |
| Debug APK | `qempire-v{VERSION}-rc{N}-debug.apk` |
| EAS build URL | Stored in `artifact-readiness.md` |
| SHA-256 checksum file | `qempire-v{VERSION}-rc{N}.aab.sha256` |

---

## 14. Rollback Trigger Criteria

Automatic rollback initiated if any of the following are observed within 24h of rollout:
- Crash-free rate drops below **99.0%**
- ANR rate exceeds **0.5%**
- P0 crash affects core flow (subscription, AI request, auth)
- Revenue drop > 30% vs. baseline hour
- Play Store auto-halt triggered by Google

See `rollback-and-hotfix-plan.md` for execution steps.

---

## 15. Go/No-Go Meeting Format

**Format**: Async Slack standup + synchronous Zoom call if blockers present  
**Attendees**: Release Manager, Mobile Lead, Backend Lead, Michelle  
**Inputs**: `release-gate-matrix.md`, `artifact-readiness.md`, `play-store-compliance-checklist.md`  
**Output**: Signed-off `final-go-no-go.md`  
**Duration**: 30 minutes max  
**Decision authority**: Michelle (final call)
