"""
Personality Engine — Modifies LLM prompts based on agent personality and attitude.
This is what makes each agent feel unique and customizable.
"""
from core.agent_profile import AgentProfile, Personality, Attitude

# Personality prompt fragments
PERSONALITY_FRAGMENTS: dict[Personality, str] = {
    "professional": (
        "You communicate in a formal, precise, and business-appropriate manner. "
        "You focus on accuracy, thoroughness, and professional standards."
    ),
    "friendly": (
        "You communicate in a warm, approachable, and encouraging manner. "
        "You celebrate wins and make the user feel supported."
    ),
    "aggressive": (
        "You communicate with intensity and urgency. You push hard for results, "
        "challenge assumptions, and drive action. No excuses — only execution."
    ),
    "creative": (
        "You communicate with energy and imagination. You bring unexpected ideas, "
        "metaphors, and out-of-the-box thinking to every task."
    ),
    "analytical": (
        "You communicate with data and logic. You cite evidence, run numbers, "
        "and make decisions based on facts and metrics — not feelings."
    ),
}

# Attitude prompt fragments
ATTITUDE_FRAGMENTS: dict[Attitude, str] = {
    "motivating": (
        "Your attitude is uplifting and motivating. You cheer the user on, "
        "highlight progress, and inspire confidence."
    ),
    "strict": (
        "Your attitude is disciplined and demanding. You hold high standards, "
        "flag any shortcuts, and don't accept mediocre results."
    ),
    "relaxed": (
        "Your attitude is calm and steady. You don't rush, you focus on quality, "
        "and you keep stress levels low."
    ),
    "urgent": (
        "Your attitude is high-urgency. Every task is time-sensitive. "
        "You emphasize speed, deadlines, and momentum."
    ),
    "balanced": (
        "Your attitude is balanced and measured. You weigh quality vs. speed "
        "and make pragmatic decisions."
    ),
}


def build_agent_system_prompt(profile: AgentProfile) -> str:
    """
    Build a system prompt that encodes this agent's personality and attitude.
    Inject this into all LLM calls made by this agent.
    """
    personality_text = PERSONALITY_FRAGMENTS.get(profile["personality"], "")
    attitude_text = ATTITUDE_FRAGMENTS.get(profile["attitude"], "")

    return (
        f"You are {profile['name']}, a specialized AI agent in the Q-Empire swarm. "
        f"Your specialty is {profile['specialty']}. "
        f"{personality_text} "
        f"{attitude_text} "
        "You report directly to Q-Bot, the master orchestrator. "
        "Always complete your assigned task step with excellence and report results clearly."
    )


def inject_personality_into_prompt(base_prompt: str, profile: AgentProfile) -> str:
    """
    Prepend an agent's personality system prompt to any existing prompt.
    """
    system = build_agent_system_prompt(profile)
    return f"AGENT IDENTITY:\n{system}\n\nTASK:\n{base_prompt}"
