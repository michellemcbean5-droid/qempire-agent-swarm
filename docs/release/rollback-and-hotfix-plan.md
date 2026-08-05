# Rollback & Hotfix Plan — Q-Empire Android v1.1.0

**Status**: ✅ DOCUMENTED  
**Owner**: Release Manager  
**Timestamp**: 2026-08-05T01:26:06Z  
**Next Action**: Rehearse Play Console rollout halt procedure before production go-live

---

## Rollback Trigger Criteria

Initiate rollback evaluation immediately if **any** of the following are observed:

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Crash-free rate | < 99.0% sustained 30 min | Halt rollout → assess |
| ANR rate | > 0.47% | Halt rollout → assess |
| P0 crash in core flow | Any occurrence | Halt rollout immediately |
| Subscription/payment failure | > 1% of attempts | Halt rollout → hotfix |
| Play Store auto-halt | Google-initiated | Investigate immediately |
| Revenue drop | > 30% vs. hour baseline | Halt rollout → assess |
| On-call gut check | Engineer judgement | Escalate to Release Manager |

---

## Part 1 — Play Store Rollout Halt (< 5 minutes)

**Use when**: Issue detected, root cause unclear, need time to investigate.

### Steps

1. **Open Play Console**
   - URL: `https://play.google.com/console`
   - Navigate: App → Release → Production → Manage Rollout

2. **Halt Rollout**
   - Click "Halt rollout"
   - Confirm action
   - Record halt timestamp

3. **Notify Team**
   ```
   [INCIDENT] Production rollout halted
   Time: [TIMESTAMP]
   Trigger: [REASON]
   Crash rate: [%]
   Action: Investigating. Will update in 30 min.
   ```

4. **Preserve State**
   - Screenshot Play Console showing halt confirmation
   - Capture Sentry error snapshot
   - Note last deployed build (EAS Build ID, versionCode)

**Halted rollout does NOT remove app from existing users. New installs stop at current rollout %.**

---

## Part 2 — Full Rollback to Previous Version

**Use when**: Root cause identified as app code, no hotfix possible in < 4h.

### Prerequisites
- Previous release AAB/APK available in Play Console (v1.0.x)
- Previous release was not revoked

### Steps

1. **Confirm previous version is available**
   - Play Console → App → Release → Production → View releases
   - Identify last stable `versionCode` (e.g., `2` for v1.0.x)

2. **Promote previous release to production**
   - In Play Console, find previous release → "Re-release to production"
   - Set rollout to 100% immediately (rolling back should be instant)
   - Monitor crash rate drops within 15 minutes

3. **Verify rollback effective**
   - Sentry crash rate normalizes
   - ANR rate drops
   - PostHog shows session recovery

4. **Communicate**
   ```
   [UPDATE] Rolled back to v[PREV_VERSION]
   Time: [TIMESTAMP]
   Reason: [BRIEF EXPLANATION]
   Impact to users: [describe any data/state loss]
   Next steps: Hotfix investigation underway
   ```

5. **Post-mortem trigger**
   - File incident report within 24h
   - Root cause analysis within 48h

---

## Part 3 — EAS OTA Rollback (JavaScript Only)

**Use when**: Bug is in JS bundle only (not native code), `expo-updates` is active.

Q-Empire uses `expo-updates ~0.27.0` with channel-based deployment.

### Steps

1. **Identify last good JS bundle**
   - EAS Update dashboard → select `production` channel
   - Find previous update ID before bad deployment

2. **Re-publish previous bundle**
   ```bash
   # Re-point channel to previous update
   eas channel:edit production --head [PREVIOUS_UPDATE_ID]
   ```

3. **Force update on user devices**
   - App checks for updates on foreground (configured via `fallbackToCacheTimeout: 0`)
   - Users receive fix on next app open without re-install

4. **Verify**
   - Monitor Sentry for crash normalization (5–15 min)

**Note**: OTA rollback only works for JS changes. Native code (Kotlin/Swift/native modules) requires Play Store rollback.

---

## Part 4 — Hotfix Workflow

**Use when**: Root cause identified, fix is small, well-understood, and testable in < 4h.

### Hotfix Branch Policy

```
master (main development)
    └── release/v1.1.0 (release branch)
            └── hotfix/v1.1.1 (hotfix cut from release tag)
                    → merged back to release/v1.1.0 (tag v1.1.1)
                    → backport PR to master
```

### Step-by-Step Hotfix Process

#### Step 1 — Create Hotfix Branch
```bash
git fetch origin
git checkout -b hotfix/v1.1.1 v1.1.0   # cut from release tag
```

#### Step 2 — Apply Fix
- Make minimal change (single commit preferred)
- Add regression test covering the bug
- Update `CHANGELOG.md` under new `[1.1.1]` section

#### Step 3 — Increment Version
In `mobile/app.json`:
```json
{
  "expo": {
    "version": "1.1.1"
  }
}
```
`versionCode` will auto-increment via EAS `autoIncrement: true`.

