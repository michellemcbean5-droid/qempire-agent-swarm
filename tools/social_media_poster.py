"""
Social Media Poster Tool — Generate and queue social media content.
Saves posts to a queue file for manual posting or API integration.
"""
import os
import json
import time

SOCIAL_QUEUE_PATH = os.getenv("SOCIAL_QUEUE_PATH", "/app/memory/social_queue.json")


def generate_social_post(
    business_name: str,
    topic: str,
    platform: str = "instagram",
    tone: str = "professional",
    include_hashtags: bool = True,
) -> str:
    """
    Generate and queue a social media post for a business.

    Args:
        business_name: The business name to feature
        topic: The topic or announcement (e.g. "grand opening", "new service launch")
        platform: Target platform (instagram, linkedin, twitter, facebook)
        tone: Post tone (professional, casual, excited, inspiring)
        include_hashtags: Whether to append relevant hashtags

    Returns:
        The generated post content + confirmation of queuing
    """
    # Build the post content based on platform constraints
    char_limits = {"twitter": 280, "instagram": 2200, "linkedin": 3000, "facebook": 63206}
    max_chars = char_limits.get(platform, 2200)

    tone_openers = {
        "professional": f"We're thrilled to announce",
        "casual": f"Hey everyone! Big news from",
        "excited": f"🚨 EXCITING NEWS! 🚨",
        "inspiring": f"Every great journey starts with one step.",
    }
    opener = tone_openers.get(tone, "Exciting news from")

    hashtags = ""
    if include_hashtags:
        tags = {
            "instagram": "#entrepreneur #blackbusiness #businessowner #startup #success #qempire",
            "linkedin": "#entrepreneurship #business #startup #innovation #growth",
            "twitter": "#startup #entrepreneur #business",
            "facebook": "#entrepreneur #businessowner #startup",
        }
        hashtags = f"\n\n{tags.get(platform, '')}"

    post_content = (
        f"{opener} {business_name}!\n\n"
        f"We're building the future of {topic}. "
        f"Powered by AI, driven by vision, and built for success. 🚀\n\n"
        f"Follow along as we turn this idea into reality.{hashtags}"
    )

    # Trim to platform limit
    if len(post_content) > max_chars:
        post_content = post_content[: max_chars - 3] + "..."

    # Queue the post
    os.makedirs(os.path.dirname(SOCIAL_QUEUE_PATH), exist_ok=True)
    queue: list[dict] = []
    if os.path.exists(SOCIAL_QUEUE_PATH):
        with open(SOCIAL_QUEUE_PATH, "r") as f:
            queue = json.load(f)

    queue.append({
        "id": f"post_{int(time.time())}",
        "platform": platform,
        "business": business_name,
        "content": post_content,
        "status": "queued",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    })

    with open(SOCIAL_QUEUE_PATH, "w") as f:
        json.dump(queue, f, indent=2)

    return f"[SOCIAL] Post queued for {platform}:\n\n{post_content}"
