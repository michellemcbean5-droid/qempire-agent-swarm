# Phase 8 — Monetization & Billing Engine

**Goal**: Build a robust monetization system covering subscriptions, in-app purchases, ads, and referrals.

## Tasks (15)

1. [x] Set up RevenueCat products matching all 4 package tiers
2. [x] Implement subscription gating in mobile app (feature flags based on entitlement)
3. [x] Add paywall screen with animated package comparison carousel
4. [x] Implement restore purchases flow
5. [x] Add AdMob banner ads on free-tier screens (non-intrusive placement)
6. [x] Add AdMob interstitial ads between task completions (max 1/session)
7. [x] Implement referral tracking — unique referral link generation
8. [x] Add referral commission payout tracking (credit to account balance)
9. [x] Integrate Stripe for web checkout (all 4 packages)
10. [x] Add webhook handler for Stripe subscription events (created, renewed, cancelled)
11. [x] Implement usage-based billing for PAYG tier (track tool calls per task)
12. [x] Add invoice generation for B2B enterprise clients
13. [x] Add upsell prompts when free users hit limits
14. [x] Add annual discount toggle (20% off) in paywall
15. [x] Test all payment flows in sandbox mode and document test card numbers

## Deliverables

- RevenueCat product configuration guide
- Paywall screen (mobile)
- Stripe webhook handler (backend)
- Referral system
- Usage tracking for PAYG
- Monetization test guide
