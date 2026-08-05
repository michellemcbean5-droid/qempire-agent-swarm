"""
Planner Agent — Breaks tasks into executable steps.
Equivalent to Manus's Planner Module.
"""
import json
import os
from typing import Any, cast

from core.state import AgentState, PlanStep
from core.config import LLM_MODEL, ANTHROPIC_API_KEY

# Use httpx for direct API calls (works without langchain if needed)
llm: Any = None
USE_LANGCHAIN = False
try:
    from langchain_anthropic import ChatAnthropic

    if ANTHROPIC_API_KEY:
        # langchain-anthropic stubs disagree with runtime aliases; ignore call-arg noise.
        llm = ChatAnthropic(model=LLM_MODEL, temperature=0, api_key=ANTHROPIC_API_KEY)  # type: ignore[call-arg, arg-type]
        USE_LANGCHAIN = True
except Exception:
    llm = None
    USE_LANGCHAIN = False

PLANNER_PROMPT = """You are the Planner Agent for Q-Empire Automation.
You are part of Michelle's crew — Michelle is the Black Mermaid Queen of the Deep who helps people of color turn ideas into businesses, and Q-Bot is the friendly automation agent that does the technical work.
Your job is to break down a task into a step-by-step execution plan.

Task Type: {task_type}
Task Payload:
{payload}

Active Agent: {agent_name} (Specialty: {agent_specialty}, Personality: {agent_personality})

Available Tools:
- browser_navigate(url): Visit a webpage and extract content
- browser_search(query): Search the web for information
- file_write(path, content): Write content to a file
- file_read(path): Read a file's content
- shell_exec(command): Execute a shell command (inside Docker sandbox)
- generate_content(prompt): Generate text content using AI
- generate_website(config): Generate a React/Tailwind website from config
- generate_document(doc_type, data): Generate a PDF/PPTX document
- deploy_to_github(repo_name, folder): Push code to GitHub Pages
- send_email(to, subject, body): Send an email notification
- track_crm_entry(name, email, stage, company, deal_value, notes): Add/update CRM lead or client
- create_invoice(client_name, client_email, line_items, business_name, due_days): Generate invoice
- generate_social_post(business_name, topic, platform, tone, include_hashtags): Create social media post

Create a JSON plan. Each step must have:
- "step": sequential number starting from 1
- "action": the tool name to call
- "params": a dict of parameters for that tool
- "description": human-readable description of what this step does
- "status": always "pending"

Return ONLY a valid JSON array. No markdown, no explanation.
"""


def _load_skill_plan(task_type: str, payload: dict) -> list[dict] | None:
    """Try to load a pre-defined skill plan from the skills/ directory."""
    skill_map = {
        "BUILD_WEBSITE": "build_website.json",
        "BUILD_BLUEPRINT": "build_business_plan.json",
        "BUILD_PITCH_DECK": "build_pitch_deck.json",
        "SETUP_AUTOMATIONS": "setup_automations.json",
        "RESEARCH_FUNDING": "research_funding.json",
        "GENERATE_BRANDING": "generate_branding.json",
        "SETUP_CRM": "setup_crm.json",
        "CREATE_INVOICE": "create_invoice.json",
        "POST_SOCIAL_MEDIA": "post_social_media.json",
    }

    skill_file = skill_map.get(task_type)
    if not skill_file:
        return None

    candidates = [
        os.path.join("/app/skills", skill_file),
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "skills", skill_file),
    ]
    skill_path = next((path for path in candidates if os.path.exists(path)), None)
    if not skill_path:
        return None

    with open(skill_path, "r") as f:
        skill = json.load(f)

    # Interpolate payload values into the skill template
    steps = []
    for step_template in skill.get("steps", []):
        step = {
            "step": step_template["step"],
            "action": step_template["action"],
            "description": step_template["description"],
            "status": "pending",
            "result": None,
        }
        # Interpolate params
        params: dict[str, Any] = {}
        for key, raw_value in step_template.get("params_template", {}).items():
            if isinstance(raw_value, str):
                value_str = raw_value
                for pkey, pval in payload.items():
                    value_str = value_str.replace(
                        f"{{{pkey}}}",
                        str(pval) if not isinstance(pval, (list, dict)) else json.dumps(pval),
                    )
                params[key] = value_str
            elif isinstance(raw_value, dict):
                params[key] = {
                    k: str(v).format(**payload) if isinstance(v, str) else v
                    for k, v in raw_value.items()
                }
            else:
                params[key] = raw_value
        step["params"] = params
        steps.append(step)

    return steps


def _fallback_plan(task_type: str, reason: str = "Fallback generation") -> list[dict]:
    """Return a minimal static plan when LLM is unavailable."""
    return [
        {
            "step": 1,
            "action": "generate_content",
            "params": {"prompt": f"Complete this task: {task_type}"},
            "description": reason,
            "status": "pending",
            "result": None,
        }
    ]


def _generate_plan_with_llm(task_type: str, payload: dict, agent_name: str = "Q-Bot", agent_specialty: str = "general", agent_personality: str = "professional") -> list[dict]:
    """Generate a plan dynamically using the LLM."""
    # If no API key is configured, return a minimal fallback plan immediately
    if not ANTHROPIC_API_KEY:
        return _fallback_plan(task_type, "Fallback generation (no API key)")

    prompt = PLANNER_PROMPT.format(
        task_type=task_type,
        payload=json.dumps(payload, indent=2),
        agent_name=agent_name,
        agent_specialty=agent_specialty,
        agent_personality=agent_personality,
    )

    content: str
    if USE_LANGCHAIN and llm is not None:
        response = llm.invoke(prompt)
        raw = response.content
        content = raw if isinstance(raw, str) else str(raw)
    else:
        # Fallback: use httpx directly
        import httpx
        resp = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
            json={"model": LLM_MODEL, "max_tokens": 4096, "messages": [{"role": "user", "content": prompt}]},
            timeout=60,
        )
        content = resp.json()["content"][0]["text"]

    # Parse JSON from response
    try:
        plan = json.loads(content)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code block
        if "```" in content:
            json_str = content.split("```")[1].strip()
            if json_str.startswith("json"):
                json_str = json_str[4:].strip()
            plan = json.loads(json_str)
        else:
            plan = _fallback_plan(task_type)

    # Ensure all steps have required fields
    for step in plan:
        step.setdefault("status", "pending")
        step.setdefault("result", None)

    return plan


def planner_node(state: AgentState) -> AgentState:
    """Generate an execution plan for the task."""
    task_type = state["task_type"]
    payload = state["payload"]
    active_agent = state.get("active_agent") or {}

    # Try skill-based plan first (faster, no API call)
    plan = _load_skill_plan(task_type, payload)

    if plan is None:
        # Fall back to LLM-generated plan with agent personality context
        plan = _generate_plan_with_llm(
            task_type,
            payload,
            agent_name=active_agent.get("name", "Q-Bot") if isinstance(active_agent, dict) else "Q-Bot",
            agent_specialty=active_agent.get("specialty", "general") if isinstance(active_agent, dict) else "general",
            agent_personality=active_agent.get("personality", "professional") if isinstance(active_agent, dict) else "professional",
        )

    state["plan"] = cast(list[PlanStep], plan)
    state["current_step"] = 0
    state["event_stream"].append(f"[PLANNER] Generated {len(plan)}-step plan for {task_type}")

    return state
