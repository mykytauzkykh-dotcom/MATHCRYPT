"""Repository-level checks: reproducible build, metadata consistency, structure."""
import json
import re
import shutil
import subprocess
import sys

import pytest

yaml = pytest.importorskip("yaml")

DOI = "10.5281/zenodo.24540765"
VERSION = "6.0.0"
TITLE = ("MATHCRYPT 6.0: An Interactive Computational Research Platform for "
         "Diophantine Equations, Number Theory, and Modern Cryptography")


def test_build_is_byte_reproducible(root, tmp_path):
    """source/build.py must regenerate the committed site/index.html exactly."""
    work = tmp_path / "repo"
    (work / "site").mkdir(parents=True)
    (work / "offline").mkdir()
    shutil.copytree(root / "source", work / "source")
    subprocess.run([sys.executable, str(work / "source" / "build.py")], check=True,
                   capture_output=True)
    built = (work / "site" / "index.html").read_bytes()
    assert built == (root / "site" / "index.html").read_bytes()
    assert built == (root / "offline" / "mathcrypt.html").read_bytes()


def test_citation_cff_matches_zenodo_record(root):
    cff = yaml.safe_load((root / "CITATION.cff").read_text(encoding="utf-8"))
    assert cff["cff-version"] == "1.2.0"
    assert cff["title"] == TITLE
    assert cff["version"] == VERSION
    assert cff["doi"] == DOI
    assert str(cff["date-released"]) == "2026-11-25"
    assert cff["repository-code"] == "https://github.com/mykytauzkykh-dotcom/MATHCRYPT"
    author = cff["authors"][0]
    assert (author["family-names"], author["given-names"]) == ("Uzkykh", "Mykyta")
    assert author["orcid"] == "https://orcid.org/0009-0001-7704-8083"
    assert set(cff["license"]) == {"MIT", "CC-BY-4.0"}
    pc = cff["preferred-citation"]
    assert pc["doi"] == DOI and pc["title"] == TITLE and pc["version"] == VERSION


def test_in_app_metadata_matches_citation(root):
    m9j = (root / "source" / "modules" / "m9j.js").read_text(encoding="utf-8")
    build = (root / "source" / "build.py").read_text(encoding="utf-8")
    for text in (m9j, build):
        assert DOI in text
        assert f"'{VERSION}'" in text
    assert TITLE in build


def test_recorded_test_results_all_pass(root):
    data = json.loads((root / "tests" / "test_results.json").read_text(encoding="utf-8"))
    results = data["r"]
    assert len(results) == 248
    assert all(ok for _, ok, *_ in results)


def test_required_repository_files_exist(root):
    required = [
        "README.md", "LICENSE", "LICENSE-DOCS.md", "CITATION.cff", "CHANGELOG.md",
        "CONTRIBUTING.md", "SECURITY.md", "THIRD_PARTY_NOTICES.md", "requirements.txt",
        ".gitignore", "docs/ARCHITECTURE.md", "docs/ALGORITHMS.md",
        "docs/MATHEMATICAL_FOUNDATIONS.md", "docs/TEST_REPORT.md",
        "docs/KNOWN_LIMITATIONS.md", "docs/REPRODUCTION.md", "examples/README.md",
        "examples/reference.py", ".github/workflows/ci.yml", "site/index.html",
        "offline/mathcrypt.html",
    ]
    missing = [p for p in required if not (root / p).is_file()]
    assert not missing, missing


def test_no_obvious_secrets(root):
    pattern = re.compile(
        r"(ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|"
        r"-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{10,})")
    hits = []
    for path in root.rglob("*"):
        if ".git" in path.parts or not path.is_file() or path.suffix in {".png", ".pdf", ".zip"}:
            continue
        if pattern.search(path.read_text(encoding="utf-8", errors="ignore")):
            hits.append(str(path.relative_to(root)))
    assert not hits, hits
