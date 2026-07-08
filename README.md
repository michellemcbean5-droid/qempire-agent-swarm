# Q-Empire Agent Swarm

An autonomous AI agent system that builds entire businesses on autopilot. Clients pay, fill out an onboarding wizard, and the agent swarm automatically generates their website, business plan, pitch deck, automations, and funding strategy.

## Architecture

**Tri-Agent System (Manus Clone):**
- **Planner Agent** — Breaks tasks into executable steps
- **Executor Agent** — Runs tools (browser, shell, file system, AI generation)
- **Verifier Agent** — Validates results and advances the pipeline

**Tech Stack ($0/month):**
- LangGraph (agent orchestration)
- Playwright (web browsing)
- Claude API (content generation)
- Docker (sandboxed execution)
- FastAPI (webhook endpoint)
- Google Sheets (CRM/database)
- GitHub Pages (website hosting)

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/qempire-agent-swarm.git
cd qempire-agent-swarm

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# 3. Run with Docker
docker-compose up --build

# 4. Send a test task
curl -X POST http://localhost:8080/task \
  -H "Content-Type: application/json" \
  -d '{"type": "BUILD_WEBSITE", "payload": {"business_name": "TestCorp", "industry": "Technology"}}'
```

## How It Works

```
Client Pays → Onboarding Wizard → Google Sheets → bridge.json → Agent Swarm → Deliverables
```

1. Client selects a package and pays via PayPal/Stripe
2. Client fills out the Interactive Onboarding Wizard
3. Data is saved to Google Sheets CRM
4. `sheets_sync.py` writes a task to `bridge.json`
5. The Agent Swarm picks up the task and executes it
6. Deliverables are deployed (website to GitHub Pages, docs to Google Drive)
7. Client Portal shows real-time progress

## Project Structure

```
qempire-agent-swarm/
├── core/           # Agent loop (Planner, Executor, Verifier)
├── tools/          # Browser, Shell, File System, Content Gen, etc.
├── skills/         # JSON skill definitions for each task type
├── bridge/         # Task queue monitor and webhook receiver
├── memory/         # bridge.json + context files
├── templates/      # Website, document, and automation templates
├── frontend/       # React client app (checkout, onboard, portal)
├── social_autopilot/ # Social media autopilot (generate, schedule, publish)
└── tests/          # Unit tests
```

## Social Autopilot

The [`social_autopilot/`](social_autopilot/README.md) module is a standalone
engine that generates on-brand social content, schedules it across each
platform's best posting slots, and publishes it on autopilot (Twitter/X,
Instagram, LinkedIn, Facebook, TikTok).

```bash
# End-to-end demo — no API keys required (dry-run publishing)
python -m social_autopilot.cli demo
```

It uses the Claude API when `ANTHROPIC_API_KEY` is set and falls back to a
template engine otherwise, so it is fully runnable offline. See
[`social_autopilot/README.md`](social_autopilot/README.md) for details.

## Packages Supported

| Package | Price | What Gets Built |
|---------|-------|----------------|
| Foundation | $1,997 | Business plan, 3-page site, 3 automations, funding strategy |
| Empire Pro | $4,997 | 5-7 page site, 10 automations, full funding activation |
| Enterprise | $15K+ | Custom AI systems, multi-agent orchestration |
| Pay-As-You-Go | $250+ | Individual modules a la carte |

## License

Proprietary — Q-Empire Automation Division
