# carabetta.xyz

Bilingual personal career timeline (EN/PT) with type and theme filters, deployed to a Hetzner VPS with Caddy and HTTPS.

## Local preview

Open `index.html` in a browser, or serve the directory locally:

```bash
python3 -m http.server 8080
```

## One-time VPS setup

From this repo:

```bash
cp deploy.env.example deploy.env
chmod +x setup-vps.sh deploy.sh
./setup-vps.sh
```

`setup-vps.sh` reads `deploy.env` and configures the server:

- `WEB_SERVER=caddy` for a clean VPS (installs Caddy, auto HTTPS)
- `WEB_SERVER=nginx` for a VPS that already runs nginx on ports 80/443

For a manual Caddy install on Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
sudo mkdir -p /var/www/carabetta.xyz
sudo systemctl enable --now caddy
```

## DNS

DNS for `carabetta.xyz` is on Hostinger (`ns1.dns-parking.com`). Point both records to your Hetzner VPS IP (`77.42.72.111` for the configured `hetzner-arv-public` host):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `77.42.72.111` |
| A | `www` | `77.42.72.111` |

Remove conflicting `AAAA` or `CNAME` records if present. After DNS propagates:

```bash
./finish-dns.sh
```

That script checks DNS, requests the Let's Encrypt certificate, deploys the HTTPS nginx config, and verifies the site.

## Deploy

`main` is production. A push to `main` runs `.github/workflows/deploy.yml` (rsync + nginx reload). `workflow_dispatch` deploys on demand. Do not point this workflow at the old `master` branch — it diverged and would ship stale HTML.

Local equivalent:

```bash
cp deploy.env.example deploy.env
# edit deploy.env with SSH_HOST, SSH_USER, REMOTE_PATH
chmod +x deploy.sh
./deploy.sh
```

Recommended: add an SSH config entry in `~/.ssh/config`:

```sshconfig
Host hetzner-carabetta
    HostName YOUR_VPS_IP
    User root
    IdentityFile ~/.ssh/your_key
```

Then set `SSH_HOST=hetzner-carabetta` in `deploy.env`.

## Dataviz

`/dotsbr/` is **dotsbr**, the Census 2022 dot map (raça and renda; óbitos tiles exist but are not in the switcher). Tiles are static PMTiles at `/dotsbr/data/tiles/*.pmtiles` (HTTP Range, no gzip). The old slug `/dataviz/brazildots/` 301s here. WhatsApp/Facebook crawlers hitting `/dotsbr/` get `og.html` (tiny Open Graph document) instead of the 120KB map page — see `nginx.carabetta.xyz.conf`.

Push to `main` deploys production via `.github/workflows/deploy.yml` (same as `./deploy.sh`). CI does not upload the ~700MB archives; run `./deploy.sh` once from a machine that has `../dotmap/data/tiles/*.pmtiles` when the tiles themselves change.

## Verify

- https://carabetta.xyz loads the landing page
- https://www.carabetta.xyz redirects to the apex domain
- https://carabetta.xyz/dotsbr/ loads the map
- https://carabetta.xyz/dataviz/brazildots/ redirects to `/dotsbr/`
- TLS certificate is valid
