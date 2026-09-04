#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT_DIR}/deploy.env"

# Local deploys read deploy.env. GitHub Actions exports SSH_* instead.
if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
fi

: "${SSH_HOST:?SSH_HOST is required (deploy.env or CI environment)}"
: "${SSH_USER:?SSH_USER is required (deploy.env or CI environment)}"
: "${REMOTE_PATH:?REMOTE_PATH is required (deploy.env or CI environment)}"

WEB_SERVER="${WEB_SERVER:-caddy}"
CADDYFILE_PATH="${CADDYFILE_PATH:-/etc/caddy/Caddyfile}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-carabetta.xyz}"
NGINX_AVAILABLE="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
NGINX_HTPASSWD="/etc/nginx/.htpasswd-transparencia"
NGINX_AUTH_SNIPPET="/etc/nginx/snippets/transparencia-auth.conf"
CADDY_AUTH_SNIPPET="/etc/caddy/transparencia-auth.caddy"
SSH_TARGET="${SSH_USER}@${SSH_HOST}"
TRANSPARENCIA_AUTH_USER="${TRANSPARENCIA_AUTH_USER:-transparencia}"

# Optional extra identity for CI; a local ssh config alias still works without this.
ssh_cmd() {
  if [[ -n "${SSH_IDENTITY_FILE:-}" ]]; then
    command ssh -i "${SSH_IDENTITY_FILE}" -o StrictHostKeyChecking=accept-new "$@"
  else
    command ssh "$@"
  fi
}

rsync_ssh() {
  if [[ -n "${SSH_IDENTITY_FILE:-}" ]]; then
    echo "ssh -i ${SSH_IDENTITY_FILE} -o StrictHostKeyChecking=accept-new"
  else
    echo "ssh"
  fi
}

