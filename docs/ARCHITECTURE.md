# Q-Empire Autonomous Agent System

## Complete Manus Clone Architecture for GitHub Copilot

**Version:** 3.0 — Agent Swarm Edition  
**Author:** Q-Empire Automation Division  
**Budget:** $0/month (all free/open-source tools)

---

## What This Document Contains

This is the master architecture document for building a Manus-like autonomous AI agent that powers the Q-Empire self-service app. When a client pays and fills out the onboarding wizard, this agent system autonomously builds their entire business — website, business plan, pitch deck, automations, funding strategy — without any human intervention.

The document is structured so you can feed it directly to GitHub Copilot section by section to generate the code.

---

## Part 1: Manus Features We Are Cloning

Based on research into Manus AI's architecture [1] [2], we are replicating these core capabilities:

| Manus Feature | Our Clone Implementation | Free Tool Used |
|---------------|------------------------|----------------|
| Cloud Sandbox (Ubuntu VM) | Docker container per task | Docker (free) |
| Agent Loop (Analyze → Plan → Execute → Observe) | LangGraph state machine | LangGraph (open-source) |
| Multi-Agent (Planner + Executor + Verifier) | 3-node LangGraph graph | LangGraph (open-source) |
| Web Browser Control | Playwright (headless Chromium) | Playwright (open-source) |
| Shell/Terminal Execution | Python subprocess in Docker | Python stdlib (free) |
| File System Operations | Python os/pathlib in Docker | Python stdlib (free) |
| Code Execution (Python/Node) | Direct execution in sandbox | Docker (free) |
| Web Search | DuckDuckGo API or SearXNG | Free/self-hosted |
| Content Generation | Claude API (free tier) or Ollama local | Free tier / open-source |
| Task Planning & Decomposition | LLM-generated JSON plans | Claude free tier |
| Memory & Context Management | File-based JSON memory | Local filesystem |
| Website Building & Deployment | Vite + React generation + GitHub Pages | All free |
| Document Generation | Python (fpdf2, python-pptx) | Open-source libraries |
| Parallel Task Processing | Python asyncio + task queue | Python stdlib |
| Skills/Plugin System | JSON skill definitions in `/skills/` folder | File system |
| Communication with User | WebSocket or polling API | Free |

---

## Part 2: System Architecture Overview

The Q-Empire Agent Swarm consists of 5 layers:

**Layer 1: Client Interface** — The React app (checkout, onboarding wizard, client portal).

**Layer 2: Task Queue** — Google Sheets + `bridge.json` file bridge that queues tasks for the agent.

**Layer 3: Orchestrator** — A Python process running LangGraph that manages the agent loop.

**Layer 4: Sandbox** — A Docker container where the agent executes code, browses the web, and writes files.

**Layer 5: Delivery** — Completed assets pushed to Google Drive, GitHub Pages, and the client portal.

---

## Part 3: The Complete File Structure

```
qempire-agent-swarm/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── .env.example
├── README.md
│
├── core/
│   ├── __init__.py
│   ├── agent_loop.py          # The main LangGraph agent loop
│   ├── planner.py             # Planner agent node
│   ├── executor.py            # Executor agent node
│   ├── verifier.py            # Verifier agent node
│   ├── state.py               # Shared state schema
│   └── config.py              # Configuration and constants
│
├── tools/
│   ├── __init__.py
│   ├── browser.py             # Playwright web browsing
│   ├── shell.py               # Command execution
│   ├── file_system.py         # File read/write/edit
│   ├── search.py              # Web search (DuckDuckGo)
│   ├── code_exec.py           # Python/Node code execution
│   ├── content_gen.py         # LLM content generation
│   ├── website_builder.py     # Generate & deploy React sites
│   ├── document_gen.py        # Generate PDFs, slides, docs
│   └── email_sender.py        # Send emails via Gmail API
│
├── skills/
│   ├── build_business_plan.json
│   ├── build_pitch_deck.json
│   ├── build_website.json
│   ├── setup_automations.json
│   ├── research_funding.json
│   ├── generate_branding.json
│   └── deploy_to_github.json
│
├── memory/
│   ├── bridge.json            # Task queue (pending/completed)
│   ├── context/               # Per-task context files
│   └── knowledge/             # Persistent knowledge base
│
├── templates/
│   ├── website/               # React website templates
│   │   ├── 3-page/
│   │   ├── 5-page/
│   │   └── 7-page/
│   ├── documents/
│   │   ├── business_plan_template.md
│   │   ├── pitch_deck_template.md
│   │   └── funding_strategy_template.md
│   └── automations/
│       ├── lead_capture.json
│       ├── email_sequence.json
│       └── invoice_automation.json
│
├── bridge/
│   ├── monitor.py             # Polls bridge.json every 5 min
│   ├── sheets_sync.py         # Syncs Google Sheets ↔ bridge.json
│   └── webhook_receiver.py    # HTTP endpoint for n8n/Apps Script
│
└── tests/
    ├── test_agent_loop.py
    ├── test_tools.py
    └── test_bridge.py
```

