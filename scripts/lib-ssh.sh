# Shared SSH helpers for deploy.sh and publish-path.sh.
# A local identity file is optional; GitHub Actions uses ssh-agent instead.

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
