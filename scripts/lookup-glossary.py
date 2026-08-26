#!/usr/bin/env python3
"""Look up one SCP glossary term without standing up Docker.

Usage:
  python scripts/lookup-glossary.py ATP
  python scripts/lookup-glossary.py "finite capacity"
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GLOSSARY = ROOT / "data" / "scp-corpus" / "glossary.md"


def parse_terms(text: str) -> list[dict[str, str]]:
    chunks = re.split(r"(?m)^###\s+", text)
    terms: list[dict[str, str]] = []
    for chunk in chunks[1:]:
        lines = chunk.strip().splitlines()
        if not lines:
            continue
        title = lines[0].strip()
        english = next((re.sub(r"^\*\*English\*\*:\s*", "", line) for line in lines if line.startswith("- **English**")), "")
        chinese = next((re.sub(r"^\*\*中文\*\*:\s*", "", line) for line in lines if line.startswith("- **中文**")), "")
        terms.append({"title": title, "english": english, "chinese": chinese})
    return terms


def lookup(query: str, terms: list[dict[str, str]]) -> list[dict[str, str]]:
    needle = query.strip().lower()
    hits = []
    for term in terms:
        blob = f"{term['title']} {term['english']}".lower()
        if needle in blob:
            hits.append(term)
    return hits


def main() -> None:
    parser = argparse.ArgumentParser(description="Search the bundled SCP glossary (no Docker).")
    parser.add_argument("query", help="Term or substring, e.g. ATP")
    args = parser.parse_args()
    if not GLOSSARY.exists():
        raise SystemExit(f"missing {GLOSSARY}")
    hits = lookup(args.query, parse_terms(GLOSSARY.read_text(encoding="utf-8")))
    if not hits:
        raise SystemExit(f"no term matched {args.query!r}")
    for term in hits[:8]:
        print(term["title"])
        print(f"  {term['english']}")
        if term["chinese"]:
            print(f"  {term['chinese']}")
        print()


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        sys.exit(0)
