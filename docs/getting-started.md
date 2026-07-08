# Getting Started with Q-Empire Agent Swarm

This guide walks you through setting up the project locally for development and testing.

## Prerequisites

- Python 3.11+
- Node.js 20+ and npm
- Docker and Docker Compose (optional but recommended)
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/qempire-agent-swarm.git
cd qempire-agent-swarm
```

## 2. Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env with your actual API keys and credentials
```

Required variables:
- `ANTHROPIC_API_KEY` — for LLM-powered planning and content generation
- `GITHUB_TOKEN` + `GITHUB_USERNAME` — for deploying client websites to GitHub Pages
- `GOOGLE_SHEET_ID` + `GOOGLE_CREDENTIALS_PATH` — for the CRM bridge (optional for local dev)
- `GMAIL_ADDRESS` + `GMAIL_APP_PASSWORD` — for client email notifications (optional)

## 3. Python Backend Setup

### Option A: Virtual Environment (Recommended for Development)

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Option B: System Python (for Docker builds)

```bash
pip install -r requirements.txt
```

## 4. Frontend Setup

```bash
cd frontend
npm install
```

## 5. Running the Application

### Docker (Full Stack)

```bash
docker compose up --build
```

This starts:
- **Agent monitor** — polls `bridge.json` for tasks
- **Webhook API** — available at `http://localhost:8080`

### Manual (Development Mode)

Terminal 1 — Start the webhook receiver:
```bash
python bridge/webhook_receiver.py
```

Terminal 2 — Start the bridge monitor (optional, if you want background polling):
```bash
python bridge/monitor.py
```

Terminal 3 — Start the frontend dev server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default).

## 6. Sending a Test Task

```bash
curl -X POST http://localhost:8080/task \
  -H "Content-Type: application/json" \
  -d '{"type": "BUILD_WEBSITE", "payload": {"business_name": "TestCorp", "industry": "Technology"}}'
```

Or test the onboarding endpoint:
```bash
curl -X POST http://localhost:8080/onboard \
  -H "Content-Type: application/json" \
  -d '{"package_id": "foundation", "email": "test@example.com", "business_name": "TestCorp"}'
```

## 7. Running Tests

### Python Tests

```bash
pytest tests/ -v
```

With coverage:
```bash
pytest tests/ -v --cov=core --cov=bridge --cov=tools --cov-report=term-missing
```

### Frontend Tests

```bash
cd frontend
npm run build
npx tsc --noEmit
```

## 8. Code Quality

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

## 9. Project Structure Cheat Sheet

| Directory | What Lives Here |
|-----------|-----------------|
| `core/` | LangGraph agent nodes (planner, executor, verifier) |
| `tools/` | Sandbox tools (browser, shell, file system, content gen, website builder) |
| `bridge/` | Task queue monitor (`monitor.py`) + FastAPI webhook (`webhook_receiver.py`) |
| `frontend/` | React/Vite client app |
| `skills/` | JSON skill definitions for each task type |
| `memory/` | Runtime state (`bridge.json`) |
| `tests/` | Unit tests |
| `docs/` | Architecture docs, guides, Copilot prompts |

## Troubleshooting

- **Playwright browser not found**: Run `playwright install chromium --with-deps`
- **Google auth errors**: Ensure `credentials.json` is in the correct path and `.env` points to it
- **Port 8080 in use**: Change `WEBHOOK_PORT` in `.env` and update `docker-compose.yml` accordingly
- **LangGraph import errors**: Ensure `langgraph>=0.2.0` is installed

## Next Steps

- Read `docs/ARCHITECTURE.md` for the full system design
- Read `docs/DEPLOYMENT.md` for production deployment instructions
- Read `AGENTS.md` for contributor/developer conventions
