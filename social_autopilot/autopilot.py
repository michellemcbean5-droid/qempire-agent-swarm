"""Orchestrator that ties generation, scheduling, and publishing together."""
from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Dict, List, Optional

from .config import DRY_RUN, OUTPUT_DIR
from .content_engine import ContentEngine
from .models import ContentCalendar, Platform, PostStatus
from .publisher import PublisherHub
from .scheduler import Scheduler


class SocialAutopilot:
    """End-to-end social media autopilot.

    Typical flow::

        bot = SocialAutopilot(brand_voice={...})
        calendar = bot.plan_campaign("Launch week", topics, platforms)
        bot.run_due(calendar)          # publish anything due now
    """

    def __init__(
        self,
        brand_voice: Optional[Dict] = None,
        dry_run: bool = DRY_RUN,
    ):
        self.engine = ContentEngine(brand_voice=brand_voice)
        self.scheduler = Scheduler()
        self.hub = PublisherHub(dry_run=dry_run)
        self.dry_run = dry_run

    def plan_campaign(
        self,
        campaign: str,
        topics: List[str],
        platforms: List[Platform],
        start: Optional[datetime] = None,
    ) -> ContentCalendar:
        """Generate content and lay it out on a posting calendar."""
        posts = self.engine.generate_batch(topics, platforms)
        calendar = self.scheduler.schedule(posts, campaign=campaign, start=start)
        return calendar

    def run_due(
        self, calendar: ContentCalendar, now: Optional[datetime] = None
    ) -> List:
        """Publish every post whose scheduled time has arrived."""
        published = []
        for post in calendar.due(now=now):
            self.hub.publish(post)
            published.append(post)
        return published

    def publish_all(self, calendar: ContentCalendar) -> List:
        """Force-publish every scheduled post immediately (ignores timing)."""
        published = []
        for post in calendar.posts:
            if post.status in (PostStatus.SCHEDULED, PostStatus.DRAFT):
                self.hub.publish(post)
                published.append(post)
        return published

    def save(self, calendar: ContentCalendar, path: Optional[str] = None) -> str:
        """Persist a calendar to disk as JSON. Returns the file path."""
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        if path is None:
            safe = calendar.campaign.lower().replace(" ", "_")
            path = os.path.join(OUTPUT_DIR, f"{safe}.json")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(calendar.to_json())
        return path

    @staticmethod
    def load(path: str) -> ContentCalendar:
        with open(path, encoding="utf-8") as fh:
            return ContentCalendar.from_dict(json.load(fh))