---

## Part 4: Core Code (GitHub Copilot Ready)

### 4.1 Docker Environment

**Dockerfile:**
```dockerfile
FROM ubuntu:24.04

# System dependencies
RUN apt-get update && apt-get install -y \
    python3.11 python3-pip python3.11-venv \
    nodejs npm \
    git curl wget jq \
    chromium-browser \
    && rm -rf /var/lib/apt/lists/*

# Python environment
WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium --with-deps

# Create workspace
RUN mkdir -p /home/ubuntu/workspace /home/ubuntu/output

COPY . /app/

CMD ["python3", "bridge/monitor.py"]
```

**requirements.txt:**
```
langchain>=0.3.0
langgraph>=0.2.0
langchain-anthropic>=0.3.0
langchain-community>=0.3.0
playwright>=1.40.0
duckduckgo-search>=6.0.0
fpdf2>=2.7.0
python-pptx>=0.6.21
google-auth>=2.0.0
google-api-python-client>=2.0.0
gspread>=6.0.0
gitpython>=3.1.0
fastapi>=0.100.0
uvicorn>=0.20.0
python-dotenv>=1.0.0
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  agent:
    build: .
    container_name: qempire-agent
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GOOGLE_CREDENTIALS_PATH=/app/credentials.json
    volumes:
      - ./memory:/app/memory
      - ./output:/home/ubuntu/output
    restart: unless-stopped
    networks:
      - agent-network

  webhook:
    build: .
    container_name: qempire-webhook
    command: ["python3", "bridge/webhook_receiver.py"]
    ports:
      - "8080:8080"
    volumes:
      - ./memory:/app/memory
    restart: unless-stopped
    networks:
      - agent-network

networks:
  agent-network:
    driver: bridge
```

---

### 4.2 The Agent Loop (LangGraph)

**core/state.py:**
```python
from typing import TypedDict, Annotated, Sequence
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """Shared state for the agent swarm."""
    task_id: str
    task_type: str
    payload: dict
    plan: list[dict]          # [{step: 1, action: "...", status: "pending"}]
    current_step: int
    event_stream: list[str]   # History of actions and observations
    final_result: dict | None
    error_count: int
    max_errors: int
```

