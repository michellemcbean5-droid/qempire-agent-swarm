"""Shell command execution tool (sandboxed inside Docker)."""
import subprocess
import os

# Use /home/ubuntu/workspace inside Docker, fall back to repo/workspace or system tmp
_DEFAULT_WORKSPACE = "/home/ubuntu/workspace" if os.path.isdir("/home/ubuntu") else os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "workspace"
)
WORKSPACE_DIR = os.getenv("WORKSPACE_DIR", _DEFAULT_WORKSPACE)


def shell_exec(command: str, timeout: int = 60) -> str:
    """Execute a shell command and return output. Only safe inside Docker."""
    try:
        # Ensure workspace dir exists (important for dev/CI runs outside Docker)
        os.makedirs(WORKSPACE_DIR, exist_ok=True)
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=WORKSPACE_DIR,
        )
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        if result.returncode == 0:
            return stdout[:3000] if stdout else "Command executed successfully (no output)"
        else:
            return f"ERROR (exit code {result.returncode}):\n{stderr[:2000]}"

    except subprocess.TimeoutExpired:
        return f"ERROR: Command timed out after {timeout} seconds"
    except Exception as e:
        return f"ERROR executing command: {str(e)}"
