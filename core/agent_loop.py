"""
Q-Empire Agent Swarm — Main Orchestrator
Implements the Manus agent loop: Analyze → Plan → Execute → Observe → Repeat

Uses LangGraph for state machine orchestration with 3 agent nodes.
"""
from langgraph.graph import StateGraph, END
from core.state import AgentState
from core.planner import planner_node
from core.executor import executor_node
from core.verifier import verifier_node
from core.config import MAX_RETRIES


def should_continue(state: AgentState) -> str:
    """Routing function: decide whether to continue or finish."""
    # If we have a final result, we're done
    if state["final_result"] is not None:
        return "end"
    # If we've exceeded max errors, we're done
    if state["error_count"] >= state["max_errors"]:
        return "end"
    # If all steps are completed, we're done
    if state["current_step"] >= len(state["plan"]):
        return "end"
    # Otherwise, continue executing
    return "execute"


def build_agent_graph():
    """Build and compile the LangGraph agent swarm."""
    graph = StateGraph(AgentState)

    # Add the 3 agent nodes
    graph.add_node("planner", planner_node)
    graph.add_node("executor", executor_node)
    graph.add_node("verifier", verifier_node)

    # Define the flow
    graph.set_entry_point("planner")
    graph.add_edge("planner", "executor")
    graph.add_edge("executor", "verifier")

    # Conditional routing after verification
    graph.add_conditional_edges(
        "verifier",
        should_continue,
        {
            "execute": "executor",  # Loop back for next step
            "end": END,             # Task complete
        },
    )

    return graph.compile()


# Compile the graph once at module level
agent_graph = build_agent_graph()


def run_task(task: dict) -> dict:
    """
    Execute a full task through the agent swarm.

    Args:
        task: Dict with keys: id, type, payload

    Returns:
        Dict with final result including deliverables
    """
    initial_state: AgentState = {
        "task_id": task["id"],
        "task_type": task["type"],
        "payload": task.get("payload", {}),
        "plan": [],
        "current_step": 0,
        "event_stream": [f"[MICHELLE] Task received: {task['id']} ({task['type']}) — let's build your empire! 🧜🏾‍♀️"],
        "final_result": None,
        "error_count": 0,
        "max_errors": MAX_RETRIES,
    }

    # Run the graph
    final_state = agent_graph.invoke(initial_state)

    return final_state.get("final_result", {"status": "error", "message": "No result produced"})