**core/agent_loop.py:**
```python
"""
Q-Empire Agent Swarm - Main Orchestrator
Clones the Manus agent loop: Analyze → Plan → Execute → Observe → Repeat
"""
from langgraph.graph import StateGraph, END
from core.state import AgentState
from core.planner import planner_node
from core.executor import executor_node
from core.verifier import verifier_node

def should_continue(state: AgentState) -> str:
    """Decide whether to continue executing or finish."""
    if state["final_result"] is not None:
        return "end"
    if state["error_count"] >= state["max_errors"]:
        return "end"
    if state["current_step"] >= len(state["plan"]):
        return "end"
    return "execute"

def build_agent_graph():
    """Build the LangGraph agent swarm."""
    graph = StateGraph(AgentState)
    
    # Add nodes (the 3 agents)
    graph.add_node("planner", planner_node)
    graph.add_node("executor", executor_node)
    graph.add_node("verifier", verifier_node)
    
    # Define edges
    graph.set_entry_point("planner")
    graph.add_edge("planner", "executor")
    graph.add_edge("executor", "verifier")
    
    # Conditional: verifier decides next step
    graph.add_conditional_edges(
        "verifier",
        should_continue,
        {
            "execute": "executor",  # Continue to next step
            "end": END              # Task complete
        }
    )
    
    return graph.compile()

# Usage
agent = build_agent_graph()

def run_task(task: dict) -> dict:
    """Execute a full task through the agent swarm."""
    initial_state = AgentState(
        task_id=task["id"],
        task_type=task["type"],
        payload=task["payload"],
        plan=[],
        current_step=0,
        event_stream=[],
        final_result=None,
        error_count=0,
        max_errors=3
    )
    
    result = agent.invoke(initial_state)
    return result["final_result"]
```

**core/planner.py:**
```python
"""
Planner Agent - Breaks tasks into executable steps.
Equivalent to Manus's Planner Module.
"""
from langchain_anthropic import ChatAnthropic
from core.state import AgentState
import json

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

PLANNER_PROMPT = """You are the Planner Agent for Q-Empire Automation.
Your job is to break down a task into a step-by-step execution plan.

Task Type: {task_type}
Task Payload: {payload}

Available Tools:
- browser_navigate(url): Visit a webpage and extract content
- browser_search(query): Search the web for information
- file_write(path, content): Write content to a file
- file_read(path): Read a file's content
- shell_exec(command): Execute a shell command
- generate_content(prompt): Generate text content using AI
- generate_website(config): Generate a React website from config
- generate_document(type, data): Generate a PDF/PPTX document
- deploy_to_github(repo_name, folder): Push code to GitHub Pages
- send_email(to, subject, body): Send an email notification

Create a JSON plan with numbered steps. Each step should have:
- step: number
- action: tool name to use
- params: parameters for the tool
- description: human-readable description
- status: "pending"

Return ONLY valid JSON array.
"""

def planner_node(state: AgentState) -> AgentState:
    """Generate an execution plan for the task."""
    prompt = PLANNER_PROMPT.format(
        task_type=state["task_type"],
        payload=json.dumps(state["payload"], indent=2)
    )
    
    response = llm.invoke(prompt)
    plan = json.loads(response.content)
    
    state["plan"] = plan
    state["event_stream"].append(f"[PLANNER] Generated {len(plan)}-step plan")
    
    return state
```

**core/executor.py:**
```python
"""
Executor Agent - Executes one tool action per iteration.
Equivalent to Manus's Execution Agent.
"""
from langchain_anthropic import ChatAnthropic
from core.state import AgentState
from tools import execute_tool
import json

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

def executor_node(state: AgentState) -> AgentState:
    """Execute the current step in the plan."""
    current_step = state["plan"][state["current_step"]]
    
    # Execute the tool
    try:
        result = execute_tool(
            tool_name=current_step["action"],
            params=current_step["params"]
        )
        
        # Update state
        current_step["status"] = "completed"
        current_step["result"] = result
        state["event_stream"].append(
            f"[EXECUTOR] Step {current_step['step']}: {current_step['description']} -> SUCCESS"
        )
        
    except Exception as e:
        current_step["status"] = "failed"
        current_step["error"] = str(e)
        state["error_count"] += 1
        state["event_stream"].append(
            f"[EXECUTOR] Step {current_step['step']}: FAILED - {str(e)}"
        )
    
    return state
```

