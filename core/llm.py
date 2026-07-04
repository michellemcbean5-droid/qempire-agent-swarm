"""Shared LLM helper — one place that talks to a model provider.

Defaults to Kimi / Moonshot (OpenAI-compatible) when a Kimi key is set — this is
the low-cost model for paid users. Falls back to Anthropic if only that is set.
Raises LLMUnavailable (never fakes a result) so callers can surface honest errors.
"""
import json
import math
from core.config import (
    LLM_MODEL, ANTHROPIC_API_KEY, LLM_MAX_TOKENS,
    KIMI_API_KEY, KIMI_BASE_URL, KIMI_MODEL, TOKENS_PER_CREDIT,
)


class LLMUnavailable(RuntimeError):
    """Raised when no provider key is configured or the API call fails."""


def _kimi(prompt: str, max_tokens: int, temperature: float, api_key: str) -> tuple[str, int]:
    """Call Kimi/Moonshot (OpenAI-compatible). Returns (text, total_tokens)."""
    import httpx

    resp = httpx.post(
        f"{KIMI_BASE_URL.rstrip('/')}/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": KIMI_MODEL,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    text = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})
    total = int(usage.get("total_tokens") or 0)
    return text, total


def _anthropic(prompt: str, max_tokens: int, temperature: float, api_key: str) -> tuple[str, int]:
    import httpx

    resp = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={
            "model": LLM_MODEL,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    text = data["content"][0]["text"]
    usage = data.get("usage", {})
    total = int((usage.get("input_tokens") or 0) + (usage.get("output_tokens") or 0))
    return text, total


def complete_metered(prompt: str, max_tokens: int = LLM_MAX_TOKENS, temperature: float = 0.4,
                     api_key: str | None = None) -> tuple[str, int]:
    """Return (text, credits_charged). Kimi first, then Anthropic. Credits are
    metered from real token usage so margin holds on every call."""
    kimi_key = api_key or KIMI_API_KEY
    try:
        if kimi_key:
            text, tokens = _kimi(prompt, max_tokens, temperature, kimi_key)
        elif ANTHROPIC_API_KEY:
            text, tokens = _anthropic(prompt, max_tokens, temperature, ANTHROPIC_API_KEY)
        else:
            raise LLMUnavailable("No model key set (KIMI_API_KEY or ANTHROPIC_API_KEY)")
    except LLMUnavailable:
        raise
    except Exception as exc:
        raise LLMUnavailable(str(exc)) from exc

    credits = max(1, math.ceil((tokens or max_tokens) / TOKENS_PER_CREDIT))
    return text, credits


def complete(prompt: str, max_tokens: int = LLM_MAX_TOKENS, temperature: float = 0.4,
             api_key: str | None = None) -> str:
    """Text-only convenience wrapper."""
    text, _ = complete_metered(prompt, max_tokens=max_tokens, temperature=temperature, api_key=api_key)
    return text


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
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        raise
