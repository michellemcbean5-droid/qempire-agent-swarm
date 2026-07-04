"""Basic tests for the Q-Empire Agent Swarm tools."""
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_file_write_and_read():
    """Test file write and read tools."""
    from tools.file_system import file_write, file_read

    test_path = "/tmp/qempire_test.txt"
    result = file_write(test_path, "Hello Q-Empire!")
    assert "Written" in result

    content = file_read(test_path)
    assert content == "Hello Q-Empire!"

    os.remove(test_path)
    print("✓ file_write and file_read work correctly")


def test_shell_exec():
    """Test shell execution tool."""
    from tools.shell import shell_exec

    result = shell_exec("echo 'Q-Empire Agent Active'")
    assert "Q-Empire Agent Active" in result
    print("✓ shell_exec works correctly")


def test_browser_search():
    """Test web search tool."""
    from tools.browser import browser_search

    result = browser_search("Q-Empire AI automation")
    assert isinstance(result, str)
    assert len(result) > 0
    print(f"✓ browser_search works (returned {len(result)} chars)")


def test_bridge_json():
    """Test bridge.json read/write."""
    from bridge.monitor import load_bridge, save_bridge

    bridge = load_bridge()
    assert "pending" in bridge
    assert "completed" in bridge
    assert "needs_clarification" in bridge
    print("✓ bridge.json loads correctly")


def test_tool_registry():
    """Test that all tools are registered."""
    from tools import TOOL_REGISTRY, list_tools

    expected_tools = [
        "browser_navigate", "browser_search",
        "file_write", "file_read", "file_edit",
        "shell_exec", "generate_content",
        "generate_website", "generate_document",
        "deploy_to_github", "send_email",
    ]

    for tool in expected_tools:
        assert tool in TOOL_REGISTRY, f"Missing tool: {tool}"

    print(f"✓ All {len(expected_tools)} tools registered")


if __name__ == "__main__":
    print("Running Q-Empire Agent Swarm Tests...")
    print("=" * 40)
    test_file_write_and_read()
    test_shell_exec()
    test_tool_registry()
    test_bridge_json()
    # test_browser_search()  # Uncomment if internet available
    print("=" * 40)
    print("All tests passed!")