**core/verifier.py:**
```python
"""
Verifier Agent - Checks results and advances the plan.
Equivalent to Manus's Verification Agent.
"""
from core.state import AgentState

def verifier_node(state: AgentState) -> AgentState:
    """Verify the current step and advance."""
    current_step = state["plan"][state["current_step"]]
    
    if current_step["status"] == "completed":
        # Move to next step
        state["current_step"] += 1
        state["event_stream"].append(
            f"[VERIFIER] Step {current_step['step']} verified. Moving to next."
        )
        
        # Check if all steps are done
        if state["current_step"] >= len(state["plan"]):
            state["final_result"] = {
                "status": "success",
                "steps_completed": len(state["plan"]),
                "deliverables": extract_deliverables(state["plan"])
            }
            state["event_stream"].append("[VERIFIER] All steps complete. Task finished.")
    
    elif current_step["status"] == "failed":
        if state["error_count"] >= state["max_errors"]:
            state["final_result"] = {
                "status": "partial_failure",
                "steps_completed": state["current_step"],
                "error": current_step.get("error", "Unknown error")
            }
        else:
            # Retry the step
            current_step["status"] = "pending"
            state["event_stream"].append(
                f"[VERIFIER] Step {current_step['step']} failed. Retrying..."
            )
    
    return state

def extract_deliverables(plan):
    """Extract URLs, file paths, and other deliverables from completed plan."""
    deliverables = {}
    for step in plan:
        if step.get("result") and "url" in str(step.get("result", "")):
            deliverables[step["description"]] = step["result"]
    return deliverables
```

---

### 4.3 The Tool Set

**tools/__init__.py:**
```python
"""
Q-Empire Agent Tools - The agent's "hands".
Each tool is a function that performs one action in the sandbox.
"""
from tools.browser import browser_navigate, browser_search
from tools.file_system import file_write, file_read, file_edit
from tools.shell import shell_exec
from tools.content_gen import generate_content
from tools.website_builder import generate_website
from tools.document_gen import generate_document
from tools.email_sender import send_email

TOOL_REGISTRY = {
    "browser_navigate": browser_navigate,
    "browser_search": browser_search,
    "file_write": file_write,
    "file_read": file_read,
    "file_edit": file_edit,
    "shell_exec": shell_exec,
    "generate_content": generate_content,
    "generate_website": generate_website,
    "generate_document": generate_document,
    "deploy_to_github": lambda **kwargs: shell_exec(
        f"cd {kwargs['folder']} && git init && git add . && git commit -m 'Initial' && "
        f"gh repo create {kwargs['repo_name']} --public --source=. --push"
    ),
    "send_email": send_email,
}

def execute_tool(tool_name: str, params: dict) -> str:
    """Execute a registered tool by name."""
    if tool_name not in TOOL_REGISTRY:
        raise ValueError(f"Unknown tool: {tool_name}")
    return TOOL_REGISTRY[tool_name](**params)
```

**tools/browser.py:**
```python
"""Browser tool using Playwright for web interaction."""
from playwright.sync_api import sync_playwright

def browser_navigate(url: str) -> str:
    """Navigate to a URL and return the page text content."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=30000)
        page.wait_for_load_state("networkidle")
        content = page.evaluate("document.body.innerText")
        title = page.title()
        browser.close()
        return f"Title: {title}\n\nContent:\n{content[:5000]}"

def browser_search(query: str) -> str:
    """Search the web using DuckDuckGo and return results."""
    from duckduckgo_search import DDGS
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=5):
            results.append(f"- {r['title']}: {r['body']}\n  URL: {r['href']}")
    return "\n".join(results)
```

**tools/file_system.py:**
```python
"""File system operations tool."""
import os

def file_write(path: str, content: str) -> str:
    """Write content to a file, creating directories if needed."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    return f"Written {len(content)} bytes to {path}"

def file_read(path: str) -> str:
    """Read and return file content."""
    with open(path, 'r') as f:
        return f.read()

def file_edit(path: str, find: str, replace: str) -> str:
    """Find and replace text in a file."""
    content = file_read(path)
    new_content = content.replace(find, replace)
    file_write(path, new_content)
    return f"Replaced '{find[:50]}...' with '{replace[:50]}...' in {path}"
```

**tools/shell.py:**
```python
"""Shell command execution tool (sandboxed in Docker)."""
import subprocess

def shell_exec(command: str, timeout: int = 30) -> str:
    """Execute a shell command and return output."""
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd="/home/ubuntu/workspace"
        )
        output = result.stdout if result.returncode == 0 else result.stderr
        return output[:3000]  # Limit output size
    except subprocess.TimeoutExpired:
        return "ERROR: Command timed out after 30 seconds"
    except Exception as e:
        return f"ERROR: {str(e)}"
```

