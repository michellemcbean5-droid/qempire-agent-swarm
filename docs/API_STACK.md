# Q-Empire Agentic Powerhouse — Recommended API Stack

Every API worth wiring in to make Q-Bot a true agentic operator. **Must-have** = wire first.
**Nice** = add as you scale. Costs are directional; check each provider.

## 1. The brain (LLM / reasoning)
| API | Role | Priority |
|---|---|---|
| **Kimi / Moonshot** | Default paid model — cheap, strong (our margin engine) | **Must-have** |
| OpenRouter | One key → many models; instant fallback/routing | Must-have |
| Anthropic (Claude) | High-quality reasoning fallback | Nice |
| OpenAI | Broad tooling, embeddings | Nice |
| Groq | Ultra-fast cheap inference for simple steps | Nice |

## 2. Money (payments & billing)
| API | Role | Priority |
|---|---|---|
| **Stripe** | Subscriptions, credit packs, customer portal | **Must-have** |
| PayPal | Alternate checkout many customers prefer | Must-have |
| RevenueCat | Manage subscription entitlements across platforms | Nice |
| Plaid | Bank connections for funding/finance features | Nice |

## 3. Communication (reach customers)
| API | Role | Priority |
|---|---|---|
| **Twilio** | SMS + WhatsApp + voice | **Must-have** |
| **Resend or SendGrid** | Transactional + marketing email | **Must-have** |
| Postmark | High-deliverability transactional email | Nice |
| Slack | Team/VIP alerts | Nice |

## 4. CRM & pipeline
| API | Role | Priority |
|---|---|---|
| **HubSpot** | Contacts, deals, lifecycle automation | **Must-have** |
| Airtable | Lightweight project/lead DB | Must-have |
| MotherDuck / BigQuery | Analytics warehouse for scoring | Nice |

## 5. Content & media generation
| API | Role | Priority |
|---|---|---|
| **Canva** | Branded graphics | Must-have |
| ElevenLabs | Voiceovers | Nice |
| HeyGen | AI spokesperson videos (Michelle) | Nice |
| Replicate / Stability | Images & custom art | Nice |
| Magnific | Upscale/enhance | Nice |

## 6. Web presence & hosting
| API | Role | Priority |
|---|---|---|
| **Webflow or Vercel** | Build & deploy client sites | **Must-have** |
| Cloudflare | DNS, CDN, security, Pages | Must-have |
| GitHub | Code + deploy pipeline | Must-have |

## 7. Sales ops & documents
| API | Role | Priority |
|---|---|---|
| **PandaDoc or DocuSign** | Proposals, contracts, e-sign (and the NDA) | **Must-have** |
| Calendly / Cal.com | Booking | Must-have |
| JotForm / Typeform | Intake forms | Must-have |

## 8. Research, data & scraping
| API | Role | Priority |
|---|---|---|
| **Serper or Tavily** | Live web search for the agent | **Must-have** |
| Playwright | Headless browsing/automation | Must-have |
| Semrush | SEO & competitor data | Nice |
| Apify / Bright Data | Structured scraping at scale | Nice |
| Explorium / Apollo | Lead enrichment & contacts | Nice |

## 9. Social & ads
| API | Role | Priority |
|---|---|---|
| Buffer / Metricool | Schedule & publish everywhere | Must-have |
| TikTok / Meta / Google Ads | Paid traffic | Nice |

## 10. Storage, maps, analytics, auth
| API | Role | Priority |
|---|---|---|
| Dropbox / AWS S3 | Deliverable storage | Must-have |
| **Google Maps / Mapbox** | Location features (the "maps" choice) | Must-have |
| PostHog | Product analytics & usage-based churn signals | Must-have |
| **Clerk or Auth0** | Real user accounts & login | **Must-have (for launch)** |

---

## Minimum launch set (wire these first)
1. **Kimi** (brain) → already integrated.
2. **Stripe** (money) → already integrated; add your keys + price IDs.
3. **Clerk/Auth0** (accounts) → so credits/plans are per real user, not just this browser.
4. **Resend** + **Twilio** (reach).
5. **HubSpot** (pipeline), **PandaDoc** (NDA + contracts), **Calendly** (booking).
6. **Serper** + **Playwright** (the agent's eyes on the web).

With these, Q-Bot can research, build, contact, close, deliver, and bill — end to end.
