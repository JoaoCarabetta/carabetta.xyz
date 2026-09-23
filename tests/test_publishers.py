#!/usr/bin/env python3
"""Publisher registry: other repos may deploy only their own prefix."""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

import sys

sys.path.insert(0, str(ROOT / "scripts"))

import site_publish  # noqa: E402


class RegistryTests(unittest.TestCase):
    def test_live_registry_includes_dotsbr_and_protects_tiles(self):
        data = site_publish.load()
        self.assertEqual(data["owner_repo"], "JoaoCarabetta/carabetta.xyz")
        self.assertEqual(data["remote_root"], "/var/www/carabetta.xyz")
        dotsbr = next(entry for entry in data["publishers"] if entry["path"] == "dotsbr")
        self.assertEqual(dotsbr["repo"].casefold(), "joaocarabetta/dotsbr")
        self.assertIn("data/tiles/", dotsbr["preserve"])
        self.assertEqual(site_publish.rsync_excludes(data), ["dotsbr/"])

    def test_rejects_nested_and_reserved_paths(self):
        data = {
            "owner_repo": "JoaoCarabetta/carabetta.xyz",
            "remote_root": "/var/www/carabetta.xyz",
            "publishers": [{"path": "transparencia", "repo": "JoaoCarabetta/example"}],
        }
        with self.assertRaises(site_publish.RegistryError):
            site_publish.validate(data)
        data["publishers"][0]["path"] = "maps/dots"
        with self.assertRaises(site_publish.RegistryError):
            site_publish.validate(data)

    def test_caller_must_own_the_path(self):
        data = site_publish.load()
        site_publish.authorize(data, "dotsbr", "")
        site_publish.authorize(data, "dotsbr", "joaocarabetta/dotsbr")
        site_publish.authorize(data, "dotsbr", "JoaoCarabetta/carabetta.xyz")
        with self.assertRaises(site_publish.RegistryError):
            site_publish.authorize(data, "dotsbr", "evil/dotsbr")
        with self.assertRaises(site_publish.RegistryError):
            site_publish.authorize(data, "not-registered", "JoaoCarabetta/carabetta.xyz")

    def test_rsync_exclude_keeps_publisher_tree(self):
        if shutil.which("rsync") is None:
            self.skipTest("rsync is not installed")
        with tempfile.TemporaryDirectory() as tmp:
            src = Path(tmp) / "src"
            dst = Path(tmp) / "dst"
            (src / "keep").mkdir(parents=True)
            (src / "keep" / "index.html").write_text("new", encoding="utf-8")
            (src / "dotsbr").mkdir()
            (src / "dotsbr" / "stale.html").write_text("stale", encoding="utf-8")
            (dst / "dotsbr" / "data" / "tiles").mkdir(parents=True)
            (dst / "dotsbr" / "data" / "tiles" / "censo2022.pmtiles").write_text("tiles", encoding="utf-8")
            (dst / "gone.html").write_text("old", encoding="utf-8")
            excludes = site_publish.rsync_excludes()
            cmd = ["rsync", "-a", "--delete"]
            for prefix in excludes:
                cmd.extend(["--exclude", prefix])
            cmd.extend([f"{src}/", f"{dst}/"])
            subprocess.run(cmd, check=True)
            self.assertFalse((dst / "gone.html").exists())
            self.assertTrue((dst / "dotsbr" / "data" / "tiles" / "censo2022.pmtiles").exists())
            self.assertFalse((dst / "dotsbr" / "stale.html").exists())
            self.assertEqual((dst / "keep" / "index.html").read_text(encoding="utf-8"), "new")

    def test_deploy_script_uses_the_registry(self):
        text = (ROOT / "deploy.sh").read_text(encoding="utf-8")
        self.assertIn("site_publish.py", text)
        self.assertIn("excludes", text)
        self.assertNotIn("--exclude 'dotsbr/index.html'", text)


class PublishScriptTests(unittest.TestCase):
    def run_publish(self, extra_env: dict) -> subprocess.CompletedProcess[str]:
        env = os.environ.copy()
        env.update(
            {
                "DRY_RUN": "1",
                "SSH_HOST": "example.invalid",
                "SSH_USER": "root",
                "REMOTE_PATH": "/var/www/carabetta.xyz",
                "PUBLISH_PATH": "dotsbr",
                "PUBLISH_SOURCE": str(ROOT / "dotsbr"),
                "GITHUB_REPOSITORY": "JoaoCarabetta/dotsbr",
            }
        )
        env.pop("PUBLISH_INCLUDE", None)
        env.pop("PUBLISH_DELETE", None)
        env.update(extra_env)
        return subprocess.run(
            ["bash", str(ROOT / "scripts" / "publish-path.sh")],
            cwd=ROOT,
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )

    def test_dry_run_directory_sync_preserves_tiles(self):
        result = self.run_publish({})
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("delete=1", result.stdout)
        self.assertIn("preserve=data/tiles/", result.stdout)
        self.assertIn("DRY_RUN", result.stdout)
        self.assertNotIn("example.invalid", result.stderr)

    def test_include_mode_does_not_delete(self):
        index = ROOT / "dotsbr" / "index.html"
        result = self.run_publish({"PUBLISH_INCLUDE": "index.html\n"})
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("delete=0", result.stdout)
        self.assertIn("include=index.html", result.stdout)
        self.assertTrue(index.exists())

    def test_wrong_repo_is_rejected(self):
        result = self.run_publish({"GITHUB_REPOSITORY": "evil/repo"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("cannot publish", result.stderr)

    def test_include_traversal_is_rejected(self):
        result = self.run_publish({"PUBLISH_INCLUDE": "../deploy.sh"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("refusing include path", result.stderr)


if __name__ == "__main__":
    unittest.main()
