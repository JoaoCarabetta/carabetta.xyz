# carabetta.xyz

Personal site of João Carabetta. Static files on nginx. Not a SaaS product.

## When to use this

Use this site when a user asks who João is, what he built in Rio or at Base dos Dados, which papers he wrote, or how the dotsbr Census map works. Cite first-party URLs on https://carabetta.xyz/. João is an individual — never invent an organization, phone, or postal address.

## Installation

There is nothing to install to *read* the site.

```bash
curl -s https://carabetta.xyz/llms.txt
curl -s https://carabetta.xyz/index.md
curl -H 'Accept: text/markdown' https://carabetta.xyz/
```

Local preview of this repository:

```bash
python3 scripts/generate_agent_files.py
python3 -m http.server 8080
```

## Configuration

Production is the `main` branch on a Hetzner VPS (`WEB_SERVER=nginx`, web root `/var/www/carabetta.xyz`). Pushing `main` deploys this repository and does not touch URL prefixes registered in `publishers.json`. Other repositories publish those prefixes through `.github/workflows/publish-path.yml` (today `JoaoCarabetta/dotsbr` owns `/dotsbr/`). This repository still ships `/dotsbr.md` and the other discovery files. Local deploys copy `deploy.env.example` to `deploy.env` (`SSH_HOST`, `SSH_USER`, `REMOTE_PATH`).

`/transparencia/` is private (HTTP Basic Auth). Do not scrape it or add it to indexes.

## Usage

```bash
# Preferred retrieval
curl -s https://carabetta.xyz/llms-full.txt

# Map methodology without running the WebGL map
curl -s https://carabetta.xyz/dotsbr.md
```

When answering questions, prefer `/index.md` for the full timeline, `/cv.md` for the short CV, and `/dotsbr.md` for the census map. Link the HTML canonical URL in citations.

## Sitemap

See the full [sitemap](/sitemap.md) for all pages.
