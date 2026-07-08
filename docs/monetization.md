# Monetization Guide — Q-Empire Mobile App

## Subscription Tiers

### Tier 1: Free (Ad-Supported)
- **Price**: $0
- **Features**:
  - 1 active project
  - 0 automations
  - 5 AI requests/day
  - Basic project dashboard
  - Community support
- **Monetization**: Banner ads + interstitial ads + rewarded video ads
- **Upgrade Prompts**: After 3 AI requests, on project completion, weekly

### Tier 2: Basic ($9.99/month)
- **Price**: $9.99/mo or $99/year (17% savings)
- **Features**:
  - 3 active projects
  - 5 AI automations
  - 50 AI requests/day
  - Email support
  - No ads
- **Target**: Side hustlers, solo founders
- **Upgrade Prompts**: When hitting project limit, when needing more automations

### Tier 3: Pro ($29.99/month)
- **Price**: $29.99/mo or $299/year (17% savings)
- **Features**:
  - 10 active projects
  - 25 AI automations
  - 200 AI requests/day
  - Priority support
  - AI market insights
  - Competitor analysis
- **Target**: Growing businesses, agencies
- **Upgrade Prompts**: When hitting automation limit, for advanced AI features

### Tier 4: Elite ($99.99/month)
- **Price**: $99.99/mo or $999/year (17% savings)
- **Features**:
  - Unlimited projects
  - Unlimited automations
  - Unlimited AI requests
  - 24/7 dedicated support
  - API access
  - White-glove onboarding
  - Custom AI model training
- **Target**: Enterprises, power users
- **Access**: Also unlockable via Master Access Code

---

## Master Access Code System

**Purpose**: Allow owner (Michelle) to instantly unlock Elite tier without payment

**Implementation**:
- Code stored in environment variable (never committed)
- Default code: `QEMP2024ELITE` (change in production)
- One-time use per device
- Logs unlock event for audit

**Security**:
- Code hashed before comparison (SHA-256)
- Rate limited to 5 attempts per hour
- Invalid attempts logged

---

## Promo Code System

### Active Codes

| Code | Discount | Effect | Expires |
|------|----------|--------|---------|
| START50 | 50% off first month | Price reduction | 2024-12-31 |
| PROBOOST | 30% off | Upgrade to Pro | 2024-09-30 |
| ELITEACCESS | 25% off | Upgrade to Elite | 2024-08-31 |
| FOUNDER2024 | 100% off | Free Basic for 1 month | 2024-07-31 |

### Implementation
- Codes stored in `authStore.ts` `applyPromoCode()`
- Case-insensitive matching
- One-time use per account
- Expiration checked against current date

---

## Referral Program

### Mechanics
- Every user gets unique referral code on registration
- Referred user gets 20% off first purchase
- Referrer gets credits based on milestone

### Milestone Rewards
| Referrals | Reward |
|-----------|--------|
| 1 | 10 AI Credits |
| 5 | 1 Month Pro Free |
| 10 | 3 Months Elite |
| 25 | Lifetime Elite Access |

### Implementation
- Code generation: `QEM` + random 6 chars
- Share via native Share API
- Tracking via PostHog events

---

## Ad Configuration

### AdMob Units (Test IDs — replace in production)

**Banner Ads** (Free tier only):
- iOS: `ca-app-pub-3940256099942544/2934735716`
- Android: `ca-app-pub-3940256099942544/6300978111`
- Placement: Bottom of Home, Dashboard, AI screens

**Interstitial Ads** (Free tier only):
- iOS: `ca-app-pub-3940256099942544/4411468910`
- Android: `ca-app-pub-3940256099942544/1033173712`
- Placement: After project creation, after 3 AI requests
- Frequency: Max 1 per 5 minutes

**Rewarded Video Ads** (Free tier):
- iOS: `ca-app-pub-3940256099942544/1712485313`
- Android: `ca-app-pub-3940256099942544/5224354917`
- Reward: +5 AI credits per video
- Placement: AI screen when limit reached

---

## RevenueCat Product IDs

| Tier | Monthly ID | Yearly ID |
|------|-----------|-----------|
| Basic | `qempire_basic_monthly` | `qempire_basic_yearly` |
| Pro | `qempire_pro_monthly` | `qempire_pro_yearly` |
| Elite | `qempire_elite_monthly` | `qempire_elite_yearly` |

---

## Analytics Events

Track these events in PostHog for monetization optimization:

```javascript
// Subscription events
'subscription_viewed' — { tier: 'pro' }
'subscription_purchased' — { tier: 'pro', price: 29.99, method: 'apple_pay' }
'subscription_cancelled' — { tier: 'pro', reason: 'too_expensive' }
'subscription_restored' — { tier: 'pro' }

// Promo events
'promo_code_applied' — { code: 'START50', success: true }
'master_code_used' — { device_id: '...' }

// Ad events
'ad_impression' — { type: 'banner', screen: 'home' }
'ad_clicked' — { type: 'interstitial' }
'rewarded_ad_completed' — { reward: '5_credits' }

// Referral events
'referral_code_shared' — { channel: 'whatsapp' }
'referral_signup' — { referrer_code: 'QEMABC123' }
'referral_milestone_reached' — { count: 5, reward: '1_month_pro' }
```

---

## Pricing Strategy Notes

- **Anchor pricing**: Elite at $99.99 makes Pro at $29.99 look affordable
- **Annual discount**: 17% savings encourages annual commitment
- **Free tier limits**: Designed to create friction at exactly the right moments
- **Ad frequency**: Not annoying, but enough to drive upgrades
- **Referral rewards**: Cost of acquisition near zero vs. paid ads
