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
docker compose up --build

# 4. Send a test task
curl -X POST http://localhost:8080/task \
  -H "Content-Type: application/json" \
  -d '{"type": "BUILD_WEBSITE", "payload": {"business_name": "TestCorp", "industry": "Technology"}}'
```

## Installation

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (recommended)

### Python Backend
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Frontend
```bash
cd frontend
npm install
```

## Running Locally

### Docker (Full Stack)
```bash
docker compose up --build
```

### Manual (Development Mode)

**Terminal 1** — Webhook API:
```bash
python bridge/webhook_receiver.py
```

**Terminal 2** — Bridge monitor (background polling):
```bash
python bridge/monitor.py
```

**Terminal 3** — Frontend dev server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:8080`.

## Testing

### Python Tests
```bash
pytest tests/ -v
```

With coverage:
```bash
pytest tests/ -v --cov=core --cov=bridge --cov=tools
```

### Frontend Build Check
```bash
cd frontend
npm run build
npx tsc --noEmit
```

## Linting / Formatting

### Python
```bash
black core/ bridge/ tools/ tests/
flake8 core/ bridge/ tools/ tests/
mypy core/ bridge/ tools/ --ignore-missing-imports
isort core/ bridge/ tools/ tests/
```

### Frontend
```bash
cd frontend
npx eslint src/ --ext .ts,.tsx
```

## Deployment

See `docs/deployment.md` for full production deployment options including:
- Docker Compose on a VPS
- AWS / GCP / Azure
- Kubernetes
- SSL/HTTPS setup with Caddy or Nginx

Quick production Docker command:
```bash
docker compose up --build -d
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
├── tests/          # Unit tests (pytest)
├── docs/           # Architecture, deployment, getting-started guides
├── .github/workflows/  # CI/CD (Python + Node.js + Docker)
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## Packages Supported

| Package | Price | What Gets Built |
|---------|-------|----------------|
| Foundation | $1,997 | Business plan, 3-page site, 3 automations, funding strategy |
| Empire Pro | $4,997 | 5-7 page site, 10 automations, full funding activation |
| Enterprise | $15K+ | Custom AI systems, multi-agent orchestration |
| Pay-As-You-Go | $250+ | Individual modules a la carte |

## Documentation

- `docs/ARCHITECTURE.md` — Full system design and Copilot-ready code specs
- `docs/GETTING_STARTED.md` — Local development setup and troubleshooting
- `docs/DEPLOYMENT.md` — Production deployment guide
- `docs/COPILOT_PROMPTS.md` — Prompts for GitHub Copilot code generation
- `docs/SELF_SERVICE_APP.md` — Frontend and self-service flow design
- `AGENTS.md` — Developer/contributor conventions and architecture cheat sheet

## Contributing

1. Fork the repository (default branch is `master`)
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Install dev dependencies: `pip install -r requirements-dev.txt`
4. Run tests: `pytest tests/ -v`
5. Ensure code passes linting: `black`, `flake8`, `mypy`
6. Open a Pull Request targeting `master`

## CI/CD

GitHub Actions runs on every push to `master`:
- Python tests (3.11, 3.12) + linting (`flake8`, `black`, `mypy`)
- Node.js build (20, 22) + TypeScript compilation
- Docker image build + Docker Compose validation

## License

Proprietary — Q-Empire Automation Division
