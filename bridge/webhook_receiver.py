"""
Webhook Receiver — HTTP endpoint for receiving tasks from n8n, Google Apps Script, or the React app.
Adds tasks directly to bridge.json for immediate processing.
"""
import json
import uuid
import time
import os
import sys
import threading

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.config import BRIDGE_PATH, MAX_RETRIES

app = FastAPI(
    title="Q-Empire Agent Swarm API",
    description="Webhook endpoint for the Q-Empire autonomous agent system — guided by Michelle & Q-Bot",
    version="1.0.0",
)

# Allow CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_bridge() -> dict:
    if not os.path.exists(BRIDGE_PATH):
        return {"pending": [], "needs_clarification": [], "completed": []}
    with open(BRIDGE_PATH, "r") as f:
        return json.load(f)


def save_bridge(data: dict) -> None:
    os.makedirs(os.path.dirname(BRIDGE_PATH), exist_ok=True)
    with open(BRIDGE_PATH, "w") as f:
        json.dump(data, f, indent=2)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "online", "service": "Q-Empire Agent Swarm", "version": "1.0.0", "guides": "Michelle & Q-Bot"}


@app.post("/task")
async def create_task(request: Request):
    """Receive a new task and add it to the pending queue."""
    data = await request.json()

    task = {
        "id": f"task_{uuid.uuid4().hex[:8]}",
        "type": data.get("type", "UNKNOWN"),
        "payload": data.get("payload", {}),
        "status": "pending",
        "created_at": time.time(),
    }

    bridge = load_bridge()
    bridge["pending"].append(task)
    save_bridge(bridge)

    print(f"[MICHELLE] New task queued: {task['id']} ({task['type']})")

    return {"status": "queued", "task_id": task["id"], "position": len(bridge["pending"])}


@app.get("/task/{task_id}")
async def get_task_status(task_id: str):
    """Check the status of a specific task."""
    bridge = load_bridge()

    for queue_name in ["pending", "needs_clarification", "completed"]:
        for task in bridge[queue_name]:
            if task.get("id") == task_id:
                return {
                    "task_id": task_id,
                    "status": task.get("status", queue_name),
                    "result": task.get("result"),
                    "error": task.get("error"),
                }

    raise HTTPException(status_code=404, detail=f"Task {task_id} not found")


@app.get("/tasks")
async def list_tasks():
    """List all tasks and their statuses."""
    bridge = load_bridge()
    return {
        "pending": len(bridge["pending"]),
        "needs_clarification": len(bridge["needs_clarification"]),
        "completed": len(bridge["completed"]),
        "tasks": {
            "pending": bridge["pending"],
            "completed": bridge["completed"][-10:],  # Last 10 completed
        },
    }


@app.post("/onboard")
async def receive_onboarding(request: Request):
    """
    Receive onboarding data from the React wizard and create all required tasks.
    This is the main integration point with the frontend.
    """
    data = await request.json()
    package_id = data.get("package_id", "foundation")
    client_email = data.get("email", "")

    # Map package to task types
    package_tasks = {
        "foundation": ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING"],
        "empire-pro": ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING", "GENERATE_BRANDING"],
        "enterprise": ["BUILD_BLUEPRINT", "BUILD_WEBSITE", "SETUP_AUTOMATIONS"],
        "payg": data.get("selected_modules", []),
    }

    tasks_to_create = package_tasks.get(package_id, ["BUILD_BLUEPRINT"])
    bridge = load_bridge()
    created_tasks = []

    for task_type in tasks_to_create:
        task = {
            "id": f"task_{uuid.uuid4().hex[:8]}",
            "type": task_type,
            "payload": {**data, "client_email": client_email},
            "status": "pending",
            "created_at": time.time(),
        }
        bridge["pending"].append(task)
        created_tasks.append({"id": task["id"], "type": task_type})

    save_bridge(bridge)

    print(f"[MICHELLE] Onboarding received for {client_email} ({package_id}): {len(created_tasks)} tasks created")

    return {
        "status": "success",
        "package": package_id,
        "tasks_created": created_tasks,
        "message": f"Michelle & Q-Bot are now building your empire! {len(created_tasks)} tasks queued.",
    }


# ---------------------------------------------------------------------------
# Interactive Idea Builder — real, Claude-generated pitch
# ---------------------------------------------------------------------------

