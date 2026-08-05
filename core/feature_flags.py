"""
Feature Flag Store — Runtime feature toggles for Q-Empire.
Persists to a JSON file. Can be toggled via the admin API.
"""
import json
import os
from copy import deepcopy
from core.config import DEFAULT_FEATURE_FLAGS

_FLAGS_PATH = os.getenv("FLAGS_PATH", os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "memory", "feature_flags.json"
))


def _load() -> dict[str, bool]:
    if os.path.exists(_FLAGS_PATH):
        try:
            with open(_FLAGS_PATH, "r") as f:
                stored = json.load(f)
            # Merge: stored values win, but new defaults fill in missing keys
            flags = deepcopy(DEFAULT_FEATURE_FLAGS)
            flags.update(stored)
            return flags
        except (json.JSONDecodeError, OSError):
            pass
    return deepcopy(DEFAULT_FEATURE_FLAGS)


def _save(flags: dict[str, bool]) -> None:
    os.makedirs(os.path.dirname(_FLAGS_PATH), exist_ok=True)
    with open(_FLAGS_PATH, "w") as f:
        json.dump(flags, f, indent=2)


def get_all_flags() -> dict[str, bool]:
    """Return all feature flags."""
    return _load()


def is_enabled(flag: str) -> bool:
    """Check if a specific feature flag is enabled."""
    return _load().get(flag, True)


def set_flag(flag: str, value: bool) -> dict[str, bool]:
    """Set a single feature flag and persist."""
    flags = _load()
    flags[flag] = value
    _save(flags)
    return flags


def set_flags(updates: dict[str, bool]) -> dict[str, bool]:
    """Batch update feature flags."""
    flags = _load()
    flags.update(updates)
    _save(flags)
    return flags


def reset_flags() -> dict[str, bool]:
    """Reset all flags to defaults."""
    _save(deepcopy(DEFAULT_FEATURE_FLAGS))
    return deepcopy(DEFAULT_FEATURE_FLAGS)
