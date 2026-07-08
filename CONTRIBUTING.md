# Contributing to Q-Empire Agent Swarm

Thank you for contributing to the Q-Empire Agent Swarm! This document covers the workflow and conventions used in this project.

## Branching Strategy

- **Default branch**: `master` (not `main`)
- Create feature branches from `master`: `git checkout -b feature/my-feature`
- Open Pull Requests targeting `master`

## Development Setup

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/qempire-agent-swarm.git
cd qempire-agent-swarm

# Python backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Frontend
cd frontend
npm install
cd ..

# Copy environment
cp .env.example .env
```

## Running Tests

```bash
# Python
pytest tests/ -v

# Frontend build check
cd frontend
npm run build
npx tsc --noEmit
```

## Code Style

- **Python**: Use `black` for formatting, `flake8` for linting, `mypy` for type checking
- **TypeScript/React**: Use `eslint` for linting
- Keep lines under 127 characters where practical
- Use descriptive variable names

## Adding a Tool

1. Create `tools/my_tool.py` with the tool function
2. Import and register in `tools/__init__.py` inside `TOOL_REGISTRY`
3. Add tests in `tests/test_my_tool.py` or `tests/test_tools.py`
4. Update `core/planner.py` planner prompt so the LLM knows the tool exists

## Adding a Skill

1. Create `skills/my_skill.json` following the existing schema
2. Map the task type in `core/planner.py` `_load_skill_plan()`
3. Add a test to verify skill loading if needed

## Commit Messages

Use descriptive commit messages:
- `feat: add new browser tool`
- `fix: handle empty payload in planner`
- `docs: update deployment guide`
- `test: add verifier retry tests`

## CI/CD

All PRs must pass:
- Python tests (pytest) on 3.11 and 3.12
- Frontend TypeScript build check
- Docker image build
- Python linting (flake8, black, mypy)

## Questions?

- Read `docs/ARCHITECTURE.md` for system design
- Read `AGENTS.md` for developer conventions
- Open an issue for bugs or feature requests
