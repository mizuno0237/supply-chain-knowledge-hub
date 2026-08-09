# Supply Chain Planning Knowledge Hub

**Domain RAG for supply chain planning** — MRP, APS, S&OP, TOC terminology and documents, built on a [WeKnora](https://github.com/Tencent/WeKnora)-derived stack.

> **Status:** Repository initialized (2026-08-09). Full Docker Compose stack, SCP corpus and MCP integration land in the **08-10 → 08-13** sprint per the public roadmap below.

## Why this exists

Planning agents need **terminology and master data** without stuffing glossaries into every prompt. This hub indexes supply-chain planning knowledge (definitions, constraint types, planning horizons, solver outputs) and exposes it through RAG — the same pattern used in production SCP agent harnesses, de-sensitized for public release.

## Planned architecture

```
Documents / glossary  →  ingest  →  chunk + embed  →  vector store (Milvus / pgvector)
                                                          ↓
Planner / Agent  ←  MCP or HTTP  ←  retrieve + rerank  ←  query
```

| Layer | Planned component |
|---|---|
| **Corpus** | SCP glossary (MRP / APS / TOC), synthetic planning docs — no customer data |
| **Hub** | WeKnora-derived backend (Go) + web UI |
| **Vectors** | Milvus + Elasticsearch + pgvector (configurable) |
| **Agent access** | MCP server for `lookupTerm` / `searchPlanningDoc` style tools |

## Roadmap (08-10 → 08-13)

- [ ] **D1** — Secret audit (`.env`, internal URLs), `.env.example`, gitleaks
- [ ] **D2** — Docker Compose: frontend + backend + vector DB
- [ ] **D3** — Pre-seed SCP corpus slot + English README (architecture + diff vs upstream WeKnora)
- [ ] **D4** — Public push + GitHub About (`supply chain planning`, `RAG`, `MCP`)

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for detail.

## Development source

Active development happens from a sanitized copy of the internal WeKnora fork (`UHAlean-Project/weknora-knowledgehub/`). **Do not copy customer SCP repositories into this public tree.**

## Related public work

- [`pixi-gantt`](https://github.com/mizuno0237/pixi-gantt) — Canvas scheduling UI (peer to planning agents)
- `scp-planning-copilot` *(coming 08-14)* — Vue 3 + Vercel AI SDK copilot consuming this hub

## License

MIT — see [LICENSE](./LICENSE). Derived from Tencent WeKnora (MIT); supply-chain corpus and customizations are original to this repository.
