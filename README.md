# Supply Chain Planning Knowledge Hub

**Domain RAG for supply chain planning** — MRP, APS, S&OP, and TOC terminology and documents, built on a [WeKnora](https://github.com/Tencent/WeKnora)-derived stack.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What this is

A **WeKnora fork** customized for **supply chain planning knowledge**:

- Ingest planning glossaries and documents (MRP / MPS / S&OP / TOC)
- Chunk, embed, and retrieve through Milvus / Elasticsearch / pgvector (configurable)
- Expose RAG to agents via HTTP and MCP — so models look up domain terms instead of carrying them in the prompt

This repo is the public codebase derived from internal `weknora-knowledgehub` work. Upstream feature docs: [`README_WEKNORA.md`](README_WEKNORA.md).

## Quick start (Docker Compose)

```bash
cp .env.example .env
# Edit .env — set LLM / embedding API keys

docker compose up -d
```

Default UI: `http://localhost` (see `.env` for `FRONTEND_PORT` / `APP_PORT`).

Development mode:

```bash
docker compose -f docker-compose.dev.yml up
```

See [`docs/LITE.md`](docs/LITE.md) and [`README_WEKNORA.md`](README_WEKNORA.md) for full upstream documentation.

## SCP corpus slot

Pre-seeded planning glossary (interview / agent demo):

```
data/scp-corpus/glossary.md
```

Import through the knowledge-base UI or your own ingest pipeline.

## Architecture (high level)

```
Planning docs / glossary  →  ingest  →  chunk + embed  →  vector store
                                                              ↓
Agent / planner  ←  MCP or HTTP API  ←  retrieve + rerank  ←  query
```

| Component | Location |
|---|---|
| Go backend + agents | `internal/`, `cmd/server/` |
| Web UI | `frontend/` |
| MCP server | `mcp-server/` |
| Docker / Helm | `docker-compose.yml`, `helm/` |
| Custom fork notes | [`CUSTOM_CHANGES.md`](CUSTOM_CHANGES.md), [`README-CUSTOM.md`](README-CUSTOM.md) |

## Sync with upstream WeKnora

```bash
git remote add upstream https://github.com/Tencent/WeKnora.git   # once
./sync-upstream.sh
```

Details: [`SYNC_UPSTREAM.md`](SYNC_UPSTREAM.md)

## Related public work

- [`pixi-gantt`](https://github.com/mizuno0237/pixi-gantt) — Canvas scheduling UI
- [`scp-planning-copilot`](https://github.com/mizuno0237/scp-planning-copilot) *(planned)* — Vue 3 + Vercel AI SDK copilot

## License

MIT — see [LICENSE](LICENSE). Derived from [Tencent WeKnora](https://github.com/Tencent/WeKnora) (MIT).
