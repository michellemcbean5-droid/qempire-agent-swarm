"""Builds a posting calendar by spreading posts across preferred time slots."""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Optional

from .config import POSTING_SLOTS
from .models import ContentCalendar, Post, PostStatus


class Scheduler:
    """Assigns scheduled timestamps to a batch of posts.

    Posts are distributed day-by-day across each platform's preferred posting
    hours (see ``config.POSTING_SLOTS``), starting from ``start`` (default: the
    next day at the first available slot).
    """

    def __init__(self, slots: Optional[dict] = None):
        self.slots = slots or POSTING_SLOTS

    def schedule(
        self,
        posts: List[Post],
        campaign: str = "default",
        start: Optional[datetime] = None,
    ) -> ContentCalendar:
        start = start or (datetime.utcnow() + timedelta(days=1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        calendar = ContentCalendar(campaign=campaign)

        # Track how many posts we've placed per platform to advance slots/days.
        placed: dict[str, int] = {}
        for post in posts:
            platform = post.platform.value
            slots = self.slots.get(platform, [9, 15, 20])
            n = placed.get(platform, 0)

            day_offset = n // len(slots)
            slot_index = n % len(slots)
            hour = slots[slot_index]

            when = start + timedelta(days=day_offset)
            when = when.replace(hour=hour, minute=0, second=0, microsecond=0)

            post.scheduled_for = when.isoformat()
            post.status = PostStatus.SCHEDULED
            calendar.add(post)
            placed[platform] = n + 1

        return calendar
