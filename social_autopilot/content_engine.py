"""Generates on-brand social captions and hashtags.

Uses the Claude API when an API key is present, and falls back to a
deterministic template engine so the autopilot is fully demoable offline.
"""
from __future__ import annotations

import json
import os
import re
from typing import Dict, List

from .config import (
    ANTHROPIC_API_KEY,
    DEFAULT_BRAND_VOICE,
    LLM_MODEL,
    LLM_MAX_TOKENS,
    PLATFORM_LIMITS,
)
from .models import Platform, Post


def _slugify_hashtag(text: str) -> str:
    return "#" + re.sub(r"[^A-Za-z0-9]", "", text.title())


def _truncate(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


class ContentEngine:
    """Turns a topic + brand voice into platform-ready posts."""

    def __init__(self, brand_voice: Dict | None = None):
        self.brand = {**DEFAULT_BRAND_VOICE, **(brand_voice or {})}
        self.use_llm = bool(ANTHROPIC_API_KEY)

    # -- public API -----------------------------------------------------------
    def generate(self, topic: str, platform: Platform) -> Post:
        """Generate one post for a single platform."""
        if self.use_llm:
            try:
                caption, hashtags = self._generate_llm(topic, platform)
            except Exception:
                caption, hashtags = self._generate_template(topic, platform)
        else:
            caption, hashtags = self._generate_template(topic, platform)

        limits = PLATFORM_LIMITS[platform.value]
        caption = _truncate(caption, limits["caption"])
        hashtags = hashtags[: limits["hashtags"]]
        return Post(platform=platform, caption=caption, hashtags=hashtags)

    def generate_batch(self, topics: List[str], platforms: List[Platform]) -> List[Post]:
        """Generate one post per (topic, platform) pair."""
        posts: List[Post] = []
        for topic in topics:
            for platform in platforms:
                posts.append(self.generate(topic, platform))
        return posts

    # -- template fallback ----------------------------------------------------
    def _generate_template(self, topic: str, platform: Platform) -> tuple[str, List[str]]:
        emoji = "🚀 " if self.brand.get("emoji") else ""
        tone = self.brand.get("tone", "")
        cta = self.brand.get("cta", "")

        hooks = {
            Platform.TWITTER: f"{emoji}{topic}. {cta}",
            Platform.INSTAGRAM: (
                f"{emoji}{topic}\n\n"
                f"Built for founders who move fast. {cta}"
            ),
            Platform.LINKEDIN: (
                f"{topic}\n\n"
                f"Here's why it matters for founders and small businesses: "
                f"automation compounds. Start small, scale relentlessly.\n\n{cta}"
            ),
            Platform.FACEBOOK: f"{emoji}{topic}\n\n{cta}",
            Platform.TIKTOK: f"{emoji}{topic} — {cta}",
        }
        caption = hooks.get(platform, f"{topic}. {cta}")

        base = list(self.brand.get("hashtags_base", []))
        topic_tag = _slugify_hashtag(" ".join(topic.split()[:2]))
        hashtags = base + [topic_tag]
        # de-dup while preserving order
        seen: set[str] = set()
        hashtags = [h for h in hashtags if not (h in seen or seen.add(h))]
        return caption, hashtags

    # -- LLM path -------------------------------------------------------------
    def _generate_llm(self, topic: str, platform: Platform) -> tuple[str, List[str]]:
        limits = PLATFORM_LIMITS[platform.value]
        prompt = (
            f"You are the social media voice for the brand '{self.brand['name']}'.\n"
            f"Tone: {self.brand['tone']}.\n"
            f"Write ONE {platform.value} post about: {topic}\n"
            f"Rules: caption under {limits['caption']} characters; "
            f"{'use an emoji or two' if self.brand.get('emoji') else 'no emojis'}; "
            f"suggest up to {limits['hashtags']} relevant hashtags; "
            f"end with a call to action.\n"
            'Respond with ONLY valid JSON: {"caption": "...", "hashtags": ["#..."]}'
        )
        raw = self._call_claude(prompt)
        data = json.loads(_extract_json(raw))
        return data["caption"], list(data.get("hashtags", []))

    def _call_claude(self, prompt: str) -> str:
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
                "max_tokens": LLM_MAX_TOKENS,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()["content"][0]["text"]


def _extract_json(text: str) -> str:
    """Pull the first JSON object out of a model response."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    return match.group(0) if match else text