**tools/content_gen.py:**
```python
"""Content generation using LLM."""
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0.7)

def generate_content(prompt: str, max_tokens: int = 4000) -> str:
    """Generate text content using Claude."""
    response = llm.invoke(prompt)
    return response.content
```

**tools/website_builder.py:**
```python
"""Website generation tool - creates React + Tailwind sites."""
import os
import json
from tools.content_gen import generate_content
from tools.file_system import file_write
from tools.shell import shell_exec

WEBSITE_PROMPT = """Generate a complete React website for:
Business: {business_name}
Industry: {industry}
Pages: {pages}
Brand Tone: {brand_tone}
Colors: {colors}

Generate the following files:
1. index.html (with Tailwind CDN)
2. One HTML section per page

The site should be modern, responsive, and professional.
Use the specified brand colors throughout.
Include a navigation bar, hero section, and footer.

Return the complete HTML code for a single-page application.
"""

def generate_website(config: dict) -> str:
    """Generate a complete website from config and save to disk."""
    prompt = WEBSITE_PROMPT.format(**config)
    html_content = generate_content(prompt, max_tokens=8000)
    
    output_dir = f"/home/ubuntu/output/websites/{config['business_name'].lower().replace(' ', '-')}"
    os.makedirs(output_dir, exist_ok=True)
    
    file_write(f"{output_dir}/index.html", html_content)
    
    # Create package.json for potential Vite build
    package_json = {
        "name": config["business_name"].lower().replace(" ", "-"),
        "version": "1.0.0",
        "scripts": {"dev": "vite", "build": "vite build"}
    }
    file_write(f"{output_dir}/package.json", json.dumps(package_json, indent=2))
    
    return f"Website generated at {output_dir}/index.html"
```

**tools/document_gen.py:**
```python
"""Document generation tool - creates PDFs and presentations."""
from fpdf import FPDF
from tools.content_gen import generate_content
import os

def generate_document(doc_type: str, data: dict) -> str:
    """Generate a PDF document (business plan, pitch deck, etc.)."""
    
    if doc_type == "business_plan":
        return _generate_business_plan(data)
    elif doc_type == "pitch_deck":
        return _generate_pitch_deck(data)
    elif doc_type == "funding_strategy":
        return _generate_funding_strategy(data)
    else:
        return f"Unknown document type: {doc_type}"

def _generate_business_plan(data: dict) -> str:
    """Generate a business plan PDF."""
    prompt = f"""Write a professional 10-page business plan for:
    Business: {data.get('business_name')}
    Industry: {data.get('industry')}
    Target Audience: {data.get('target_audience')}
    Value Proposition: {data.get('elevator_pitch')}
    
    Include sections: Executive Summary, Market Analysis, Business Model,
    Marketing Strategy, Operations Plan, Financial Projections, Funding Needs.
    """
    
    content = generate_content(prompt, max_tokens=8000)
    
    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=12)
    pdf.multi_cell(0, 10, content)
    
    output_path = f"/home/ubuntu/output/documents/{data['business_name']}_business_plan.pdf"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pdf.output(output_path)
    
    return f"Business plan generated at {output_path}"

def _generate_pitch_deck(data: dict) -> str:
    """Generate a pitch deck outline (markdown for now)."""
    prompt = f"""Create a 12-slide pitch deck outline for:
    Business: {data.get('business_name')}
    Industry: {data.get('industry')}
    Problem: What problem does this solve?
    Solution: {data.get('elevator_pitch')}
    
    Format each slide as: ## Slide N: Title\\nContent
    """
    
    content = generate_content(prompt, max_tokens=4000)
    output_path = f"/home/ubuntu/output/documents/{data['business_name']}_pitch_deck.md"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w') as f:
        f.write(content)
    
    return f"Pitch deck generated at {output_path}"

def _generate_funding_strategy(data: dict) -> str:
    """Generate a funding strategy document."""
    prompt = f"""Research and create a funding strategy for:
    Business: {data.get('business_name')}
    Industry: {data.get('industry')}
    Funding Needed: {data.get('funding_amount', '$50,000')}
    Preferred Types: {data.get('funding_types', ['grants', 'loans'])}
    
    Include: Top 10 relevant grants, 5 bank loan options, 
    3 angel investor networks, application timeline, and tips.
    """
    
    content = generate_content(prompt, max_tokens=6000)
    output_path = f"/home/ubuntu/output/documents/{data['business_name']}_funding_strategy.md"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w') as f:
        f.write(content)
    
    return f"Funding strategy generated at {output_path}"
```

