#!/usr/bin/env bash
# Publish one registered prefix to carabetta.xyz. Does not reload nginx.
# The full-site deploy (deploy.sh) owns the vhost; this script only rsyncs
# a directory that publishers.json assigns to another repository.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Local runs read deploy.env. CI exports SSH_* and must not require the file.
if [[ -f "${PWD}/deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "${PWD}/deploy.env"
elif [[ -f "${ROOT_DIR}/deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "${ROOT_DIR}/deploy.env"
fi

# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib-ssh.sh"

PUBLISHERS_FILE="${PUBLISHERS_FILE:-${ROOT_DIR}/publishers.json}"
PUBLISH_PATH="${PUBLISH_PATH:?PUBLISH_PATH is required (for example dotsbr)}"
PUBLISH_SOURCE="${PUBLISH_SOURCE:-.}"
WEB_SERVER="${WEB_SERVER:-nginx}"

caller="${PUBLISH_CALLER:-${GITHUB_REPOSITORY:-}}"
meta="$(
  python3 "${SCRIPT_DIR}/site_publish.py" check \
    --registry "${PUBLISHERS_FILE}" \
    --path "${PUBLISH_PATH}" \
    --caller "${caller}"
)"

path=""
remote_root=""
preserves=()
while IFS= read -r line; do
  case "${line}" in
    path=*) path="${line#path=}" ;;
    remote_root=*) remote_root="${line#remote_root=}" ;;
    repo=*) ;;
    preserve=*) preserves+=("${line#preserve=}") ;;
    *)
      echo "unexpected registry line: ${line}" >&2
      exit 1
      ;;
  esac
done <<< "${meta}"

if [[ -z "${path}" || -z "${remote_root}" ]]; then
  echo "registry check did not return path and remote_root" >&2
  exit 1
fi

REMOTE_PATH="${REMOTE_PATH:-${remote_root}}"
REMOTE_PATH="${REMOTE_PATH%/}"
dest="${REMOTE_PATH}/${path}"

if [[ "${PUBLISH_SOURCE}" = /* ]]; then
  source_dir="${PUBLISH_SOURCE}"
else
  source_dir="${PWD}/${PUBLISH_SOURCE}"
fi
if [[ ! -d "${source_dir}" ]]; then
  echo "source directory not found: ${source_dir}" >&2
  exit 1
fi

include_files=()
if [[ -n "${PUBLISH_INCLUDE:-}" ]]; then
  while IFS= read -r rel || [[ -n "${rel}" ]]; do
    rel="${rel%%#*}"
    rel="${rel#"${rel%%[![:space:]]*}"}"
    rel="${rel%"${rel##*[![:space:]]}"}"
    rel="${rel//$'\r'/}"
    [[ -z "${rel}" ]] && continue
    # Allow either newlines or commas in the workflow input.
    IFS=',' read -r -a parts <<< "${rel}"
    for part in "${parts[@]}"; do
      part="${part#"${part%%[![:space:]]*}"}"
      part="${part%"${part##*[![:space:]]}"}"
      [[ -z "${part}" ]] && continue
      if [[ "${part}" == /* || "${part}" == *".."* ]]; then
        echo "refusing include path: ${part}" >&2
        exit 1
      fi
      if [[ ! -f "${source_dir}/${part}" ]]; then
        echo "include file not found: ${source_dir}/${part}" >&2
        exit 1
      fi
      include_files+=("${part}")
    done
  done <<< "${PUBLISH_INCLUDE}"
fi

if [[ -n "${PUBLISH_DELETE:-}" ]]; then
  do_delete="${PUBLISH_DELETE}"
elif [[ ${#include_files[@]} -gt 0 ]]; then
  do_delete=0
else
  do_delete=1
fi

: "${SSH_HOST:?SSH_HOST is required (deploy.env or CI environment)}"
: "${SSH_USER:?SSH_USER is required (deploy.env or CI environment)}"
SSH_TARGET="${SSH_USER}@${SSH_HOST}"

echo "publish path=/${path}/ source=${source_dir} dest=${SSH_TARGET}:${dest} delete=${do_delete}"
if [[ ${#preserves[@]} -gt 0 ]]; then
  printf 'preserve=%s\n' "${preserves[@]}"
fi
if [[ ${#include_files[@]} -gt 0 ]]; then
  printf 'include=%s\n' "${include_files[@]}"
fi

if [[ "${DRY_RUN:-}" == "1" ]]; then
  echo "DRY_RUN: not contacting ${SSH_HOST}"
  exit 0
fi

ssh_cmd "${SSH_TARGET}" "mkdir -p '${dest}'"

if [[ ${#include_files[@]} -gt 0 ]]; then
  # Relative paths keep subdirectories. No --delete: unlisted files (tiles,
  # server-only leftovers) stay where they are.
  (
    cd "${source_dir}"
    # shellcheck disable=SC2086
    rsync -avz --relative -e "$(rsync_ssh)" \
      "${include_files[@]}" \
      "${SSH_TARGET}:${dest}/"
  )
else
  exclude_args=(
    --exclude '.git/'
    --exclude '.github/'
    --exclude '.cursor/'
    --exclude 'deploy.env'
    --exclude 'deploy.env.example'
    --exclude 'node_modules/'
    --exclude '**/__pycache__/'
  )
  for pattern in "${preserves[@]}"; do
    exclude_args+=(--exclude "${pattern}")
  done
  delete_args=()
  if [[ "${do_delete}" == "1" ]]; then
    delete_args+=(--delete)
  fi
  rsync -avz "${delete_args[@]}" "${exclude_args[@]}" -e "$(rsync_ssh)" \
    "${source_dir}/" "${SSH_TARGET}:${dest}/"
fi

if [[ "${WEB_SERVER}" == "nginx" ]]; then
  ssh_cmd "${SSH_TARGET}" "chown -R www-data:www-data '${dest}'"
fi

echo "Published https://carabetta.xyz/${path}/"
