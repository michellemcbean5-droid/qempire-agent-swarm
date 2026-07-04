"""
Webhook Receiver — HTTP endpoint for receiving tasks from n8n, Google Apps Script, or the React app.
Adds tasks directly to bridge.json for immediate processing.
"""
import json
import uuid
import time
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.config import BRIDGE_PATH

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


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("WEBHOOK_PORT", "8080"))
    print(f"[MICHELLE] Starting Q-Empire Agent API on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
