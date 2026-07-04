# Q-Empire — Master Overview

*The single source of truth. Everything scattered across the playbooks, blueprints,
and activation notes, pulled together in one place.*

---

## The Mission

**Help parents and single parents go from an idea to profit.**

A busy parent has a spark but no time. Q-Empire shapes that spark into a real business,
pitches it, builds it from the ground up, and automates everything — so it earns
**$10K–$50K/month** while they raise their family.

The journey is four steps:

1. **Idea Builder** — an interactive chat with Q-Bot turns a skill + some free time into a concrete business idea.
2. **Pitch** — Q-Bot returns a named business, model, audience, offer, revenue projection, and a 90-day plan.
3. **Build** — the swarm builds the brand, website, and assets from the ground up.
4. **Automate** — automations run acquisition, sales, delivery, and retention 24/7.

---

## The Brand

- **Michelle** — the Black Mermaid Queen of the Deep. *Queen of the Deep · Architect of Tomorrows.* A symbol of creativity, resilience, and transformation.
- **Q-Bot** — her crowned, bioluminescent AI companion. *Your AI automation companion.* Friendly, tireless, does the tech so founders keep the vision.
- **World** — deep-ocean / bioluminescent: midnight navy, gold, neon cyan, purple, and magenta; coral reefs and jellyfish light.
- **Voice** — warm, empowering, no jargon. Every client-facing piece features Michelle or Q-Bot and the brand colors.

---

## Two Ways to Build

Customers choose how hands-on they want to be.

### 1. Done-For-You (the swarm builds it)

Pay once; the 50-agent swarm researches, designs, writes, deploys, and funds the business.

| Package | Price | What gets built |
|---|---|---|
| Foundation | $1,997 | Business plan & pitch deck, 3-page site, 3 automations, funding strategy |
| Empire Builder Pro | $4,997 | 5–7 page site + app plan, 10 automations, full funding activation |
| Enterprise AI | $15K+ | Custom AI systems, 50-agent orchestration, integrations, retainer |
| Pay-As-You-Go | $250+/module | Individual modules à la carte |

Add-ons: **Fund First** (small deposit, balance due 14 days after funding) · **Retainer** ($1,500/mo).

### 2. Do-It-Yourself (drive Q-Bot yourself)

For clients who'd rather build their own automations. Same Q-Bot workspace, simple monthly
plan. This app is the **self-serve extension of qempireai.com**. Pricing mirrors the leading
AI-agent tool's structure at **30% cheaper** across every tier.

| Plan | Price | vs. market | For |
|---|---|---|---|
| Tide Pool | $0 / forever | — | Kicking the tires · 1 automation |
| Current | $14 / mo | $20 → 30% off | Parents building on the side · up to 10 automations |
| Reef | $28 / mo | $40 → 30% off | Deeper research, sites & slides |
| Deep Blue | $140 / mo | $200 → save $60 | Power users · many automations at scale |

---

## The 50-Agent War Machine

Five divisions. Every agent has a job, a connector, and a schedule.

- **Division 1 — Acquisition (1–10):** find leads, steal competitor clients, post, run ads, dominate SEO, qualify and score.
- **Division 2 — Sales & Closing (11–20):** book calls, draft proposals, crush objections, close contracts, collect payment.
- **Division 3 — Delivery (21–30):** onboard, build blueprints, ship websites, wire automations, find grants, QA, deliver.
- **Division 4 — Upsell & Retention (31–40):** upsell, pitch retainers, referrals, case studies, reviews, prevent churn.
- **Division 5 — HR & Payroll (41–50):** recruit, screen, interview, train, route leads, monitor, pay commissions.

*(Full agent-by-agent list lives in `docs/ARCHITECTURE.md` and the source data at
`frontend/src/data/swarm.ts`.)*

---

## Architecture (Triad)

- **The Brain — Kimi:** deep research, long-form content, business plans, pitch decks, grant writing.
- **The Boss — Claude:** logic routing, agent supervision, QA, code generation, objection handling.
- **The Hands — the executor:** takes orders and uses connectors to act in the real world.

The system runs on a persistent loop: every few minutes it checks the connectors, and when
a trigger fires (new lead, payment, form submit) it generates the response and pushes it to
the right output connector — 24/7, no manual clicks.

**Connectors (30):** Airtable, Buffer, Calendly, Canva, Cloudflare, Dropbox, Explorium,
GitHub, HeyGen, HubSpot, Hugging Face, Jotform, Magnific, Make, Metricool, MotherDuck,
Notion, OpenRouter, PandaDoc, Parallel, PayPal, Playwright, RevenueCat, Semrush, Serena,
Stripe, TikTok Ads, Twilio, Webflow.

---

## The Money Math ($50K/month)

$50,000 ÷ $2,500 average order = **20 clients/month.** Daily targets, all automated:

- 2,000 outreach messages/day
- 20 leads/day → 5 calls booked/day → 1 deal closed/day
- ~$2,500/day revenue

Commission: 10% of deal value (paid 30 days after close; 14 days for PAYG).

---

## The Frontend App

| Route | Purpose |
|---|---|
| `/` | Home — mission, prompt entry, the swarm, pricing (both modes), brand story |
| `/idea` | Interactive Idea Builder → generated pitch + 90-day plan |
| `/command` | "Q-Bot's Computer" — the live agent workspace watching the swarm build |
| `/checkout/:packageId` | Package confirmation + payment |
| `/onboard` | Multi-step onboarding wizard |
| `/client-portal` | Delivery dashboard — progress, deliverables, activity |

Design system and shared data:
- `frontend/src/index.css` — the underwater/bioluminescent theme tokens and utilities.
- `frontend/src/data/swarm.ts` — divisions, agents, connectors, packages, DIY plans.
- `frontend/src/components/QBot.tsx` — the Q-Bot mascot (self-contained SVG).
