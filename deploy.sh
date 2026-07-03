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
CADDYFILE_PATH="${CADDYFILE_PATH:-/etc/caddy/Caddyfile}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-carabetta.xyz}"
NGINX_AVAILABLE="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
SSH_TARGET="${SSH_USER}@${SSH_HOST}"

echo "Deploying site files to ${SSH_TARGET}:${REMOTE_PATH}"
rsync -avz --delete \
  --exclude '.git/' \
  --exclude 'deploy.env' \
  --exclude 'deploy.env.example' \
  --exclude 'deploy.sh' \
  --exclude 'setup-vps.sh' \
  --exclude 'finish-dns.sh' \
  --exclude 'Caddyfile' \
  --exclude 'nginx.carabetta.xyz.conf' \
  --exclude 'nginx.carabetta.xyz.http.conf' \
  --exclude 'README.md' \
  --exclude '.gitignore' \
  "${ROOT_DIR}/" "${SSH_TARGET}:${REMOTE_PATH}/"

if [[ "${WEB_SERVER}" == "nginx" ]]; then
  ssh "${SSH_TARGET}" "chown -R www-data:www-data ${REMOTE_PATH}"
fi

if [[ "${WEB_SERVER}" == "nginx" ]]; then
  echo "Updating nginx site config on ${SSH_TARGET}"
  if ssh "${SSH_TARGET}" "test -f /etc/letsencrypt/live/carabetta.xyz/fullchain.pem"; then
    rsync -avz "${ROOT_DIR}/nginx.carabetta.xyz.conf" "${SSH_TARGET}:${NGINX_AVAILABLE}"
  else
    rsync -avz "${ROOT_DIR}/nginx.carabetta.xyz.http.conf" "${SSH_TARGET}:${NGINX_AVAILABLE}"
  fi
  ssh "${SSH_TARGET}" "ln -sf ${NGINX_AVAILABLE} ${NGINX_ENABLED} && nginx -t && systemctl reload nginx"
elif [[ -f "${ROOT_DIR}/Caddyfile" ]]; then
  echo "Updating Caddyfile on ${SSH_TARGET}"
  rsync -avz "${ROOT_DIR}/Caddyfile" "${SSH_TARGET}:${CADDYFILE_PATH}"
  ssh "${SSH_TARGET}" "caddy validate --config ${CADDYFILE_PATH} && systemctl reload caddy"
fi

echo "Deploy complete."
