"""Tests for the Social Autopilot module."""
import json
import os
import sys
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from social_autopilot import ContentCalendar, Platform, Post, PostStatus, SocialAutopilot
from social_autopilot.content_engine import ContentEngine
from social_autopilot.config import PLATFORM_LIMITS
from social_autopilot.scheduler import Scheduler


def test_platform_from_str():
    assert Platform.from_str("Twitter") == Platform.TWITTER
    assert Platform.from_str(" linkedin ") == Platform.LINKEDIN
    try:
        Platform.from_str("myspace")
        assert False, "should have raised"
    except ValueError:
        pass
    print("✓ Platform parsing handles case, whitespace, and bad input")


def test_content_engine_respects_platform_limits():
    engine = ContentEngine()
    for platform in Platform:
        post = engine.generate("A very long topic about scaling businesses", platform)
        limits = PLATFORM_LIMITS[platform.value]
        assert len(post.caption) <= limits["caption"]
        assert len(post.hashtags) <= limits["hashtags"]
        assert post.caption  # non-empty
    print("✓ ContentEngine keeps captions and hashtags within platform limits")


def test_content_engine_uses_brand_voice():
    engine = ContentEngine(brand_voice={"name": "Acme", "cta": "Buy now.", "hashtags_base": ["#Acme"]})
    post = engine.generate("Launch day", Platform.TWITTER)
    assert "Buy now." in post.caption
    assert "#Acme" in post.hashtags
    print("✓ ContentEngine applies custom brand voice and CTA")


def test_scheduler_spreads_across_slots():
    engine = ContentEngine()
    posts = engine.generate_batch(
        ["t1", "t2", "t3", "t4", "t5"], [Platform.TWITTER]
    )
    start = datetime(2026, 1, 1)
    calendar = Scheduler().schedule(posts, campaign="test", start=start)

    times = [datetime.fromisoformat(p.scheduled_for) for p in calendar.posts]
    # All scheduled, all unique timestamps, strictly increasing after sort.
    assert all(p.status == PostStatus.SCHEDULED for p in calendar.posts)
    assert len(set(times)) == len(times)
    # 5 posts across 4 twitter slots => 5th rolls to next day.
    assert times[4].date() > times[0].date()
    print("✓ Scheduler spreads posts across slots and rolls into the next day")


def test_calendar_due_filtering():
    post_past = Post(Platform.TWITTER, "past", scheduled_for="2020-01-01T09:00:00", status=PostStatus.SCHEDULED)
    post_future = Post(Platform.TWITTER, "future", scheduled_for="2999-01-01T09:00:00", status=PostStatus.SCHEDULED)
    post_draft = Post(Platform.TWITTER, "draft")
    cal = ContentCalendar(campaign="t", posts=[post_past, post_future, post_draft])

    due = cal.due(now=datetime(2026, 1, 1))
    assert post_past in due
    assert post_future not in due
    assert post_draft not in due
    print("✓ ContentCalendar.due returns only scheduled posts whose time passed")


def test_autopilot_end_to_end_dry_run():
    bot = SocialAutopilot(dry_run=True)
    calendar = bot.plan_campaign(
        "E2E", ["topic a", "topic b"], [Platform.TWITTER, Platform.LINKEDIN]
    )
    assert len(calendar.posts) == 4  # 2 topics x 2 platforms

    published = bot.publish_all(calendar)
    assert len(published) == 4
    for post in published:
        assert post.status == PostStatus.PUBLISHED
        assert post.external_id and post.external_id.startswith("dryrun-")
        assert post.error is None
    print("✓ SocialAutopilot generates, schedules, and publishes end-to-end (dry-run)")


def test_calendar_round_trip_serialization():
    bot = SocialAutopilot(dry_run=True)
    calendar = bot.plan_campaign("Serialize", ["t"], [Platform.INSTAGRAM])
    restored = ContentCalendar.from_dict(json.loads(calendar.to_json()))
    assert restored.campaign == calendar.campaign
    assert len(restored.posts) == len(calendar.posts)
    assert restored.posts[0].platform == Platform.INSTAGRAM
    print("✓ ContentCalendar survives JSON round-trip")


def test_save_and_load(tmp_path=None):
    bot = SocialAutopilot(dry_run=True)
    calendar = bot.plan_campaign("Persist Me", ["t"], [Platform.FACEBOOK])
    target = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "output",
        "social",
        "persist_me.json",
    )
    path = bot.save(calendar)
    assert os.path.exists(path)
    loaded = SocialAutopilot.load(path)
    assert loaded.campaign == "Persist Me"
    os.remove(path)
    print("✓ SocialAutopilot saves and loads calendars from disk")


def test_skill_definitions_valid():
    skills_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "social_autopilot",
        "skills",
    )
    for name in ("generate_content_calendar.json", "publish_post.json"):
        with open(os.path.join(skills_dir, name)) as f:
            data = json.load(f)
        assert "skill_name" in data
        assert "trigger_task_type" in data
        assert isinstance(data["steps"], list) and data["steps"]
    print("✓ Social skill JSON definitions are valid")


if __name__ == "__main__":
    test_platform_from_str()
    test_content_engine_respects_platform_limits()
    test_content_engine_uses_brand_voice()
    test_scheduler_spreads_across_slots()
    test_calendar_due_filtering()
    test_autopilot_end_to_end_dry_run()
    test_calendar_round_trip_serialization()
    test_save_and_load()
    test_skill_definitions_valid()
    print("\n✅ All social autopilot tests passed!")
