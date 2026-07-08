"""Data models for the Social Autopilot."""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional


class Platform(str, Enum):
    TWITTER = "twitter"
    INSTAGRAM = "instagram"
    LINKEDIN = "linkedin"
    FACEBOOK = "facebook"
    TIKTOK = "tiktok"

    @classmethod
    def from_str(cls, value: str) -> "Platform":
        try:
            return cls(value.strip().lower())
        except ValueError as exc:
            raise ValueError(f"Unsupported platform: {value!r}") from exc


class PostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"


@dataclass
class Post:
    """A single social-media post targeted at one platform."""

    platform: Platform
    caption: str
    hashtags: List[str] = field(default_factory=list)
    scheduled_for: Optional[str] = None  # ISO 8601 timestamp
    status: PostStatus = PostStatus.DRAFT
    media_url: Optional[str] = None
    external_id: Optional[str] = None  # id returned by the platform on publish
    error: Optional[str] = None

    def render(self) -> str:
        """Full post text as it would appear published."""
        tags = " ".join(self.hashtags)
        return f"{self.caption}\n\n{tags}".strip()

    def to_dict(self) -> dict:
        data = asdict(self)
        data["platform"] = self.platform.value
        data["status"] = self.status.value
        return data

    @classmethod
    def from_dict(cls, data: dict) -> "Post":
        return cls(
            platform=Platform.from_str(data["platform"]),
            caption=data["caption"],
            hashtags=list(data.get("hashtags", [])),
            scheduled_for=data.get("scheduled_for"),
            status=PostStatus(data.get("status", "draft")),
            media_url=data.get("media_url"),
            external_id=data.get("external_id"),
            error=data.get("error"),
        )


@dataclass
class ContentCalendar:
    """An ordered collection of scheduled posts for a campaign."""

    campaign: str
    posts: List[Post] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def add(self, post: Post) -> None:
        self.posts.append(post)

    def sorted(self) -> List[Post]:
        """Posts ordered by scheduled time (unscheduled last)."""
        return sorted(
            self.posts,
            key=lambda p: p.scheduled_for or "9999",
        )

    def due(self, now: Optional[datetime] = None) -> List[Post]:
        """Scheduled posts whose time has arrived and are not yet published."""
        now = now or datetime.utcnow()
        due_posts = []
        for post in self.posts:
            if post.status != PostStatus.SCHEDULED or not post.scheduled_for:
                continue
            if datetime.fromisoformat(post.scheduled_for) <= now:
                due_posts.append(post)
        return due_posts

    def to_dict(self) -> dict:
        return {
            "campaign": self.campaign,
            "created_at": self.created_at,
            "posts": [p.to_dict() for p in self.posts],
        }

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)

    @classmethod
    def from_dict(cls, data: dict) -> "ContentCalendar":
        cal = cls(campaign=data["campaign"], created_at=data.get("created_at", ""))
        cal.posts = [Post.from_dict(p) for p in data.get("posts", [])]
        return cal
