---
name: ship
description: Ships carabetta.xyz by committing/pushing/merging to main and deploying live with ./deploy.sh. Use when the user says "ship", "put live", "publish", "deploy the site", "ship it", or "make it live".
---

# Ship (carabetta.xyz)

Primary skill lives at `~/.cursor/skills/ship/SKILL.md` — follow that workflow.

## This repo

Push to `master` or `main` deploys production via GitHub Actions. A local `./deploy.sh` is still needed for the first PMTiles upload (or when the archives change):

```bash
# Requires deploy.env (from deploy.env.example): SSH_HOST, SSH_USER, REMOTE_PATH
chmod +x deploy.sh && ./deploy.sh
```

Never print secrets from `deploy.env`. If missing, stop and ask the user to create it.

## Verify live

Fetch https://carabetta.xyz/ (and www). Expect timeline markers (`everything, in order`, `timeline-filters`, `TIMELINE`); no `data-portal`.
