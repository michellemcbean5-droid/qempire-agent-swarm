"""Command-line entry point for the Social Autopilot.

Examples::

    python -m social_autopilot.cli demo
    python -m social_autopilot.cli plan --campaign "Launch" \
        --topics "AI automation,Funding tips" \
        --platforms twitter,linkedin --publish
"""
from __future__ import annotations

import argparse
import sys
from typing import List

from .autopilot import SocialAutopilot
from .models import Platform


def _parse_platforms(value: str) -> List[Platform]:
    return [Platform.from_str(p) for p in value.split(",") if p.strip()]


def _print_calendar(calendar) -> None:
    print(f"\n📅 Content Calendar — {calendar.campaign}")
    print("=" * 60)
    for post in calendar.sorted():
        when = post.scheduled_for or "unscheduled"
        print(f"\n[{post.platform.value.upper()}] {when}  ({post.status.value})")
        print("-" * 60)
        print(post.render())
    print("\n" + "=" * 60)
    print(f"Total posts: {len(calendar.posts)}")


def cmd_demo(args) -> int:
    bot = SocialAutopilot(
        brand_voice={
            "name": "Q-Empire",
            "tone": "bold, motivational, entrepreneurial",
            "cta": "Automate your empire today. 👉 qempireai.com",
        }
    )
    topics = [
        "How AI agents build entire businesses on autopilot",
        "3 automations every founder should set up this week",
    ]
    platforms = [Platform.TWITTER, Platform.LINKEDIN, Platform.INSTAGRAM]
    calendar = bot.plan_campaign("Demo Campaign", topics, platforms)
    _print_calendar(calendar)

    print("\n🚀 Publishing all posts (dry-run)...")
    published = bot.publish_all(calendar)
    for post in published:
        print(f"  ✓ {post.platform.value}: {post.status.value} ({post.external_id})")

    path = bot.save(calendar)
    print(f"\n💾 Calendar saved to {path}")
    return 0


def cmd_plan(args) -> int:
    bot = SocialAutopilot()
    topics = [t.strip() for t in args.topics.split(",") if t.strip()]
    platforms = _parse_platforms(args.platforms)
    calendar = bot.plan_campaign(args.campaign, topics, platforms)
    _print_calendar(calendar)
    if args.publish:
        bot.publish_all(calendar)
        print("\n🚀 Published (dry-run unless SOCIAL_DRY_RUN=0).")
    path = bot.save(calendar)
    print(f"💾 Saved to {path}")
    return 0


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="social_autopilot", description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("demo", help="Run an end-to-end demo campaign")

    plan = sub.add_parser("plan", help="Plan a campaign from topics")
    plan.add_argument("--campaign", default="Untitled Campaign")
    plan.add_argument("--topics", required=True, help="Comma-separated topics")
    plan.add_argument(
        "--platforms",
        default="twitter,linkedin,instagram",
        help="Comma-separated platforms",
    )
    plan.add_argument("--publish", action="store_true", help="Publish after planning")

    args = parser.parse_args(argv)
    if args.command == "demo":
        return cmd_demo(args)
    if args.command == "plan":
        return cmd_plan(args)
    parser.error("unknown command")
    return 1


if __name__ == "__main__":
    sys.exit(main())