IDEA_PROMPT = """You are Q-Bot, the AI automation companion of Q-Empire, guided by \
Michelle the Mermaid Queen of the Deep. Q-Empire helps parents and single parents go \
from an idea to profit (target $10,000-$50,000/month) by building and automating a real \
business for them.

A prospective founder gave you this:
- Idea / situation: {idea}
- Their strength: {passion}
- Time available per week: {hours}
- Monthly income goal: ${goal}
- Startup budget: {budget}

Design a concrete, realistic business for THIS person. Return ONLY valid JSON (no markdown) \
with exactly these keys:
{{
  "name": "a memorable brand name",
  "tagline": "one punchy sentence",
  "model": "how it makes money",
  "audience": "who it serves",
  "offer": "the core paid offer",
  "channels": ["3 marketing channels"],
  "automations": ["4 automations that will run it"],
  "monthlyLow": <int, realistic low near ~60% of their goal>,
  "monthlyHigh": <int, realistic high near ~110% of their goal>,
  "plan": [
    {{"day": "Days 1-7", "text": "..."}},
    {{"day": "Days 8-21", "text": "..."}},
    {{"day": "Days 22-45", "text": "..."}},
    {{"day": "Days 46-90", "text": "..."}}
  ]
}}
Keep it grounded, encouraging, and specific to a busy parent. Reference their strength."""


@app.post("/idea")
async def build_idea(request: Request):
    """Generate a real business pitch from the Idea Builder answers using Claude."""
    from core.llm import complete_json, LLMUnavailable

    data = await request.json()
    prompt = IDEA_PROMPT.format(
        idea=data.get("idea", "(not specified)"),
        passion=data.get("passion", "(not specified)"),
        hours=data.get("hours", "(not specified)"),
        goal=data.get("goal", 25000),
        budget=data.get("budget", "(not specified)"),
    )

    try:
        pitch = complete_json(prompt)
    except LLMUnavailable as exc:
        raise HTTPException(status_code=503, detail=f"Q-Bot's engine is offline: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Could not generate a pitch: {exc}")

    return {"status": "success", "pitch": pitch}


# ---------------------------------------------------------------------------
# Real build runs — stream the live agent event_stream to the frontend
# ---------------------------------------------------------------------------

# In-memory registry of active/finished builds: build_id -> state dict
BUILDS: dict[str, dict] = {}
BUILDS_LOCK = threading.Lock()


def _run_build(build_id: str, task: dict) -> None:
    """Run the agent swarm for one task, capturing live events into BUILDS."""
    from core.agent_loop import agent_graph

    initial_state = {
        "task_id": task["id"],
        "task_type": task["type"],
        "payload": task.get("payload", {}),
        "plan": [],
        "current_step": 0,
        "event_stream": [f"[MICHELLE] Task received: {task['id']} ({task['type']})"],
        "final_result": None,
        "error_count": 0,
        "max_errors": MAX_RETRIES,
    }

    try:
        # stream() yields state after each node so we can surface live progress
        last_state = initial_state
        for chunk in agent_graph.stream(initial_state):
            for node_state in chunk.values():
                last_state = node_state
                with BUILDS_LOCK:
                    BUILDS[build_id]["events"] = list(node_state.get("event_stream", []))
                    BUILDS[build_id]["plan"] = node_state.get("plan", [])
        with BUILDS_LOCK:
            BUILDS[build_id]["status"] = "completed"
            BUILDS[build_id]["result"] = last_state.get("final_result")
    except Exception as exc:
        with BUILDS_LOCK:
            BUILDS[build_id]["status"] = "failed"
            BUILDS[build_id]["events"].append(f"[ENGINE] Build failed: {exc}")


@app.post("/build")
async def start_build(request: Request):
    """Kick off a real build and return a build_id the frontend can poll."""
    data = await request.json()
    build_id = f"build_{uuid.uuid4().hex[:8]}"
    task = {
        "id": build_id,
        "type": data.get("type", "BUILD_BLUEPRINT"),
        "payload": data.get("payload", data),
    }
    with BUILDS_LOCK:
        BUILDS[build_id] = {"status": "running", "events": [], "plan": [], "result": None}

    threading.Thread(target=_run_build, args=(build_id, task), daemon=True).start()
    return {"status": "running", "build_id": build_id}


@app.get("/build/{build_id}")
async def get_build(build_id: str):
    """Return the live status, events, plan and deliverables for a build."""
    with BUILDS_LOCK:
        state = BUILDS.get(build_id)
        if not state:
            raise HTTPException(status_code=404, detail=f"Build {build_id} not found")
        return {"build_id": build_id, **{k: v for k, v in state.items()}}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("WEBHOOK_PORT", "8080"))
    print(f"[MICHELLE] Starting Q-Empire Agent API on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
