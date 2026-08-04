"""
Memory Store — Persists context and results across tasks so agents remember
what they have built for each client.
"""
import json
import os
import time

MEMORY_PATH = os.getenv("MEMORY_PATH", "/app/memory/task_log.jsonl")
CONTEXT_PATH = os.getenv("CONTEXT_PATH", "/app/memory/client_context.json")


def log_task_event(task_id: str, event_type: str, data: dict) -> None:
    """Append a structured event to the task log (JSONL format)."""
    os.makedirs(os.path.dirname(MEMORY_PATH), exist_ok=True)
    record = {
        "timestamp": time.time(),
        "task_id": task_id,
        "event_type": event_type,
        **data,
    }
    with open(MEMORY_PATH, "a") as f:
        f.write(json.dumps(record) + "\n")


def save_client_context(email: str, context: dict) -> None:
    """Persist business context for a client (survives across tasks)."""
    os.makedirs(os.path.dirname(CONTEXT_PATH), exist_ok=True)
    all_contexts: dict = {}
    if os.path.exists(CONTEXT_PATH):
        with open(CONTEXT_PATH, "r") as f:
            all_contexts = json.load(f)
    all_contexts[email] = {**all_contexts.get(email, {}), **context, "updated_at": time.time()}
    with open(CONTEXT_PATH, "w") as f:
        json.dump(all_contexts, f, indent=2)


def load_client_context(email: str) -> dict:
    """Load persisted business context for a client."""
    if not os.path.exists(CONTEXT_PATH):
        return {}
    with open(CONTEXT_PATH, "r") as f:
        all_contexts = json.load(f)
    return all_contexts.get(email, {})


def get_task_history(task_id: str) -> list[dict]:
    """Retrieve all logged events for a specific task."""
    if not os.path.exists(MEMORY_PATH):
        return []
    events = []
    with open(MEMORY_PATH, "r") as f:
        for line in f:
            try:
                record = json.loads(line.strip())
                if record.get("task_id") == task_id:
                    events.append(record)
            except json.JSONDecodeError:
                continue
    return events
