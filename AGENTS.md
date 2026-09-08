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

Production is the `main` branch, deployed with `./deploy.sh` to a Hetzner VPS (`WEB_SERVER=nginx`). Copy `deploy.env.example` to `deploy.env` and set `SSH_HOST`, `SSH_USER`, and `REMOTE_PATH`. The live `/dotsbr/` HTML is owned by the sibling `dotsbr` / `dotmap` repository; this repo still ships `/dotsbr.md` and discovery files.

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
