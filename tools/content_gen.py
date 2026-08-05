"""Content generation tool using LLM (Claude API)."""
import os
from typing import Any

from core.config import LLM_MODEL, ANTHROPIC_API_KEY

llm: Any = None
USE_LANGCHAIN = False
try:
    from langchain_anthropic import ChatAnthropic

    if ANTHROPIC_API_KEY:
        # langchain-anthropic stubs disagree with runtime aliases; ignore call-arg noise.
        llm = ChatAnthropic(  # type: ignore[call-arg, arg-type]
            model=LLM_MODEL,
            temperature=0.7,
            api_key=ANTHROPIC_API_KEY,
            max_tokens=4096,
        )
        USE_LANGCHAIN = True
except Exception:
    llm = None
    USE_LANGCHAIN = False


def generate_content(prompt: str, max_tokens: int = 4096) -> str:
    """Generate text content using Claude."""
    try:
        if not ANTHROPIC_API_KEY:
            return f"ERROR generating content: ANTHROPIC_API_KEY is not configured"

        if USE_LANGCHAIN and llm is not None:
            response = llm.invoke(prompt)
            content = response.content
            return content if isinstance(content, str) else str(content)

        # Fallback: direct API call
        import httpx

        api_key = ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY", "")
        resp = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": LLM_MODEL,
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=120,
        )
        return resp.json()["content"][0]["text"]
    except Exception as e:
        return f"ERROR generating content: {str(e)}"