#### Step 4 — Tests Must Pass
```bash
cd mobile
npm run typecheck   # 0 errors
npm run lint        # 0 errors
npm run test:ci     # all pass
```

#### Step 5 — PR Review
- Open PR: `hotfix/v1.1.1` → `release/v1.1.0`
- Required: 1 engineer review + approval
- Merge (no squash — preserve commit for audit)

#### Step 6 — Tag Release
```bash
git checkout release/v1.1.0
git merge hotfix/v1.1.1
git tag v1.1.1
# push via engine-tools-report_progress
```

#### Step 7 — EAS Emergency Build
```bash
eas build --platform android --profile production --non-interactive
```
- Monitor EAS build for completion
- Record EAS Build ID and SHA-256

#### Step 8 — Submit to Play Store
- Download AAB from EAS
- Play Console → Create new release → Upload AAB
- Release notes: "Critical bug fix for [issue]"
- Submit for expedited review (if applicable) or standard review

#### Step 9 — Monitor
- Watch Sentry crash rate for 2h post-hotfix release
- Confirm trigger metric returns to green threshold

#### Step 10 — Backport to Master
```bash
git checkout master
git cherry-pick [hotfix_commit_sha]
# PR: backport/v1.1.1-to-master → master
```

---

## Part 5 — Hotfix SLA Matrix

| Scenario | Detection | Response | Fix Deployed |
|----------|-----------|----------|-------------|
| P0 crash — core flow | Sentry alert | 15 min | ≤ 4 hours |
| P0 payment failure | RevenueCat/Sentry | 15 min | ≤ 4 hours |
| P1 auth broken | Sentry + support tickets | 1 hour | ≤ 8 hours |
| P1 AI requests failing | PostHog funnel drop | 1 hour | ≤ 8 hours |
| P2 degraded feature | User report / Sentry | 4 hours | Next sprint |

---

## Part 6 — Rollback Decision Tree

```
Issue Detected
      │
      ▼
Is crash-free rate < 99%? ──Yes──► Halt rollout immediately
      │                             │
      No                            ▼
      │                    Is root cause known?
      ▼                    ├── No ──► Keep halted, investigate 1h
Is it a JS-only bug?       │          ├── Found in 1h → hotfix path
      │                    │          └── Not found → rollback to v1.0.x
      Yes                  └── Yes ──► Hotfix possible in 4h?
      │                               ├── Yes → hotfix path
      ▼                               └── No → rollback to v1.0.x
OTA rollback via
expo-updates channel
```

---

## Part 7 — Communication Templates

### Incident Open
```
🚨 [INCIDENT P0] Q-Empire Production Issue
Time: [HH:MM UTC]
Symptom: [brief description]
Impact: [# users affected, % of rollout]
Action: Rollout halted. Investigating.
IC: [name]
Next update: +30 min
```

### Hotfix In Progress
```
🔧 [UPDATE] Hotfix in progress
Time: [HH:MM UTC]
Root cause: [brief]
Fix: [what's being changed]
ETA to deploy: [time]
```

### Resolved
```
✅ [RESOLVED] Q-Empire issue resolved
Time: [HH:MM UTC]
Duration: [X hours]
Resolution: [hotfix v1.1.1 deployed / rolled back to v1.0.x]
Users affected: [estimate]
Post-mortem: [link or date]
```

---

## Part 8 — Rollback Rehearsal Checklist (Pre-Launch Required)

- [ ] Log into Play Console as publisher (Michelle account)
- [ ] Navigate to Production release for a test app
- [ ] Locate "Halt rollout" button — confirm access
- [ ] Confirm previous release is visible in release history
- [ ] Confirm you can promote previous release
- [ ] Test `eas channel:edit` command with preview channel (non-prod)
- [ ] Confirm EAS emergency build completes successfully on `preview` profile
- [ ] Document time taken for each step

**Status**: 🔴 NOT REHEARSED  
**Owner**: Release Manager / Michelle  
**Target**: Complete before Production go-live

---

## Part 9 — Post-Mortem Template

**Incident**: Q-Empire v[VERSION] — [TITLE]  
**Date**: [DATE]  
**Duration**: [START] → [END] ([X hours])  
**Severity**: P[0/1/2]  
**Author**: [NAME]

### Timeline
| Time | Event |
|------|-------|
| HH:MM | Issue first detected |
| HH:MM | Rollout halted |
| HH:MM | Root cause identified |
| HH:MM | Hotfix deployed |
| HH:MM | Confirmed resolved |

### Root Cause
[Describe technical root cause]

### Impact
- Users affected: [estimate]
- Revenue impact: [$]
- Play Store rating impact: [if any]

### Contributing Factors
- [Factor 1]
- [Factor 2]

### Action Items
| Action | Owner | Due |
|--------|-------|-----|
| [Preventive measure] | [Name] | [Date] |
| [Regression test added] | [Name] | [Date] |
| [Process improvement] | [Name] | [Date] |
