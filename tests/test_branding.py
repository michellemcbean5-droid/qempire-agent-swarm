"""Tests for Michelle & Q-Bot branding integration."""
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_planner_prompt_mentions_michelle_and_qbot():
    """Planner prompt should describe Michelle and Q-Bot personas."""
    planner_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "core", "planner.py")
    with open(planner_path, "r") as f:
        source = f.read()

    assert "Michelle" in source
    assert "Q-Bot" in source
    assert "Black Mermaid Queen" in source
    print("✓ Planner prompt includes Michelle & Q-Bot branding")


def test_website_prompt_mentions_michelle_theme():
    """Website generation prompt should include the Michelle/Q-Bot theme."""
    website_builder_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools", "website_builder.py")
    with open(website_builder_path, "r") as f:
        source = f.read()

    assert "Michelle" in source
    assert "Q-Bot" in source
    assert "Black Mermaid Queen" in source
    print("✓ Website generation prompt includes Michelle & Q-Bot theme")


def test_branding_kit_prompt_mentions_michelle():
    """Branding kit prompt should reference Michelle/Q-Bot inspiration."""
    document_gen_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools", "document_gen.py")
    with open(document_gen_path, "r") as f:
        source = f.read()

    assert "Michelle" in source
    assert "Black Mermaid Queen" in source
    print("✓ Branding kit prompt includes Michelle inspiration")


def test_skills_use_michelle_qbot_voice():
    """Skill email bodies should reference Michelle and Q-Bot."""
    skills_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "skills")
    required_phrases = ["Michelle", "Q-Bot"]

    for filename in os.listdir(skills_dir):
        if not filename.endswith(".json"):
            continue
        with open(os.path.join(skills_dir, filename), "r") as f:
            skill = json.load(f)
        skill_text = json.dumps(skill)
        if "send_email" in skill_text:
            for phrase in required_phrases:
                assert phrase in skill_text, f"{filename} email missing '{phrase}'"

    print("✓ Skill email templates reference Michelle & Q-Bot")


def test_agent_event_stream_uses_michelle_qbot_tags():
    """Agent event stream tags should use [MICHELLE] and [Q-BOT]."""
    core_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "core")
    combined = ""
    for filename in ["executor.py", "verifier.py", "agent_loop.py"]:
        with open(os.path.join(core_dir, filename), "r") as f:
            combined += f.read()

    assert "[Q-BOT]" in combined
    assert "[MICHELLE]" in combined
    print("✓ Executor and verifier use [Q-BOT] and [MICHELLE] tags")


def test_email_sender_from_michelle_and_qbot():
    """Email sender should use Michelle & Q-Bot in the From name."""
    email_sender_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools", "email_sender.py")
    with open(email_sender_path, "r") as f:
        source = f.read()

    assert "Michelle & Q-Bot" in source
    print("✓ Email sender uses Michelle & Q-Bot From name")


if __name__ == "__main__":
    print("Running Michelle & Q-Bot Branding Tests...")
    print("=" * 50)
    test_planner_prompt_mentions_michelle_and_qbot()
    test_website_prompt_mentions_michelle_theme()
    test_branding_kit_prompt_mentions_michelle()
    test_skills_use_michelle_qbot_voice()
    test_agent_event_stream_uses_michelle_qbot_tags()
    test_email_sender_from_michelle_and_qbot()
    print("=" * 50)
    print("All branding tests passed!")
