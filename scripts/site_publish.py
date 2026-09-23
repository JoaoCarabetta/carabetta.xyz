#!/usr/bin/env python3
"""Registry of URL prefixes other repos publish onto carabetta.xyz.

Top-level prefixes only. A nested path is unsafe with rsync --delete: if the
parent directory is not in the source tree, rsync removes it and the nested
exclude goes with it.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REGISTRY = ROOT / "publishers.json"

# First path segment the site repo owns, or that must not be a publisher root.
RESERVED = {
    "transparencia",
    "assets",
    "content",
    "scripts",
    "tests",
    "dataviz",
    ".well-known",
    ".github",
    ".cursor",
}

PATH_RE = re.compile(r"^[a-z0-9][a-z0-9._-]{0,62}$")
PRESERVE_RE = re.compile(r"^[A-Za-z0-9._*?/-]+$")


class RegistryError(Exception):
    pass


def load(path: Path | None = None) -> dict:
    registry_path = path or DEFAULT_REGISTRY
    try:
        data = json.loads(registry_path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RegistryError(f"missing registry {registry_path}") from exc
    except json.JSONDecodeError as exc:
        raise RegistryError(f"invalid JSON in {registry_path}: {exc}") from exc
    validate(data)
    return data


def validate(data: dict) -> None:
    if not isinstance(data, dict):
        raise RegistryError("registry must be a JSON object")
    owner = data.get("owner_repo")
    if not _valid_repo(owner):
        raise RegistryError("owner_repo must look like owner/name")
    remote_root = data.get("remote_root")
    if not isinstance(remote_root, str) or not remote_root.startswith("/") or ".." in remote_root.split("/"):
        raise RegistryError("remote_root must be an absolute path")
    publishers = data.get("publishers")
    if not isinstance(publishers, list):
        raise RegistryError("publishers must be a list")
    seen: set[str] = set()
    for entry in publishers:
        path = _entry_path(entry)
        if path in seen:
            raise RegistryError(f"duplicate publisher path: {path}")
        seen.add(path)
        if not _valid_repo(entry.get("repo")):
            raise RegistryError(f"{path}: repo must look like owner/name")
        preserve = entry.get("preserve") or []
        if not isinstance(preserve, list):
            raise RegistryError(f"{path}: preserve must be a list")
        for pattern in preserve:
            if not isinstance(pattern, str) or not PRESERVE_RE.fullmatch(pattern) or ".." in pattern.split("/"):
                raise RegistryError(f"{path}: bad preserve pattern {pattern!r}")


def _entry_path(entry: dict) -> str:
    if not isinstance(entry, dict):
        raise RegistryError("publisher entry must be an object")
    raw = entry.get("path")
    if not isinstance(raw, str):
        raise RegistryError("publisher path must be a string")
    path = raw.strip("/")
    if not PATH_RE.fullmatch(path):
        raise RegistryError(
            f"publisher path {raw!r} must be one top-level segment (lowercase, no slashes)"
        )
    if path in RESERVED:
        raise RegistryError(f"publisher path {path!r} is reserved by the site repo")
    return path


def _valid_repo(value: object) -> bool:
    if not isinstance(value, str):
        return False
    owner, sep, name = value.partition("/")
    if not sep or "/" in name or not owner or not name:
        return False
    return bool(re.fullmatch(r"[A-Za-z0-9_.-]+", owner) and re.fullmatch(r"[A-Za-z0-9_.-]+", name))


def _norm_repo(value: str) -> str:
    return value.strip().casefold()


def rsync_excludes(data: dict | None = None) -> list[str]:
    """Directories the full-site rsync must not upload or delete."""
    data = data if data is not None else load()
    return [f"{_entry_path(entry)}/" for entry in data["publishers"]]


def authorize(data: dict, path: str, caller: str) -> dict:
    """Return the publisher entry the caller is allowed to deploy."""
    wanted = path.strip("/")
    match = None
    for entry in data["publishers"]:
        if _entry_path(entry) == wanted:
            match = entry
            break
    if match is None:
        known = ", ".join(_entry_path(entry) for entry in data["publishers"]) or "(none)"
        raise RegistryError(f"path {path!r} is not in publishers.json (known: {known})")
    caller = caller.strip()
    if not caller:
        return match
    allowed = {_norm_repo(data["owner_repo"]), _norm_repo(match["repo"])}
    if _norm_repo(caller) not in allowed:
        raise RegistryError(
            f"{caller} cannot publish /{wanted}/ (expected {match['repo']} or {data['owner_repo']})"
        )
    return match


def _cmd_excludes(args: argparse.Namespace) -> int:
    for prefix in rsync_excludes(load(Path(args.registry) if args.registry else None)):
        print(prefix)
    return 0


def _cmd_check(args: argparse.Namespace) -> int:
    data = load(Path(args.registry) if args.registry else None)
    caller = args.caller if args.caller is not None else ""
    entry = authorize(data, args.path, caller)
    path = _entry_path(entry)
    print(f"path={path}")
    print(f"remote_root={data['remote_root'].rstrip('/')}")
    print(f"repo={entry['repo']}")
    for pattern in entry.get("preserve") or []:
        print(f"preserve={pattern}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    excludes = sub.add_parser("excludes", help="print rsync --exclude prefixes")
    excludes.add_argument("--registry", default=None)
    excludes.set_defaults(func=_cmd_excludes)

    check = sub.add_parser("check", help="authorize a publish and print preserve rules")
    check.add_argument("--registry", default=None)
    check.add_argument("--path", required=True)
    check.add_argument("--caller", default="")
    check.set_defaults(func=_cmd_check)

    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except RegistryError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