deploy_transparencia_auth() {
  local tmp_htpasswd tmp_caddy tmp_nginx
  tmp_htpasswd="$(mktemp)"
  tmp_caddy="$(mktemp)"
  tmp_nginx="$(mktemp)"

  if [[ -z "${TRANSPARENCIA_AUTH_PASSWORD:-}" ]]; then
    # CI often has no password. Do not overwrite a live htpasswd with "public".
    echo "TRANSPARENCIA_AUTH_PASSWORD not set; leaving existing /transparencia/ auth in place."
    rm -f "${tmp_htpasswd}" "${tmp_htpasswd}.line" "${tmp_caddy}" "${tmp_nginx}"
    return 0
  fi

  if ! openssl passwd -apr1 "${TRANSPARENCIA_AUTH_PASSWORD}" > "${tmp_htpasswd}.line" 2>/dev/null; then
    echo "Failed to hash TRANSPARENCIA_AUTH_PASSWORD with openssl." >&2
    exit 1
  fi
  echo "${TRANSPARENCIA_AUTH_USER}:$(cat "${tmp_htpasswd}.line")" > "${tmp_htpasswd}"

  cat > "${tmp_nginx}" <<EOF
auth_basic "Transparência";
auth_basic_user_file ${NGINX_HTPASSWD};
EOF

  if [[ "${WEB_SERVER}" == "caddy" ]]; then
    local caddy_hash
    caddy_hash="$(ssh_cmd "${SSH_TARGET}" "caddy hash-password --plaintext '${TRANSPARENCIA_AUTH_PASSWORD}'" 2>/dev/null || true)"
    if [[ -z "${caddy_hash}" ]]; then
      caddy_hash="$(printf '%s' "${TRANSPARENCIA_AUTH_PASSWORD}" | caddy hash-password --plaintext - 2>/dev/null || true)"
    fi
    if [[ -z "${caddy_hash}" ]]; then
      echo "Could not generate Caddy password hash (install caddy locally or on the server)." >&2
      exit 1
    fi

    cat > "${tmp_caddy}" <<EOF
@transparencia path /transparencia /transparencia/*
basicauth @transparencia {
    ${TRANSPARENCIA_AUTH_USER} ${caddy_hash}
}
EOF
  else
    echo "# nginx handles auth" > "${tmp_caddy}"
  fi

  echo "Password protection enabled for /transparencia/ (user: ${TRANSPARENCIA_AUTH_USER})"
  rsync -avz -e "$(rsync_ssh)" "${tmp_htpasswd}" "${SSH_TARGET}:${NGINX_HTPASSWD}"
  ssh_cmd "${SSH_TARGET}" "chmod 640 ${NGINX_HTPASSWD} && chown root:www-data ${NGINX_HTPASSWD}"

  ssh_cmd "${SSH_TARGET}" "mkdir -p /etc/nginx/snippets"
  rsync -avz -e "$(rsync_ssh)" "${tmp_nginx}" "${SSH_TARGET}:${NGINX_AUTH_SNIPPET}"
  if [[ "${WEB_SERVER}" == "caddy" ]]; then
    ssh_cmd "${SSH_TARGET}" "mkdir -p /etc/caddy"
    rsync -avz -e "$(rsync_ssh)" "${tmp_caddy}" "${SSH_TARGET}:${CADDY_AUTH_SNIPPET}"
  fi
  rm -f "${tmp_htpasswd}" "${tmp_htpasswd}.line" "${tmp_caddy}" "${tmp_nginx}"
}

# Keep the ~700MB archives if they already live under the old slug.
echo "Migrating PMTiles from /dataviz/brazildots/ to /dotsbr/ if needed"
ssh_cmd "${SSH_TARGET}" "bash -s" <<EOF
set -euo pipefail
old="${REMOTE_PATH}/dataviz/brazildots/data/tiles"
new="${REMOTE_PATH}/dotsbr/data/tiles"
if [[ -d "\${old}" && ! -e "\${new}/censo2022.pmtiles" ]]; then
  mkdir -p "${REMOTE_PATH}/dotsbr/data"
  mv "\${old}" "\${new}"
fi
mkdir -p "\${new}"
EOF

echo "Deploying site files to ${SSH_TARGET}:${REMOTE_PATH}"
# --delete would wipe the live map HTML/share card that CI uploads from the
# dotsbr repo (this tree still carries a stale dotsbr/index.html).
rsync -avz --delete -e "$(rsync_ssh)" \
  --exclude '.git/' \
  --exclude '.github/' \
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
  --exclude 'dotsbr/tiles/' \
  --exclude 'dotsbr/data/*.mbtiles' \
  --exclude 'dotsbr/data/tiles/' \
  --exclude 'dotsbr/index.html' \
  --exclude 'dotsbr/og.html' \
  --exclude 'dotsbr/og.jpg' \
  --exclude 'dotsbr/card.jpg' \
  --exclude 'dotsbr/favicon.svg' \
  --exclude 'dotsbr/favicon.ico' \
  --exclude 'dotsbr/apple-touch-icon.png' \
  --exclude 'dataviz/brazildots/tiles/' \
  --exclude 'dataviz/brazildots/data/*.mbtiles' \
  --exclude 'dataviz/brazildots/data/tiles/' \
  "${ROOT_DIR}/" "${SSH_TARGET}:${REMOTE_PATH}/"

# Archives are gitignored (~700MB). Local deploys sync from the sibling
# dotmap repo; CI sets SKIP_TILES=1 so it does not fail without them.
DOTMAP_TILES="${DOTMAP_TILES:-${ROOT_DIR}/../dotmap/data/tiles}"
if [[ "${SKIP_TILES:-}" == "1" ]]; then
  echo "SKIP_TILES=1: leaving existing PMTiles on the server"
elif [[ -f "${DOTMAP_TILES}/censo2022.pmtiles" ]]; then
  echo "Syncing PMTiles from ${DOTMAP_TILES}"
  ssh_cmd "${SSH_TARGET}" "mkdir -p ${REMOTE_PATH}/dotsbr/data/tiles"
  rsync -avz --progress -e "$(rsync_ssh)" \
    "${DOTMAP_TILES}/censo2022.pmtiles" \
    "${DOTMAP_TILES}/censo2022_income.pmtiles" \
    "${DOTMAP_TILES}/censo2022_deaths.pmtiles" \
    "${DOTMAP_TILES}/hover.pmtiles" \
    "${SSH_TARGET}:${REMOTE_PATH}/dotsbr/data/tiles/"
else
  echo "No local PMTiles at ${DOTMAP_TILES}; leaving whatever is already on the server"
fi

echo "Stopping leftover brazildots tileserver (dots are static PMTiles now)"
ssh_cmd "${SSH_TARGET}" "if [[ -f ${REMOTE_PATH}/dotsbr/docker-compose.yml ]]; then cd ${REMOTE_PATH}/dotsbr && docker compose down --remove-orphans || true; fi; if [[ -f ${REMOTE_PATH}/dataviz/brazildots/docker-compose.yml ]]; then cd ${REMOTE_PATH}/dataviz/brazildots && docker compose down --remove-orphans || true; fi"

deploy_transparencia_auth

if [[ "${WEB_SERVER}" == "nginx" ]]; then
  ssh_cmd "${SSH_TARGET}" "chown -R www-data:www-data ${REMOTE_PATH}"
fi

if [[ "${WEB_SERVER}" == "nginx" ]]; then
  echo "Updating nginx site config on ${SSH_TARGET}"
  if ssh_cmd "${SSH_TARGET}" "test -f /etc/letsencrypt/live/carabetta.xyz/fullchain.pem"; then
    rsync -avz -e "$(rsync_ssh)" "${ROOT_DIR}/nginx.carabetta.xyz.conf" "${SSH_TARGET}:${NGINX_AVAILABLE}"
  else
    rsync -avz -e "$(rsync_ssh)" "${ROOT_DIR}/nginx.carabetta.xyz.http.conf" "${SSH_TARGET}:${NGINX_AVAILABLE}"
  fi
  ssh_cmd "${SSH_TARGET}" "ln -sf ${NGINX_AVAILABLE} ${NGINX_ENABLED} && nginx -t && systemctl reload nginx"
elif [[ -f "${ROOT_DIR}/Caddyfile" ]]; then
  echo "Updating Caddyfile on ${SSH_TARGET}"
  rsync -avz -e "$(rsync_ssh)" "${ROOT_DIR}/Caddyfile" "${SSH_TARGET}:${CADDYFILE_PATH}"
  ssh_cmd "${SSH_TARGET}" "caddy validate --config ${CADDYFILE_PATH} && systemctl reload caddy"
fi

echo "Deploy complete."
