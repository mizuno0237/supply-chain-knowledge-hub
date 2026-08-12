# Architecture — Supply Chain Planning Knowledge Hub

This document describes how the public fork positions **domain RAG for supply chain planning (SCP)** on top of the WeKnora stack. For upstream internals, see [`README_WEKNORA.md`](../README_WEKNORA.md).

## Problem

Planning agents and copilots fail in two predictable ways:

1. **Hallucinated domain language** — MRP, S&OP, finite scheduling, and TOC terms are used loosely unless the model can retrieve grounded definitions.
2. **Stale prompt stuffing** — embedding a 90-term glossary in every system prompt is expensive, hard to update, and brittle across agent versions.

This repo solves that with a **corpus slot + retrieval layer**: planners and agents query a knowledge base instead of carrying SCP vocabulary in context.

## System context

```
┌─────────────────────────────────────────────────────────────────┐
│  Agent harness (MPS / shop-floor / S&OP) or planning copilot  │
│  Skills + MCP tools over existing planning services             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / MCP retrieve
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Supply Chain Planning Knowledge Hub (this repo)                │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Web UI   │  │ Go API      │  │ MCP server (mcp-server/) │  │
│  │ frontend/│  │ cmd/server/ │  │ knowledge search tools   │  │
│  └──────────┘  └──────┬──────┘  └──────────────────────────┘  │
│                       │ ingest / chunk / embed / rerank         │
│                       ▼                                         │
│              Vector store (pgvector default in Compose)         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SCP corpus slot — data/scp-corpus/                             │
│  glossary.md (90 terms) + your planning PDFs / SOPs             │
└─────────────────────────────────────────────────────────────────┘
```

## Data flow

| Stage | What happens | Where |
|---|---|---|
| **Corpus** | Markdown glossary and planning documents live in `data/scp-corpus/` | [`data/scp-corpus/README.md`](../data/scp-corpus/README.md) |
| **Ingest** | Upload via knowledge-base UI or API; parser splits on headings | `internal/`, [`docs/CHUNKING.md`](CHUNKING.md) |
| **Embed** | Chunk text → embedding model → vector index | Configurable: pgvector / Milvus / Elasticsearch |
| **Retrieve** | Query → hybrid search + rerank → top-k chunks | [`docs/api/knowledge-search.md`](api/knowledge-search.md) |
| **Serve** | Agents call MCP or REST to fetch definitions before answering | `mcp-server/`, agent presets in `config/` |

## SCP corpus design

The pre-seeded [`glossary.md`](../data/scp-corpus/glossary.md) is structured for **RAG-friendly chunking**:

- Each term is a `###` heading block with **English**, **中文**, and a **30s interview script**.
- Recommended chunk boundary: **one term per chunk** (split on `###`).
- Six categories cover planning core, manufacturing/scheduling, inventory/demand, optimization, industry/systems, and TOC narrative — see [`manifest.json`](../data/scp-corpus/manifest.json).

Agents should retrieve **English definition + 中文** for bilingual teams; interview scripts are optional context for demo / training agents.

## Deployment modes

| Mode | Use when | Entry |
|---|---|---|
| **Docker Compose (full stack)** | Local demo, CI smoke, portfolio reviewers | [`docs/DOCKER-QUICKSTART.md`](DOCKER-QUICKSTART.md) |
| **Compose dev (infra only)** | Hacking Go/frontend on host | `docker-compose.dev.yml` |
| **Lite** | Minimal footprint / edge | [`docs/LITE.md`](LITE.md) |

Default Compose stack: **nginx frontend**, **Go app**, **Postgres + pgvector**, **Redis**, **docreader** (document parsing).

## Integration with agent harness

Typical wiring in an SCP agent harness:

1. Create a knowledge base named e.g. `scp-glossary`.
2. Ingest `data/scp-corpus/glossary.md`.
3. Register the hub MCP server or HTTP search endpoint on the agent.
4. Add a skill prompt line: *Before explaining planning terms, search the SCP knowledge base.*

This keeps **LLM training out of scope** — the harness owns retrieval, tool routing, and UI; the hub owns domain grounding.

## Security & public fork hygiene

- No `.env` with secrets in git — use `.env.docker.example` / `.env.example`.
- Run gitleaks before push (see sprint D1 notes in [`CUSTOM_CHANGES.md`](../CUSTOM_CHANGES.md)).
- Customer names in glossary scripts are **anonymized portfolio references**; replace placeholders like `【填入真实数字】` before live demos.

## Related repos

| Repo | Role |
|---|---|
| [`pixi-gantt`](https://github.com/mizuno0237/pixi-gantt) | Canvas scheduling UI for APS output |
| [`scp-planning-copilot`](https://github.com/mizuno0237/scp-planning-copilot) *(planned)* | Vue 3 + Vercel AI SDK front-end copilot |
