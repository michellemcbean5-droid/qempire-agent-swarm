"""Platform publishers.

Each adapter knows how to publish a :class:`Post` to one network. In DRY_RUN
mode (the default) publishing is simulated and no external API is called, which
keeps the autopilot safe to run without credentials. Real adapters can be
implemented by overriding ``_publish_live``.
"""
from __future__ import annotations

import uuid
from typing import Dict

from .config import DRY_RUN
from .models import Platform, Post, PostStatus


class PublishResult:
    def __init__(self, ok: bool, external_id: str | None = None, error: str | None = None):
        self.ok = ok
        self.external_id = external_id
        self.error = error


class BasePublisher:
    platform: Platform

    def __init__(self, dry_run: bool = DRY_RUN):
        self.dry_run = dry_run

    def publish(self, post: Post) -> PublishResult:
        if post.platform != self.platform:
            return PublishResult(False, error=f"wrong platform for {self.platform.value} publisher")
        try:
            if self.dry_run:
                return PublishResult(True, external_id=f"dryrun-{uuid.uuid4().hex[:8]}")
            return self._publish_live(post)
        except Exception as exc:  # pragma: no cover - live-path guard
            return PublishResult(False, error=str(exc))

    def _publish_live(self, post: Post) -> PublishResult:  # pragma: no cover
        raise NotImplementedError(
            f"Live publishing for {self.platform.value} is not configured. "
            "Add API credentials and implement _publish_live()."
        )


class TwitterPublisher(BasePublisher):
    platform = Platform.TWITTER


class InstagramPublisher(BasePublisher):
    platform = Platform.INSTAGRAM


class LinkedInPublisher(BasePublisher):
    platform = Platform.LINKEDIN


class FacebookPublisher(BasePublisher):
    platform = Platform.FACEBOOK


class TikTokPublisher(BasePublisher):
    platform = Platform.TIKTOK


_REGISTRY: Dict[Platform, type[BasePublisher]] = {
    Platform.TWITTER: TwitterPublisher,
    Platform.INSTAGRAM: InstagramPublisher,
    Platform.LINKEDIN: LinkedInPublisher,
    Platform.FACEBOOK: FacebookPublisher,
    Platform.TIKTOK: TikTokPublisher,
}


class PublisherHub:
    """Routes a post to the correct platform publisher."""

    def __init__(self, dry_run: bool = DRY_RUN):
        self.dry_run = dry_run
        self._publishers = {p: cls(dry_run=dry_run) for p, cls in _REGISTRY.items()}

    def publish(self, post: Post) -> Post:
        publisher = self._publishers[post.platform]
        result = publisher.publish(post)
        if result.ok:
            post.status = PostStatus.PUBLISHED
            post.external_id = result.external_id
            post.error = None
        else:
            post.status = PostStatus.FAILED
            post.error = result.error
        return post
