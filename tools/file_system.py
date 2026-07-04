"""File system operations tool for reading, writing, and editing files."""
import os


def file_write(path: str, content: str) -> str:
    """Write content to a file, creating directories if needed."""
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Written {len(content)} bytes to {path}"
    except Exception as e:
        return f"ERROR writing to {path}: {str(e)}"


def file_read(path: str) -> str:
    """Read and return file content."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        return content[:10000]  # Limit to 10KB for context window
    except FileNotFoundError:
        return f"ERROR: File not found: {path}"
    except Exception as e:
        return f"ERROR reading {path}: {str(e)}"


def file_edit(path: str, find: str, replace: str) -> str:
    """Find and replace text in a file."""
    try:
        content = file_read(path)
        if content.startswith("ERROR"):
            return content
        new_content = content.replace(find, replace)
        if new_content == content:
            return f"WARNING: '{find[:50]}...' not found in {path}"
        file_write(path, new_content)
        return f"Replaced text in {path}"
    except Exception as e:
        return f"ERROR editing {path}: {str(e)}"
