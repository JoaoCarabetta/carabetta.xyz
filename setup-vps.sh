#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT_DIR}/deploy.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy deploy.env.example and fill in your VPS details." >&2
  exit 1
fi

# shellcheck disable=SC1090
source "${ENV_FILE}"

: "${SSH_HOST:?SSH_HOST is required}"
: "${SSH_USER:?SSH_USER is required}"
: "${REMOTE_PATH:?REMOTE_PATH is required}"

WEB_SERVER="${WEB_SERVER:-caddy}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-carabetta.xyz}"
NGINX_AVAILABLE="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
CADDYFILE_PATH="${CADDYFILE_PATH:-/etc/caddy/Caddyfile}"
SSH_TARGET="${SSH_USER}@${SSH_HOST}"

echo "Setting up ${SSH_TARGET} for carabetta.xyz (${WEB_SERVER})"

ssh "${SSH_TARGET}" "mkdir -p ${REMOTE_PATH} && chown -R www-data:www-data ${REMOTE_PATH}"

if [[ "${WEB_SERVER}" == "nginx" ]]; then
  rsync -avz "${ROOT_DIR}/nginx.carabetta.xyz.http.conf" "${SSH_TARGET}:${NGINX_AVAILABLE}"
  ssh "${SSH_TARGET}" "ln -sf ${NGINX_AVAILABLE} ${NGINX_ENABLED} && nginx -t && systemctl reload nginx"

  if ssh "${SSH_TARGET}" "command -v certbot >/dev/null 2>&1"; then
    ssh "${SSH_TARGET}" \
      "certbot --nginx -d carabetta.xyz -d www.carabetta.xyz --non-interactive --agree-tos -m joao.carabetta@gmail.com --redirect" \
      && rsync -avz "${ROOT_DIR}/nginx.carabetta.xyz.conf" "${SSH_TARGET}:${NGINX_AVAILABLE}" \
      && ssh "${SSH_TARGET}" "nginx -t && systemctl reload nginx" \
      || echo "Certbot skipped or failed. Update DNS first, then rerun setup-vps.sh."
  else
    echo "certbot not installed on server; HTTPS step skipped."
  fi
else
  ssh "${SSH_TARGET}" bash -s <<'EOF'
set -euo pipefail

if ! command -v caddy >/dev/null 2>&1; then
  apt-get update
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update
  apt-get install -y caddy
fi

if command -v ufw >/dev/null 2>&1; then
  ufw allow 80/tcp || true
  ufw allow 443/tcp || true
fi

systemctl enable --now caddy
EOF

  rsync -avz "${ROOT_DIR}/Caddyfile" "${SSH_TARGET}:${CADDYFILE_PATH}"
  ssh "${SSH_TARGET}" "caddy validate --config ${CADDYFILE_PATH} && systemctl reload caddy"
fi

echo "VPS setup complete."
