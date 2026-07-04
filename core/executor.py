"""
Executor Agent — Executes one tool action per iteration.
Equivalent to Manus's Execution Agent.
"""
import traceback
from core.state import AgentState
from tools import execute_tool


def executor_node(state: AgentState) -> AgentState:
    """Execute the current step in the plan."""
    if state["current_step"] >= len(state["plan"]):
        return state

    current_step = state["plan"][state["current_step"]]
    current_step["status"] = "in_progress"

    state["event_stream"].append(
        f"[EXECUTOR] Starting step {current_step['step']}: {current_step['description']}"
    )

    try:
        # Execute the tool
        result = execute_tool(
            tool_name=current_step["action"],
            params=current_step.get("params", {})
        )

        # Update step with result
        current_step["status"] = "completed"
        current_step["result"] = result
        state["event_stream"].append(
            f"[EXECUTOR] Step {current_step['step']} completed: {str(result)[:200]}"
        )

    except Exception as e:
        current_step["status"] = "failed"
        current_step["result"] = f"ERROR: {str(e)}"
        state["error_count"] += 1
        state["event_stream"].append(
            f"[EXECUTOR] Step {current_step['step']} FAILED: {str(e)}"
        )
        # Log full traceback for debugging
        state["event_stream"].append(f"[EXECUTOR] Traceback: {traceback.format_exc()}")

    return state
