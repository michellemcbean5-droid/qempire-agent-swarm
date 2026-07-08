"""Q-Empire Social Autopilot.

Autonomous social-media engine: generates on-brand content, builds a posting
calendar, and publishes across platforms on autopilot.
"""
from .models import Post, PostStatus, Platform, ContentCalendar
from .autopilot import SocialAutopilot

__all__ = [
    "Post",
    "PostStatus",
    "Platform",
    "ContentCalendar",
    "SocialAutopilot",
]

__version__ = "0.1.0"
