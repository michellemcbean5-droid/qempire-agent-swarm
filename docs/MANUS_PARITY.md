# Feature Parity Checklist (Manus-class functionality)

Every core ability of a general AI agent platform, mapped to Q-Empire — and where we go
**beyond** it. Status: ✅ done · 🟡 partial · ⏳ planned.

| Ability | Q-Empire | Status |
|---|---|---|
| Chat-first task entry | Prompt bar → Idea Builder / Command | ✅ |
| Agent "computer" workspace (live) | `/command` streams the real plan + event log | ✅ |
| Step-by-step plan, visible | Left plan checklist, updates live | ✅ |
| Real tool execution | LangGraph executor runs tools (content, docs, deploy…) | ✅ |
| File/deliverable output | Files tab + Client Portal | 🟡 (surfaced; expand previews) |
| Web browsing | Playwright tool wired | 🟡 (add live search API) |
| Website generation & deploy | Website build task | 🟡 (wire Webflow/Vercel key) |
| Credits + daily refill | 500/day + plan credits, metered to tokens | ✅ |
| Multiple model "versions" | Q-Bot Lite / Standard / Pro | ✅ |
| Bring-your-own-API key | Account page (Kimi/OpenAI/Anthropic) | ✅ |
| Connector marketplace | 224 connectors + Maps + search/filter | ✅ (Manus ~parity+) |
| Scheduled / recurring tasks | Backend monitor loop + cron design | 🟡 (expose in UI) |
| Multi-agent orchestration | 50-agent swarm across 5 divisions | ✅ (beyond Manus) |
| Task history / sessions | ⏳ sidebar of past runs | ⏳ |
| Billing & subscriptions | Stripe checkout + credit packs | ✅ (add keys) |
| Real accounts/login | ⏳ Clerk/Auth0 | ⏳ |
| Programmable assistant | Side Q-Bot, name/tone/focus configurable | ✅ (beyond Manus) |

## Where we're different from Manus (on purpose)
- **A proven step-by-step system to $1M** — the Millionaire Formula + Path-to-a-Million
  simulator. Manus is a general tool; we're an outcome path for parents & the self-employed.
- **Done-for-you swarm** (50 agents) *and* DIY — Manus is DIY only.
- **Branded companion** (Michelle + Q-Bot) with a programmable side assistant on every page.
- **Priced ~30% below** with a guaranteed ≥45% markup on our Kimi cost.

## To reach full parity (short list)
1. Real accounts (Clerk/Auth0) so credits/plans/history are per-user server-side.
2. Task-history sidebar in `/command`.
3. Live web search API (Serper/Tavily) for the agent.
4. Surface scheduled tasks in the UI.
5. Richer file previews (docs, sites) in the Files tab.
