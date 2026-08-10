# Docker Compose quickstart (supply-chain-knowledge-hub)

Public fork sprint **D2** deliverable: run **frontend + backend + Postgres vector store + Redis + docreader** locally with one command.

## Prerequisites

- Docker Desktop 4.x+ (Windows / macOS) or Docker Engine + Compose v2 (Linux)
- ~8 GB free RAM for first `up` (image pull + optional local build)
- Node.js 20+ only if you build the UI from source (CI and `prepare-compose` scripts do this automatically)

## 1. Prepare environment

```bash
cp .env.docker.example .env
```

Edit `.env` if you need Ollama / OpenAI keys. **Do not** paste Langfuse placeholder keys — leave Langfuse vars commented unless you start the `langfuse` profile.

## 2. Build UI + start stack

**Linux / macOS / Git Bash:**

```bash
./scripts/prepare-compose.sh
docker compose up -d
```

**Windows PowerShell:**

```powershell
.\scripts\prepare-compose.ps1
docker compose up -d
```

`prepare-compose` ensures `.env` exists, builds `frontend/dist` when missing, and runs `docker compose config` as a syntax check.

## 3. Verify

| Check | Command |
|---|---|
| Compose services | `docker compose ps` |
| API health | `curl -sf http://localhost:8080/health` |
| Web UI | open `http://localhost` (or `FRONTEND_PORT`) |

Expected healthy services: `WeKnora-postgres`, `WeKnora-redis`, `WeKnora-docreader`, `WeKnora-app`, `WeKnora-frontend`.

## 4. Stop

```bash
docker compose down
```

Add `-v` to drop volumes (wipes DB data).

## Profiles (optional)

| Profile | Adds | When |
|---|---|---|
| `qdrant` | Qdrant vector DB | Switch `RETRIEVE_DRIVER=qdrant` |
| `minio` | Object storage | `STORAGE_TYPE=minio` |
| `langfuse` | Observability stack | LLM tracing in UI |

Example:

```bash
docker compose --profile qdrant up -d
```

## Troubleshooting

**`.env` missing** — Compose fails parsing `env_file`. Run `cp .env.docker.example .env`.

**Frontend build: `dist` not found** — Run `./scripts/build_frontend_dist.sh` or `prepare-compose`.

**App unhealthy / Langfuse errors** — Remove fake `LANGFUSE_*` keys from `.env` or start `--profile langfuse`.

**Port 80 in use** — Set `FRONTEND_PORT=8088` in `.env` and use `http://localhost:8088`.

## CI

`.github/workflows/compose-smoke.yml` runs on `main`: builds frontend, validates compose, pulls images, and smoke-tests `/health`.
