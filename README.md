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
cp .env.docker.example .env
./scripts/prepare-compose.sh   # Windows: .\scripts\prepare-compose.ps1
docker compose up -d
```

Default UI: `http://localhost` · API health: `http://localhost:8080/health`

Full guide: [`docs/DOCKER-QUICKSTART.md`](docs/DOCKER-QUICKSTART.md)

Development mode (infra only, app on host):

```bash
docker compose -f docker-compose.dev.yml up
```

See [`docs/LITE.md`](docs/LITE.md) and [`README_WEKNORA.md`](README_WEKNORA.md) for full upstream documentation.

## SCP corpus slot

Pre-seeded planning glossary (**90 terms**: MRP / APS / S&OP / TOC) for interview prep and agent demos:

| Resource | Description |
|---|---|
| [`data/scp-corpus/glossary.md`](data/scp-corpus/glossary.md) | Bilingual definitions + 30s speakable scripts |
| [`data/scp-corpus/README.md`](data/scp-corpus/README.md) | Ingest steps and chunking guidance |
| [`data/scp-corpus/manifest.json`](data/scp-corpus/manifest.json) | Corpus metadata for tooling |

Import through the knowledge-base UI or your own ingest pipeline.

## Architecture

High-level SCP RAG flow:

```
Planning docs / glossary  →  ingest  →  chunk + embed  →  vector store
                                                              ↓
Agent / planner  ←  MCP or HTTP API  ←  retrieve + rerank  ←  query
```

**Full write-up:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — corpus design, agent harness wiring, deployment modes.

| Component | Location |
|---|---|
| Go backend + agents | `internal/`, `cmd/server/` |
| Web UI | `frontend/` |
| MCP server | `mcp-server/` |
| SCP corpus slot | `data/scp-corpus/` |
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
