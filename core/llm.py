"""Shared Claude helper — one place that talks to the Anthropic API."""
import json
from core.config import LLM_MODEL, ANTHROPIC_API_KEY, LLM_MAX_TOKENS


class LLMUnavailable(RuntimeError):
    """Raised when no API key is configured or the API call fails."""


def complete(prompt: str, max_tokens: int = LLM_MAX_TOKENS, temperature: float = 0.4) -> str:
    """Send a single prompt to Claude and return the text response.

    Prefers the langchain wrapper if installed, otherwise calls the REST API
    directly via httpx. Raises LLMUnavailable when the key is missing or the
    request fails so callers can surface an honest error (never a fake result).
    """
    if not ANTHROPIC_API_KEY:
        raise LLMUnavailable("ANTHROPIC_API_KEY is not set")

    try:
        from langchain_anthropic import ChatAnthropic

        llm = ChatAnthropic(
            model=LLM_MODEL,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=ANTHROPIC_API_KEY,
        )
        return llm.invoke(prompt).content
    except ImportError:
        pass
    except Exception as exc:  # network / auth / rate-limit
        raise LLMUnavailable(str(exc)) from exc

    try:
        import httpx

        resp = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": LLM_MODEL,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=90,
        )
        resp.raise_for_status()
        return resp.json()["content"][0]["text"]
    except Exception as exc:
        raise LLMUnavailable(str(exc)) from exc


def complete_json(prompt: str, max_tokens: int = LLM_MAX_TOKENS) -> dict:
    """Like complete(), but parse the response as JSON (tolerating code fences)."""
    text = complete(prompt, max_tokens=max_tokens, temperature=0.5).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        if "```" in text:
            block = text.split("```")[1].strip()
            if block.startswith("json"):
                block = block[4:].strip()
            return json.loads(block)
        # last resort: find the outermost JSON object
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        raise