---

### 4.4 The Bridge Monitor

**bridge/monitor.py:**
```python
"""
Bridge Monitor - Polls bridge.json for new tasks.
This is the entry point that connects the React app to the agent swarm.
"""
import json
import time
import os
from core.agent_loop import run_task

BRIDGE_PATH = "/app/memory/bridge.json"
POLL_INTERVAL = 300  # 5 minutes

def load_bridge():
    """Load the bridge file."""
    if not os.path.exists(BRIDGE_PATH):
        return {"pending": [], "needs_clarification": [], "completed": []}
    with open(BRIDGE_PATH, 'r') as f:
        return json.load(f)

def save_bridge(data):
    """Save the bridge file."""
    with open(BRIDGE_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def process_pending_tasks():
    """Check for and process pending tasks."""
    bridge = load_bridge()
    
    if not bridge["pending"]:
        return
    
    # Process one task at a time
    task = bridge["pending"].pop(0)
    print(f"[MONITOR] Processing task: {task['id']} ({task['type']})")
    
    try:
        result = run_task(task)
        task["status"] = "completed"
        task["result"] = result
        bridge["completed"].append(task)
        print(f"[MONITOR] Task {task['id']} completed successfully")
        
    except Exception as e:
        task["status"] = "needs_clarification"
        task["error"] = str(e)
        bridge["needs_clarification"].append(task)
        print(f"[MONITOR] Task {task['id']} needs clarification: {e}")
    
    save_bridge(bridge)

def main():
    """Main loop - poll bridge.json every 5 minutes."""
    print("[MONITOR] Q-Empire Agent Swarm started. Polling for tasks...")
    
    while True:
        try:
            process_pending_tasks()
        except Exception as e:
            print(f"[MONITOR] Error: {e}")
        
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
```

