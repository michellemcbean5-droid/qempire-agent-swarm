"""Content generation tool using LLM (Claude API)."""
import os

try:
    from langchain_anthropic import ChatAnthropic
    from core.config import LLM_MODEL, ANTHROPIC_API_KEY

    llm = ChatAnthropic(
        model=LLM_MODEL,
        temperature=0.7,
        api_key=ANTHROPIC_API_KEY,
        max_tokens=4096,
    )
    USE_LANGCHAIN = True
except ImportError:
    USE_LANGCHAIN = False


def generate_content(prompt: str, max_tokens: int = 4096) -> str:
    """Generate text content using Claude."""
    try:
        if USE_LANGCHAIN:
            response = llm.invoke(prompt)
            return response.content
        else:
            # Fallback: direct API call
            import httpx
            api_key = os.getenv("ANTHROPIC_API_KEY", "")
            resp = httpx.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": max_tokens,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=120,
            )
            return resp.json()["content"][0]["text"]
    except Exception as e:
        return f"ERROR generating content: {str(e)}"
