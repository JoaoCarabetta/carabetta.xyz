---
title: "Privacy — joão carabetta"
description: "How carabetta.xyz uses self-hosted analytics, what is not collected, and how private /transparencia/ routes are handled."
canonical_url: https://carabetta.xyz/privacy.html
md_url: https://carabetta.xyz/privacy.md
last_updated: 2026-09-07
doc_version: "1.0"
---

# Privacy

This page describes what carabetta.xyz actually does with data. It is a personal static site, not a product with accounts, logins, or a customer database. If a scanner or agent needs a privacy statement, this is the first-party source. It does not invent processors or retention periods that the site does not use.

## What this site collects

Public pages load a first-party analytics script from `https://analytics.carabetta.xyz/metrics.js` (self-hosted Umami). It records page views so João can see which public URLs are read. It is not Google Analytics, not an ad network, and not a cross-site tracker. Localhost sessions on dotsbr skip the script. The analytics host is on the same organizational domain as this site.

## What this site does not collect

There is no account system, no advertising pixels, no sale of personal data, and no public contact form. The site does not ask for a name, email, payment card, or phone number. Contact is limited to already-public social profiles. Server logs on the VPS may record standard request metadata (time, path, user-agent) as part of running nginx; those logs are operational, not a marketing list.

## Private routes

`/transparencia/` is an HTTP Basic Auth area for unpublished research drafts. It is disallowed in robots.txt and is not listed in sitemaps or llms.txt. Do not treat it as public content, do not cite it, and do not ask crawlers to index it. Failed auth returns 401.

## Map tiles

dotsbr Range-requests static PMTiles that hold Census aggregates, not individual records. The map may call Mapbox geocoding when a visitor searches for a place. That request is made by the visitor's browser to Mapbox, not stored as a profile on this site. Tile files are excluded from AI sitemaps because they are large binaries, not prose.

## Language preference

The EN/PT toggle stores `lang` in `localStorage` on the visitor's device only. Clearing site data removes it. The preference is not sent to analytics as an identifier.

## Sitemap

See the full [sitemap](/sitemap.md) for all pages.