**bridge/webhook_receiver.py:**
```python
"""
Webhook Receiver - HTTP endpoint for receiving tasks from n8n/Apps Script.
Adds tasks directly to bridge.json without waiting for the poll cycle.
"""
from fastapi import FastAPI, Request
import json
import uuid
import os

app = FastAPI(title="Q-Empire Agent Webhook")
BRIDGE_PATH = "/app/memory/bridge.json"

@app.post("/task")
async def receive_task(request: Request):
    """Receive a new task and add it to the pending queue."""
    data = await request.json()
    
    task = {
        "id": f"task_{uuid.uuid4().hex[:8]}",
        "type": data.get("type", "UNKNOWN"),
        "payload": data.get("payload", {}),
        "status": "pending",
        "created_at": str(time.time())
    }
    
    # Load and update bridge
    bridge = json.load(open(BRIDGE_PATH)) if os.path.exists(BRIDGE_PATH) else {"pending": [], "needs_clarification": [], "completed": []}
    bridge["pending"].append(task)
    
    with open(BRIDGE_PATH, 'w') as f:
        json.dump(bridge, f, indent=2)
    
    return {"status": "queued", "task_id": task["id"]}

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    """Check the status of a task."""
    bridge = json.load(open(BRIDGE_PATH)) if os.path.exists(BRIDGE_PATH) else {"pending": [], "needs_clarification": [], "completed": []}
    
    for queue in ["pending", "needs_clarification", "completed"]:
        for task in bridge[queue]:
            if task["id"] == task_id:
                return {"task_id": task_id, "status": task["status"], "result": task.get("result")}
    
    return {"error": "Task not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

---

### 4.5 Skill Definitions

Skills are JSON files that tell the Planner how to handle specific task types.

**skills/build_website.json:**
```json
{
  "skill_name": "build_website",
  "description": "Generate and deploy a professional website for a client",
  "trigger_task_type": "BUILD_WEBSITE",
  "steps": [
    {
      "step": 1,
      "action": "generate_content",
      "params_template": {
        "prompt": "Write professional website copy for {business_name} in the {industry} industry. Target audience: {target_audience}. Brand tone: {brand_tone}. Include: hero headline, about section, services section, testimonials section, CTA section, and footer. Value proposition: {elevator_pitch}"
      },
      "description": "Generate website copywriting"
    },
    {
      "step": 2,
      "action": "generate_website",
      "params_template": {
        "business_name": "{business_name}",
        "industry": "{industry}",
        "pages": "{pages}",
        "brand_tone": "{brand_tone}",
        "colors": "{colors}"
      },
      "description": "Generate React website code"
    },
    {
      "step": 3,
      "action": "deploy_to_github",
      "params_template": {
        "repo_name": "{business_name_slug}-website",
        "folder": "/home/ubuntu/output/websites/{business_name_slug}"
      },
      "description": "Deploy website to GitHub Pages"
    },
    {
      "step": 4,
      "action": "send_email",
      "params_template": {
        "to": "{client_email}",
        "subject": "Your Website is LIVE! 🚀",
        "body": "Your professional website is now live at https://{github_username}.github.io/{business_name_slug}-website"
      },
      "description": "Notify client that website is live"
    }
  ]
}
```

**skills/build_business_plan.json:**
```json
{
  "skill_name": "build_business_plan",
  "description": "Generate a complete business plan and pitch deck",
  "trigger_task_type": "BUILD_BLUEPRINT",
  "steps": [
    {
      "step": 1,
      "action": "browser_search",
      "params_template": {
        "query": "{industry} market size trends 2026 competitors"
      },
      "description": "Research market and competitors"
    },
    {
      "step": 2,
      "action": "generate_document",
      "params_template": {
        "doc_type": "business_plan",
        "data": {
          "business_name": "{business_name}",
          "industry": "{industry}",
          "target_audience": "{target_audience}",
          "elevator_pitch": "{elevator_pitch}"
        }
      },
      "description": "Generate business plan PDF"
    },
    {
      "step": 3,
      "action": "generate_document",
      "params_template": {
        "doc_type": "pitch_deck",
        "data": {
          "business_name": "{business_name}",
          "industry": "{industry}",
          "elevator_pitch": "{elevator_pitch}"
        }
      },
      "description": "Generate pitch deck"
    },
    {
      "step": 4,
      "action": "send_email",
      "params_template": {
        "to": "{client_email}",
        "subject": "Your Business Blueprint is Ready! 📋",
        "body": "Your business plan and pitch deck have been generated. View them in your Client Portal dashboard."
      },
      "description": "Notify client"
    }
  ]
}
```

---

## Part 5: GitHub Copilot Master Prompts

Use these prompts in sequence to build the entire system:

### Prompt 1: Initialize the Project
```
Create a Python project called "qempire-agent-swarm" with the following structure:
- Docker-based sandbox using Ubuntu 24.04
- LangGraph for agent orchestration
- Playwright for web browsing
- FastAPI for webhook endpoint
- File-based task queue (bridge.json pattern)

The system should:
1. Poll a bridge.json file for pending tasks
2. Process each task through a Planner → Executor → Verifier pipeline
3. Execute tools (browser, shell, file write, content generation)
4. Move completed tasks to the "completed" array in bridge.json
5. Expose a /task POST endpoint for receiving new tasks via webhook

