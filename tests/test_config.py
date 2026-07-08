"""Tests for configuration and constants."""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import core.config as config


class TestConfig:
    def test_task_types_defined(self):
        assert isinstance(config.TASK_TYPES, list)
        assert len(config.TASK_TYPES) > 0
        assert "BUILD_WEBSITE" in config.TASK_TYPES

    def test_packages_defined(self):
        assert isinstance(config.PACKAGES, dict)
        assert "foundation" in config.PACKAGES
        assert "empire-pro" in config.PACKAGES
        assert config.PACKAGES["foundation"]["price"] == 1997

    def test_directories_defined(self):
        assert config.OUTPUT_DIR == "/home/ubuntu/output"
        assert config.WEBSITES_DIR == "/home/ubuntu/output/websites"
        assert config.DOCUMENTS_DIR == "/home/ubuntu/output/documents"

    def test_max_retries_is_int(self):
        assert isinstance(config.MAX_RETRIES, int)
        assert config.MAX_RETRIES >= 1

    def test_bridge_path_exists(self):
        assert isinstance(config.BRIDGE_PATH, str)
        assert len(config.BRIDGE_PATH) > 0
