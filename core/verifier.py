"""
Verifier Agent — Checks results and advances the plan.
Equivalent to Manus's Verification Agent.
"""
from core.state import AgentState


def verifier_node(state: AgentState) -> AgentState:
    """Verify the current step result and decide what to do next."""
    if state["current_step"] >= len(state["plan"]):
        # All steps done
        state["final_result"] = _build_final_result(state)
        state["event_stream"].append("[MICHELLE] All steps complete. Your empire is ready! 🧜🏾‍♀️")
        return state

    current_step = state["plan"][state["current_step"]]

    if current_step["status"] == "completed":
        # Success — advance to next step
        state["current_step"] += 1
        state["event_stream"].append(
            f"[MICHELLE] Step {current_step['step']} verified OK. Advancing."
        )

        # Check if that was the last step
        if state["current_step"] >= len(state["plan"]):
            state["final_result"] = _build_final_result(state)
            state["event_stream"].append("[MICHELLE] All steps complete. Your empire is ready! 🧜🏾‍♀️")

    elif current_step["status"] == "failed":
        if state["error_count"] >= state["max_errors"]:
            # Too many errors — abort with partial result
            state["final_result"] = {
                "status": "partial_failure",
                "steps_completed": state["current_step"],
                "total_steps": len(state["plan"]),
                "error": current_step.get("result", "Unknown error"),
                "deliverables": _extract_deliverables(state["plan"]),
            }
            state["event_stream"].append(
                f"[MICHELLE] Max errors ({state['max_errors']}) reached. Aborting."
            )
        else:
            # Retry the step
            current_step["status"] = "pending"
            state["event_stream"].append(
                f"[MICHELLE] Step {current_step['step']} failed. Retry {state['error_count']}/{state['max_errors']}."
            )

    return state


def _build_final_result(state: AgentState) -> dict:
    """Build the final result object from completed plan."""
    return {
        "status": "success",
        "task_id": state["task_id"],
        "task_type": state["task_type"],
        "steps_completed": len(state["plan"]),
        "deliverables": _extract_deliverables(state["plan"]),
        "event_log": state["event_stream"],
    }


def _extract_deliverables(plan: list[dict]) -> dict:
    """Extract deliverable URLs and paths from completed steps."""
    deliverables = {}
    for step in plan:
        if step.get("status") == "completed" and step.get("result"):
            result = str(step["result"])
            # Look for URLs
            if "http" in result or ".github.io" in result:
                deliverables[step["description"]] = {"type": "url", "value": result}
            # Look for file paths
            elif "/home/ubuntu/output" in result:
                deliverables[step["description"]] = {"type": "file", "value": result}
            # Look for success messages
            elif "success" in result.lower() or "complete" in result.lower():
                deliverables[step["description"]] = {"type": "status", "value": result}
    return deliverables
