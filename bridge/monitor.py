"""
Bridge Monitor — Polls bridge.json for new tasks every 5 minutes.
This is the main entry point that connects the React app to the agent swarm.
"""
from __future__ import annotations

import json
import time
import os
import sys
from typing import Any

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.agent_loop import run_task
from core.config import BRIDGE_PATH, POLL_INTERVAL


def load_bridge() -> dict[str, list[dict[str, Any]]]:
    """Load the bridge file."""
    if not os.path.exists(BRIDGE_PATH):
        default: dict[str, list[dict[str, Any]]] = {
            "pending": [],
            "needs_clarification": [],
            "completed": [],
        }
        save_bridge(default)
        return default
    with open(BRIDGE_PATH, "r") as f:
        data = json.load(f)
    return {
        "pending": list(data.get("pending", [])),
        "needs_clarification": list(data.get("needs_clarification", [])),
        "completed": list(data.get("completed", [])),
    }


def save_bridge(data: dict[str, list[dict[str, Any]]]) -> None:
    """Save the bridge file atomically."""
    os.makedirs(os.path.dirname(BRIDGE_PATH), exist_ok=True)
    temp_path = BRIDGE_PATH + ".tmp"
    with open(temp_path, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(temp_path, BRIDGE_PATH)


def process_pending_tasks() -> None:
    """Check for and process pending tasks one at a time."""
    bridge = load_bridge()

    if not bridge["pending"]:
        return

    # Process the first pending task
    task: dict[str, Any] = bridge["pending"].pop(0)
    task_id = str(task.get("id", "unknown"))
    task_type = str(task.get("type", "UNKNOWN"))

    print(f"[MONITOR] Processing task: {task_id} ({task_type})")
    print(f"[MONITOR] Payload: {json.dumps(task.get('payload', {}), indent=2)[:500]}")

    try:
        result: dict[str, Any] = run_task(task)
        task["status"] = "completed"
        task["result"] = result
        bridge["completed"].append(task)
        print(f"[MONITOR] ✓ Task {task_id} completed successfully")
        print(f"[MONITOR] Deliverables: {json.dumps(result.get('deliverables', {}), indent=2)[:500]}")

    except Exception as e:
        task["status"] = "needs_clarification"
        task["error"] = str(e)
        bridge["needs_clarification"].append(task)
        print(f"[MONITOR] ✗ Task {task_id} failed: {e}")

    save_bridge(bridge)


def main() -> None:
    """Main loop — poll bridge.json at configured interval."""
    print("=" * 60)
    print("  Q-EMPIRE AGENT SWARM")
    print("  Michelle & Q-Bot — From Idea to Empire")
    print("=" * 60)
    print(f"  Bridge path: {BRIDGE_PATH}")
    print(f"  Poll interval: {POLL_INTERVAL}s")
    print("=" * 60)
    print("[MICHELLE] Started. Waiting for tasks... 🧜🏾‍♀️")

    while True:
        try:
            process_pending_tasks()
        except KeyboardInterrupt:
            print("\n[MONITOR] Shutting down gracefully...")
            break
        except Exception as e:
            print(f"[MONITOR] Unexpected error: {e}")

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
