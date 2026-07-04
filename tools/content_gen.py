"""Content generation tool — routes through the shared LLM helper (Kimi by default)."""
from core.llm import complete, LLMUnavailable
from core.config import LLM_MAX_TOKENS


def generate_content(prompt: str, max_tokens: int = LLM_MAX_TOKENS) -> str:
    """Generate text content via the configured model (Kimi/Moonshot, or Anthropic)."""
    try:
        return complete(prompt, max_tokens=max_tokens, temperature=0.7)
    except LLMUnavailable as e:
        return f"ERROR generating content: {e}"
    except Exception as e:  # pragma: no cover - defensive
        return f"ERROR generating content: {e}"
