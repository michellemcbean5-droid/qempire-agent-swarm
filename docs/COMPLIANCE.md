# Q-Empire — Legal & Compliance Checklist

**Version**: 1.0  
**Date**: 2026-08-04

---

## App Store Compliance

### Google Play Store
- [ ] Privacy Policy URL (required — must be hosted publicly)
- [ ] Data Safety form completed (what data is collected, shared, encrypted)
- [ ] Target age group declared (13+ / 18+)
- [ ] Content rating questionnaire completed
- [ ] App permissions justified (notifications, camera if used)
- [ ] No deceptive behavior, manipulative UX, or fake reviews
- [ ] Subscription pricing clearly disclosed in store listing
- [ ] Auto-renewal terms shown to user before purchase

### Apple App Store (future)
- [ ] Privacy Nutrition Labels completed
- [ ] App Review Guidelines compliance
- [ ] In-App Purchase review approved

---

## Privacy & Data

- [ ] Privacy Policy published at public URL (e.g., `/privacy`)
- [ ] Terms of Service published at public URL (e.g., `/terms`)
- [ ] GDPR compliance — right to erasure, data portability (EU users)
- [ ] CCPA compliance — California residents opt-out of data sale
- [ ] Data stored securely (no plaintext API keys in client apps)
- [ ] User data encrypted at rest and in transit (HTTPS/TLS)
- [ ] Session tokens expire appropriately
- [ ] No PII logged to third-party analytics without consent

---

## Financial / Payment Compliance

- [ ] Stripe / RevenueCat Terms of Service accepted
- [ ] Subscription refund policy documented
- [ ] Proper tax collection for US states (Stripe Tax)
- [ ] Business entity formed (LLC recommended)
- [ ] Bank account linked to business entity
- [ ] EIN obtained from IRS

---

## AI / Content Compliance

- [ ] Anthropic API Terms of Service — no prohibited use cases
- [ ] AI-generated content disclosed to end users where required
- [ ] No generation of CSAM or illegal content (technical + policy safeguards)
- [ ] User content moderation policy established
- [ ] Anthropic usage policy for commercial products accepted

---

## Intellectual Property

- [ ] Trademark search for "Q-Empire" and "Q-Bot"
- [ ] All open-source licenses acknowledged (MIT, Apache 2.0 dependencies)
- [ ] Original code — no GPL-licensed code in proprietary product without compliance
- [ ] Logo and brand assets — original or licensed

---

## Security

- [ ] No secrets in git history (run `git secrets` or `trufflehog`)
- [ ] `.env` files excluded from version control
- [ ] API keys rotated before public launch
- [ ] Penetration test or security audit before enterprise sales
- [ ] OWASP Top 10 checked for web and API

---

## Recommended Resources

- Google Play Policy Center: https://play.google.com/about/developer-content-policy/
- Privacy Policy generator: https://www.privacypolicies.com/
- Stripe Tax: https://stripe.com/tax
- GDPR checklist: https://gdpr.eu/checklist/
