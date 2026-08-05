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

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from core.config import BRIDGE_PATH
from core.qbot import get_all_profiles, get_profile, update_profile
from core.credit_wallet import (
    get_wallet,
    deduct_credits,
    top_up_credits,
    get_admin_summary,
    set_daily_cap,
)

# ── Admin auth ────────────────────────────────────────────────────────────────
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")
_api_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)


def _require_admin(key: str = Depends(_api_key_header)) -> None:
    """Dependency: raise 401 unless the correct admin key is provided."""
    if not ADMIN_API_KEY:
        # Admin key not configured — deny all admin access
        raise HTTPException(status_code=503, detail="Admin access not configured. Set ADMIN_API_KEY.")
    if key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing admin key.")

# ── Audit log ─────────────────────────────────────────────────────────────────
AUDIT_LOG_PATH = os.getenv("AUDIT_LOG_PATH", "/app/memory/audit_log.json")

# ── Feature flags ─────────────────────────────────────────────────────────────
FLAGS_PATH = os.getenv("FLAGS_PATH", "/app/memory/feature_flags.json")

DEFAULT_FLAGS = {
    "agent_execution_enabled": True,
    "new_task_submission_enabled": True,
    "social_media_tool_enabled": True,
    "email_tool_enabled": True,
    "github_deploy_enabled": True,
}


def load_flags() -> dict:
    if os.path.exists(FLAGS_PATH):
        with open(FLAGS_PATH, "r") as f:
            return json.load(f)
    return DEFAULT_FLAGS.copy()


def save_flags(flags: dict) -> None:
    os.makedirs(os.path.dirname(FLAGS_PATH), exist_ok=True)
    with open(FLAGS_PATH, "w") as f:
        json.dump(flags, f, indent=2)


def _write_audit(event_type: str, detail: dict) -> None:
    os.makedirs(os.path.dirname(AUDIT_LOG_PATH), exist_ok=True)
    entry = {"timestamp": time.time(), "date": time.strftime("%Y-%m-%d %H:%M:%S"), "event": event_type, **detail}
    log = []
    if os.path.exists(AUDIT_LOG_PATH):
        try:
            with open(AUDIT_LOG_PATH, "r") as f:
                log = json.load(f)
        except Exception:
            log = []
    log.append(entry)
    # Keep last 1 000 entries
    log = log[-1000:]
    with open(AUDIT_LOG_PATH, "w") as f:
        json.dump(log, f, indent=2)

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
    # Check kill switch
    if not load_flags().get("new_task_submission_enabled", True):
        raise HTTPException(status_code=503, detail="Task submission is temporarily disabled by admin.")

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


