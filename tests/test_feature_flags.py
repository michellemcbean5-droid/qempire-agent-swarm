"""Tests for feature flags module."""
import pytest
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestFeatureFlags:
    def test_get_all_flags_returns_dict(self, tmp_path, monkeypatch):
        import core.feature_flags as ff
        monkeypatch.setattr(ff, "_FLAGS_PATH", str(tmp_path / "flags.json"))
        flags = ff.get_all_flags()
        assert isinstance(flags, dict)
        assert "ai_generation_enabled" in flags

    def test_is_enabled_returns_true_by_default(self, tmp_path, monkeypatch):
        import core.feature_flags as ff
        monkeypatch.setattr(ff, "_FLAGS_PATH", str(tmp_path / "flags.json"))
        assert ff.is_enabled("ai_generation_enabled") is True

    def test_set_flag_persists(self, tmp_path, monkeypatch):
        import core.feature_flags as ff
        monkeypatch.setattr(ff, "_FLAGS_PATH", str(tmp_path / "flags.json"))
        ff.set_flag("ai_generation_enabled", False)
        assert ff.is_enabled("ai_generation_enabled") is False

    def test_reset_restores_defaults(self, tmp_path, monkeypatch):
        import core.feature_flags as ff
        from core.config import DEFAULT_FEATURE_FLAGS
        monkeypatch.setattr(ff, "_FLAGS_PATH", str(tmp_path / "flags.json"))
        ff.set_flag("ai_generation_enabled", False)
        ff.reset_flags()
        assert ff.is_enabled("ai_generation_enabled") == DEFAULT_FEATURE_FLAGS["ai_generation_enabled"]

    def test_set_flags_batch(self, tmp_path, monkeypatch):
        import core.feature_flags as ff
        monkeypatch.setattr(ff, "_FLAGS_PATH", str(tmp_path / "flags.json"))
        ff.set_flags({"ai_generation_enabled": False, "onboarding_enabled": False})
        assert ff.is_enabled("ai_generation_enabled") is False
        assert ff.is_enabled("onboarding_enabled") is False

    def test_unknown_flag_defaults_to_true(self, tmp_path, monkeypatch):
        import core.feature_flags as ff
        monkeypatch.setattr(ff, "_FLAGS_PATH", str(tmp_path / "flags.json"))
        # A flag not in the defaults should return True (safe default)
        assert ff.is_enabled("nonexistent_flag") is True
