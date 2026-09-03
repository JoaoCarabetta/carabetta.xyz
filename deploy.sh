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
NGINX_HTPASSWD="/etc/nginx/.htpasswd-transparencia"
NGINX_AUTH_SNIPPET="/etc/nginx/snippets/transparencia-auth.conf"
CADDY_AUTH_SNIPPET="/etc/caddy/transparencia-auth.caddy"
SSH_TARGET="${SSH_USER}@${SSH_HOST}"
TRANSPARENCIA_AUTH_USER="${TRANSPARENCIA_AUTH_USER:-transparencia}"

deploy_transparencia_auth() {
  local tmp_htpasswd tmp_caddy tmp_nginx
  tmp_htpasswd="$(mktemp)"
  tmp_caddy="$(mktemp)"
  tmp_nginx="$(mktemp)"

  if [[ -z "${TRANSPARENCIA_AUTH_PASSWORD:-}" ]]; then
    echo "TRANSPARENCIA_AUTH_PASSWORD not set; /transparencia/ will be public." >&2
    echo "# no auth configured" > "${tmp_caddy}"
    echo "# no auth configured" > "${tmp_nginx}"
  else
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
      caddy_hash="$(ssh "${SSH_TARGET}" "caddy hash-password --plaintext '${TRANSPARENCIA_AUTH_PASSWORD}'" 2>/dev/null || true)"
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
    rsync -avz "${tmp_htpasswd}" "${SSH_TARGET}:${NGINX_HTPASSWD}"
    ssh "${SSH_TARGET}" "chmod 640 ${NGINX_HTPASSWD} && chown root:www-data ${NGINX_HTPASSWD}"
  fi

  ssh "${SSH_TARGET}" "mkdir -p /etc/nginx/snippets"
  rsync -avz "${tmp_nginx}" "${SSH_TARGET}:${NGINX_AUTH_SNIPPET}"
  if [[ "${WEB_SERVER}" == "caddy" ]]; then
    ssh "${SSH_TARGET}" "mkdir -p /etc/caddy"
    rsync -avz "${tmp_caddy}" "${SSH_TARGET}:${CADDY_AUTH_SNIPPET}"
  fi
  rm -f "${tmp_htpasswd}" "${tmp_htpasswd}.line" "${tmp_caddy}" "${tmp_nginx}"
}

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
  --exclude 'dataviz/brazildots/tiles/' \
  "${ROOT_DIR}/" "${SSH_TARGET}:${REMOTE_PATH}/"

echo "Starting brazildots tileserver (docker compose)"
ssh "${SSH_TARGET}" "rm -rf ${REMOTE_PATH}/dataviz/brazildots/tiles && cd ${REMOTE_PATH}/dataviz/brazildots && docker compose up -d --force-recreate --remove-orphans && for i in \$(seq 1 30); do curl -sf http://127.0.0.1:8088/data/censo2022.json >/dev/null && exit 0; sleep 2; done; echo 'tileserver did not become ready' >&2; docker compose logs --tail 50; exit 1"

deploy_transparencia_auth

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
