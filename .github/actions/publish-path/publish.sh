#!/usr/bin/env bash
# Entry point for the composite action. The implementation lives in
# scripts/publish-path.sh. GitHub checks out the action repository in full;
# if that layout ever changes, download the same files from the action ref.
set -euo pipefail

ACTION_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root=""
if candidate="$(cd "${ACTION_DIR}/../../.." && pwd)" \
  && [[ -f "${candidate}/scripts/publish-path.sh" && -f "${candidate}/publishers.json" ]]; then
  root="${candidate}"
fi

if [[ -z "${root}" ]]; then
  : "${ACTION_REPOSITORY:?ACTION_REPOSITORY is required when the action checkout has no repo root}"
  : "${ACTION_REF:?ACTION_REF is required when the action checkout has no repo root}"
  root="$(mktemp -d)"
  base="https://raw.githubusercontent.com/${ACTION_REPOSITORY}/${ACTION_REF}"
  mkdir -p "${root}/scripts"
  for rel in publishers.json scripts/site_publish.py scripts/lib-ssh.sh scripts/publish-path.sh; do
    curl -fsSL "${base}/${rel}" -o "${root}/${rel}"
  done
  chmod +x "${root}/scripts/publish-path.sh"
fi

exec bash "${root}/scripts/publish-path.sh"