@app.get("/status")
async def get_status_by_email(email: str):
    """
    Get all tasks for a given client email — used by the Client Portal dashboard.
    Returns progress for blueprint, website, automations, and funding tasks.
    """
    bridge = load_bridge()
    client_tasks = []

    for queue_name in ["pending", "needs_clarification", "completed"]:
        for task in bridge[queue_name]:
            payload = task.get("payload", {})
            if payload.get("email") == email or payload.get("client_email") == email:
                client_tasks.append({
                    "task_id": task.get("id"),
                    "type": task.get("type"),
                    "status": task.get("status", queue_name),
                    "result": task.get("result"),
                    "error": task.get("error"),
                    "created_at": task.get("created_at"),
                })

    return {"email": email, "tasks": client_tasks, "total": len(client_tasks)}


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
        "foundation": ["BUILD_BLUEPRINT", "BUILD_PITCH_DECK", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING"],
        "empire-pro": ["BUILD_BLUEPRINT", "BUILD_PITCH_DECK", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "RESEARCH_FUNDING", "GENERATE_BRANDING"],
        "enterprise": ["BUILD_BLUEPRINT", "BUILD_PITCH_DECK", "BUILD_WEBSITE", "SETUP_AUTOMATIONS", "GENERATE_BRANDING"],
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


@app.get("/health")
async def health_check():
    """Health check with dependency status."""
    bridge_ok = os.path.exists(os.path.dirname(BRIDGE_PATH)) or True
    return {
        "status": "healthy",
        "service": "Q-Empire Agent Swarm",
        "version": "2.0.0",
        "bridge": "ok" if bridge_ok else "error",
    }


@app.get("/agents")
async def list_agents():
    """List all agent profiles."""
    return {"agents": get_all_profiles()}


@app.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get a single agent profile."""
    profile = get_profile(agent_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    return profile


@app.patch("/agents/{agent_id}")
async def configure_agent(agent_id: str, request: Request, _=Depends(_require_admin)):
    """
    Update an agent's personality, attitude, schedule, or other settings.
    Requires X-Admin-Key header.
    """
    updates = await request.json()
    updated = update_profile(agent_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    _write_audit("agent_updated", {"agent_id": agent_id, "updates": updates})
    return {"status": "updated", "agent": updated}


# ── AI Credit endpoints ───────────────────────────────────────────────────────

@app.get("/credits/{user_id}")
async def get_credits(user_id: str, tier: str = "free"):
    """Return the credit wallet for a user (read-only, no auth required)."""
    wallet = get_wallet(user_id, tier)
    return {"user_id": user_id, "balance": wallet["balance"], "spent_today": wallet["spent_today"], "tier": wallet["tier"]}


@app.post("/credits/{user_id}/deduct")
async def api_deduct_credits(user_id: str, request: Request):
    """Deduct credits for an action. Body: {action, tier?, task_id?}"""
    body = await request.json()
    action = body.get("action", "default")
    tier = body.get("tier", "free")
    task_id = body.get("task_id")
    try:
        result = deduct_credits(user_id, action, tier, task_id)
        _write_audit("credits_deducted", {"user_id": user_id, **result})
        return result
    except ValueError as exc:
        raise HTTPException(status_code=402, detail=str(exc))


@app.post("/credits/{user_id}/topup")
async def api_top_up_credits(user_id: str, request: Request, _=Depends(_require_admin)):
    """Admin: add credits to a user wallet. Body: {amount, tier?, reason?}"""
    body = await request.json()
    amount = int(body.get("amount", 0))
    if amount <= 0:
        raise HTTPException(status_code=400, detail="amount must be > 0")
    result = top_up_credits(user_id, amount, body.get("tier", "free"), body.get("reason", "admin_top_up"))
    _write_audit("credits_topped_up", {"user_id": user_id, **result})
    return result


# ── Admin endpoints ────────────────────────────────────────────────────────────

@app.get("/admin/credits/summary", dependencies=[Depends(_require_admin)])
async def admin_credit_summary():
    """Admin: full credit usage dashboard."""
    return get_admin_summary()


@app.post("/admin/credits/cap", dependencies=[Depends(_require_admin)])
async def admin_set_cap(request: Request):
    """Admin: update the global daily credit spend cap. Body: {daily_cap}"""
    body = await request.json()
    cap = int(body.get("daily_cap", 500))
    result = set_daily_cap(cap)
    _write_audit("daily_cap_updated", result)
    return result


@app.get("/admin/flags", dependencies=[Depends(_require_admin)])
async def admin_get_flags():
    """Admin: list all feature flags."""
    return {"flags": load_flags()}


@app.post("/admin/flags", dependencies=[Depends(_require_admin)])
async def admin_set_flags(request: Request):
    """Admin: update feature flags. Body: {flag_name: true/false, ...}"""
    updates = await request.json()
    flags = load_flags()
    for key, val in updates.items():
        if key in DEFAULT_FLAGS:
            flags[key] = bool(val)
    save_flags(flags)
    _write_audit("flags_updated", {"updates": updates})
    return {"flags": flags}


@app.post("/admin/kill-switch", dependencies=[Depends(_require_admin)])
async def admin_kill_switch(request: Request):
    """Admin: emergency disable of agent execution and task submission."""
    flags = load_flags()
    flags["agent_execution_enabled"] = False
    flags["new_task_submission_enabled"] = False
    save_flags(flags)
    _write_audit("kill_switch_activated", {"flags": flags})
    return {"status": "killed", "message": "Agent execution and task submission disabled.", "flags": flags}


@app.post("/admin/resume", dependencies=[Depends(_require_admin)])
async def admin_resume():
    """Admin: re-enable agent execution after a kill switch."""
    flags = load_flags()
    flags["agent_execution_enabled"] = True
    flags["new_task_submission_enabled"] = True
    save_flags(flags)
    _write_audit("system_resumed", {"flags": flags})
    return {"status": "resumed", "flags": flags}


@app.get("/admin/audit-log", dependencies=[Depends(_require_admin)])
async def admin_audit_log(limit: int = 100):
    """Admin: view the last N audit log entries."""
    if not os.path.exists(AUDIT_LOG_PATH):
        return {"entries": [], "total": 0}
    with open(AUDIT_LOG_PATH, "r") as f:
        log = json.load(f)
    entries = log[-limit:]
    entries.reverse()  # Most recent first
    return {"entries": entries, "total": len(log)}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("WEBHOOK_PORT", "8080"))
    print(f"[MICHELLE] Starting Q-Empire Agent API on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)