Include a Dockerfile, docker-compose.yml, requirements.txt, and all Python modules.
```

### Prompt 2: Add the Website Builder Skill
```
Add a website_builder tool to the agent swarm. When triggered with a BUILD_WEBSITE task:
1. Use Claude to generate professional website copy based on the client's business info
2. Generate a complete single-page React website using Tailwind CSS CDN
3. Save the HTML to /home/ubuntu/output/websites/{business-name}/
4. Use the GitHub CLI to create a new repo and push the code
5. Enable GitHub Pages on the repo
6. Return the live URL

The website should use a dark theme with gradient accents (similar to Q-Empire branding).
Include responsive design, a hero section, services, pricing, and contact form.
```

### Prompt 3: Add the Document Generator Skill
```
Add a document generation tool that creates:
1. Business Plans (PDF) - 10 pages with executive summary, market analysis, financials
2. Pitch Decks (Markdown/PDF) - 12 slides with problem, solution, market, team, ask
3. Funding Strategies (Markdown) - Grant research, loan options, investor networks

Each document should be generated using Claude for content, then formatted using fpdf2.
Save outputs to /home/ubuntu/output/documents/{business-name}/
```

### Prompt 4: Connect to the React App
```
Create a bridge/sheets_sync.py script that:
1. Connects to a Google Sheet using gspread (service account auth)
2. Reads new rows from the "Onboarding" sheet (where status = "QUEUED")
3. Converts each row into a task object and writes it to bridge.json pending array
4. After the agent completes the task, updates the Google Sheet row with:
   - Status: "COMPLETED"
   - Deliverable URLs (website, docs)
   - Completion timestamp
5. Runs on a 5-minute polling loop

This connects the React onboarding form → Google Sheets → Agent Swarm → Client Portal.
```

---

## Part 6: How It All Connects

```
CLIENT JOURNEY:
═══════════════

[React App: qempireai.com]
         │
         ▼
[Select Package & Pay]  ──→  PayPal/Stripe webhook
         │                         │
         ▼                         ▼
[Onboarding Wizard]  ──→  [Google Sheets CRM]
                                   │
                                   ▼
                          [sheets_sync.py]
                                   │
                                   ▼
                          [bridge.json: PENDING]
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │   Q-EMPIRE AGENT SWARM       │
                    │                              │
                    │  [Planner] → [Executor]      │
                    │       ↑          │           │
                    │       └── [Verifier]         │
                    │                              │
                    │  Tools:                      │
                    │  • Browser (Playwright)      │
                    │  • Shell (subprocess)        │
                    │  • File System (os)          │
                    │  • Content Gen (Claude)      │
                    │  • Website Builder           │
                    │  • Document Generator        │
                    │  • Email Sender              │
                    │  • GitHub Deployer           │
                    └──────────────────────────────┘
                                   │
                                   ▼
                          [bridge.json: COMPLETED]
                                   │
                                   ▼
                          [sheets_sync.py updates Sheet]
                                   │
                                   ▼
                    [Client Portal shows progress + deliverables]
                                   │
                                   ▼
                    [Client receives email: "Your Empire is Built!"]
```

---

## Part 7: Deployment (Free)

| Component | Where to Host | Cost |
|-----------|--------------|------|
| React App (frontend) | Cloudflare Pages | $0 |
| Agent Swarm (Docker) | Railway free tier OR old laptop running Docker | $0 |
| Webhook Endpoint | Railway free tier (or same machine) | $0 |
| Google Sheets CRM | Google Workspace (free) | $0 |
| Client Websites | GitHub Pages (unlimited) | $0 |
| LLM (Claude) | Anthropic free tier (limited) OR Ollama local | $0 |
| Email | Gmail via Apps Script | $0 |

**For production scale:** When you get paying clients, upgrade Claude to the paid API ($3/M input tokens) and move Docker to a $5/mo VPS (Hetzner, DigitalOcean). Total cost at scale: ~$10/month.

---

## References

[1]: https://arxiv.org/html/2505.02024v2 "From Mind to Machine: The Rise of Manus AI as a Fully Autonomous Digital Agent"

[2]: https://gist.github.com/renschni/4fbc70b31bad8dd57f3370239dccd58f "In-depth technical investigation into the Manus AI agent"
