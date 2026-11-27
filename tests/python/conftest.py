"""Shared pytest configuration: make examples/ importable and expose the repo root."""
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "examples"))


@pytest.fixture(scope="session")
def root() -> Path:
    return ROOT
