#!/usr/bin/env bash
# Launch deepl-mcp-server with DEEPL_API_KEY from the project .env (or the environment).
# Grok expands ${VAR} from the process env only — it does not load project .env files.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "${ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/.env"
  set +a
fi

if [[ -z "${DEEPL_API_KEY:-}" ]]; then
  echo "DEEPL_API_KEY is not set. Add it to ${ROOT}/.env or export it in your shell." >&2
  exit 1
fi

exec bunx deepl-mcp-server "$@"
