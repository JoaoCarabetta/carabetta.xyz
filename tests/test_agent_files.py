#!/usr/bin/env python3
"""Functionality, security, and speed checks for the agent-readiness corpus."""

from __future__ import annotations

import json
import re
import subprocess
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FunctionalityTests(unittest.TestCase):
    def test_generator_check_passes(self):
        result = subprocess.run(
            ["python3", str(ROOT / "scripts" / "generate_agent_files.py"), "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_homepage_has_prerendered_timeline(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertGreater(html.count('class="entry"'), 20)
        self.assertIn("application/ld+json", html)
        self.assertIn('rel="alternate" type="text/markdown"', html)
        self.assertIn('application/rss+xml', html)
        self.assertIn('id="main-content"', html)
        text = re.sub(r"<script[\s\S]*?</script>", "", html)
        text = re.sub(r"<[^>]+>", " ", text)
        self.assertGreater(len(re.sub(r"\s+", " ", text).strip()), 500)

    def test_site_nav_is_hidden_but_still_in_html(self):
        # Agents read the page index from source; humans should not see the bar.
        pages = ["index.html", "cv.html", "about.html", "glossary.html", "contact.html", "privacy.html"]
        for name in pages:
            html = (ROOT / name).read_text(encoding="utf-8")
            self.assertIn('class="site-nav" hidden', html, name)
            self.assertIn('href="/dotsbr/"', html, name)
            self.assertIn(".md", html, name)
        css = (ROOT / "assets" / "home.css").read_text(encoding="utf-8")
        self.assertIn(".site-nav[hidden]", css)

    def test_empty_timeline_source_is_rejected_by_shape(self):
        home = json.loads((ROOT / "content" / "home.json").read_text(encoding="utf-8"))
        self.assertTrue(home["TIMELINE"])
        self.assertGreater(len(home["TIMELINE"]), 1)

    def test_sitemaps_and_llms_cover_public_pages(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        for path in ["https://carabetta.xyz/", "https://carabetta.xyz/cv.html", "https://carabetta.xyz/dotsbr/"]:
            self.assertIn(path, sitemap)
        self.assertIn("/index.md", llms)
        self.assertIn("When to use this site", llms)
        self.assertIn("GPTBot", robots)
        self.assertIn("Sitemap: https://carabetta.xyz/sitemap.xml", robots)
        self.assertIn("<lastmod>", sitemap)

    def test_index_markdown_preserves_line_breaks(self):
        text = (ROOT / "index.md").read_text(encoding="utf-8")
        self.assertNotIn("Brazilopen", text)
        self.assertIn("Brazil", text)

    def test_markdown_mirrors_have_frontmatter(self):
        for name in ["index.md", "cv.md", "about.md", "dotsbr.md"]:
            text = (ROOT / name).read_text(encoding="utf-8")
            self.assertTrue(text.startswith("---"))
            self.assertIn("canonical_url:", text)
            self.assertIn("last_updated:", text)
            self.assertIn("## Sitemap", text)

    def test_malformed_page_id_is_not_in_sitemap(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        self.assertNotIn("{", sitemap)
        self.assertNotIn("None", sitemap)

    def test_feed_has_items(self):
        feed = (ROOT / "feed.xml").read_text(encoding="utf-8")
        self.assertIn("<item>", feed)
        self.assertGreater(feed.count("<item>"), 5)


class SecurityTests(unittest.TestCase):
    def test_private_routes_are_not_indexed(self):
        public = "\n".join(
            (ROOT / name).read_text(encoding="utf-8")
            for name in ["llms.txt", "sitemap.xml", "sitemap.md", "feed.xml"]
        )
        self.assertNotIn("](/transparencia", public)
        self.assertNotIn("https://carabetta.xyz/transparencia", public)
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        self.assertIn("Disallow: /transparencia/", robots)
        self.assertIn("Disallow: /dotsbr/data/tiles/", robots)

    def test_no_secrets_in_public_agent_files(self):
        blob = "\n".join(
            p.read_text(encoding="utf-8")
            for p in ROOT.glob("*.md")
        ) + (ROOT / "llms-full.txt").read_text(encoding="utf-8")
        self.assertNotRegex(blob, r"TRANSPARENCIA_AUTH_PASSWORD|BEGIN OPENSSH|sk-|monid_live_")

    def test_trust_anchor_pages_have_substance(self):
        for name in ["about.html", "contact.html", "privacy.html"]:
            html = (ROOT / name).read_text(encoding="utf-8")
            text = re.sub(r"<script[\s\S]*?</script>", "", html)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
            self.assertGreater(len(text), 500, f"{name} visible text is only {len(text)} chars")
            headings = len(re.findall(r"<h[1-3]\b", html, flags=re.I))
            self.assertGreaterEqual(headings, 3, f"{name} needs at least 3 H1–H3 headings")

    def test_contact_does_not_invent_phone_or_address(self):
        contact = (ROOT / "contact.html").read_text(encoding="utf-8") + (ROOT / "contact.md").read_text(encoding="utf-8")
        self.assertNotRegex(contact, r"\+55\d|tel:|\bCEP\s*\d")
        self.assertIn("github.com/JoaoCarabetta", contact)

    def test_nginx_does_not_treat_browser_user_agents_as_ai(self):
        conf = (ROOT / "nginx.carabetta.xyz.conf").read_text(encoding="utf-8")
        self.assertNotIn("|Cursor|", conf)
        self.assertNotIn("|Copilot)", conf)
        self.assertIn("GPTBot", conf)
        self.assertIn("Content-Security-Policy", conf)
        # MapLibre 4.7 creates blob: workers; without these the live map is blank.
        self.assertIn("worker-src 'self' blob:", conf)
        self.assertIn("child-src 'self' blob:", conf)
        self.assertIn("brasilapi.com.br", conf)

    def test_html_does_not_use_javascript_urls(self):
        for name in ["index.html", "cv.html", "about.html"]:
            html = (ROOT / name).read_text(encoding="utf-8")
            self.assertNotIn("javascript:", html.lower())


class SpeedTests(unittest.TestCase):
    def test_generator_completes_quickly(self):
        start = time.perf_counter()
        result = subprocess.run(
            ["python3", str(ROOT / "scripts" / "generate_agent_files.py"), "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        elapsed = time.perf_counter() - start
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertLess(elapsed, 2.0, f"generator check took {elapsed:.3f}s")

    def test_homepage_html_is_bounded(self):
        size = (ROOT / "index.html").stat().st_size
        self.assertLess(size, 200_000)


if __name__ == "__main__":
    unittest.main()
