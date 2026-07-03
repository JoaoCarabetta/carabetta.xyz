#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT_DIR}/deploy.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}." >&2
  exit 1
fi

# shellcheck disable=SC1090
source "${ENV_FILE}"

EXPECTED_IP="$(ssh "${SSH_USER}@${SSH_HOST}" 'curl -4 -s ifconfig.me')"
CURRENT_IP="$(dig +short carabetta.xyz A | tail -1)"

echo "Expected IP (Hetzner VPS): ${EXPECTED_IP}"
echo "Current DNS A record:      ${CURRENT_IP:-<none>}"

if [[ "${CURRENT_IP}" != "${EXPECTED_IP}" ]]; then
  echo
  echo "DNS is not pointing at the Hetzner VPS yet."
  echo "Update Hostinger DNS A records for @ and www to ${EXPECTED_IP}, then rerun:"
  echo "  ./finish-dns.sh"
  exit 1
fi

echo "DNS looks correct. Requesting certificate..."
./setup-vps.sh
./deploy.sh

echo
echo "Checking https://carabetta.xyz"
curl -fsSI "https://carabetta.xyz" | sed -n '1,5p'

echo
echo "Checking www redirect"
curl -fsSI "https://www.carabetta.xyz" | sed -n '1,5p'

echo "DNS + HTTPS setup complete."
