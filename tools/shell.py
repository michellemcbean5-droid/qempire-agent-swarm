"""Shell command execution tool (sandboxed inside Docker)."""
import os
import subprocess


# Allow overriding the working directory for testing / non-Docker environments
SHELL_CWD = os.getenv("QEMPIRE_SHELL_CWD", "/home/ubuntu/workspace")


def shell_exec(command: str, timeout: int = 60) -> str:
    """Execute a shell command and return output. Only safe inside Docker."""
    cwd = SHELL_CWD if os.path.isdir(SHELL_CWD) else os.getcwd()
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd,
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
