#!/usr/bin/env bash
# Prepare local Docker Compose: .env + frontend/dist + compose config check
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  if [[ -f .env.docker.example ]]; then
    cp .env.docker.example .env
    echo "[prepare-compose] created .env from .env.docker.example"
  elif [[ -f .env.example ]]; then
    cp .env.example .env
    echo "[prepare-compose] created .env from .env.example (prefer .env.docker.example for compose)"
  else
    echo "[prepare-compose] error: no .env.docker.example or .env.example" >&2
    exit 1
  fi
fi

if [[ ! -d frontend/dist ]] || [[ -z "$(ls -A frontend/dist 2>/dev/null || true)" ]]; then
  echo "[prepare-compose] building frontend/dist..."
  "$SCRIPT_DIR/build_frontend_dist.sh"
else
  echo "[prepare-compose] frontend/dist already present"
fi

if command -v docker >/dev/null 2>&1; then
  docker compose config >/dev/null
  echo "[prepare-compose] docker compose config OK"
else
  echo "[prepare-compose] docker not in PATH — skipped compose config (install Docker Desktop to run up)"
fi

echo "[prepare-compose] ready: docker compose up -d"
