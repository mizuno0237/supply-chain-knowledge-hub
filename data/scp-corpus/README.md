# SCP corpus slot

Pre-seeded **supply chain planning (SCP)** vocabulary for RAG retrieval, agent demos, and interview prep.

## Files

| File | Purpose |
|---|---|
| [`glossary.md`](glossary.md) | **90 terms** — English definition, 中文, and 30s speakable script per term |
| [`manifest.json`](manifest.json) | Machine-readable metadata (categories, chunk hints, tags) |

## Categories (90 terms)

| # | Category | Terms |
|---|---|---|
| 1 | Planning Core | 18 — MRP, MPS, S&OP, DRP, APS, netting, pegging, … |
| 2 | Manufacturing & Scheduling | 18 — routing, work center, setup time, Gantt, finite capacity, … |
| 3 | Inventory & Demand | 15 — safety stock, forecast, ATP, DFP, … |
| 4 | Optimization & Solving | 12 — CPLEX, Gurobi, heuristic, objective function, … |
| 5 | Industry & Systems | 12 — SCP, ERP, MES, micro-frontend, digital twin, … |
| 6 | TOC & Narrative | 15 — constraint, DBR, throughput, five focusing steps, … |

## How to ingest (Docker Compose running)

1. Open the UI at `http://localhost` (see [`docs/DOCKER-QUICKSTART.md`](../../docs/DOCKER-QUICKSTART.md)).
2. Create a knowledge base — e.g. **SCP Glossary**.
3. Upload `glossary.md` (or paste content).
4. Use **heading-based chunking** if available, or default markdown parser (splits on `###` work well).
5. Ask a test question: *What is pegging in MRP?* — verify retrieved chunk contains English + 中文.

## Chunking recommendation

```
### MRP (Material Requirements Planning)   ← chunk boundary
- **English**: ...
- **中文**: ...
- **30s script**: ...
```

One term per chunk keeps retrieval precise and avoids mixing unrelated definitions.

## Adding your own documents

Drop additional planning material here (sanitized, no customer secrets):

```
data/scp-corpus/
  glossary.md          # bundled
  your-sop.md          # optional
  mrp-exception-guide.md
```

Re-ingest through the same knowledge base or create domain-specific bases (MPS vs S&OP vs TOC).

## Interview vs agent use

| Audience | Read |
|---|---|
| **Human interview prep** | English line → 中文 → practice 30s script aloud |
| **Agent / copilot** | Retrieve English + 中文; omit long scripts unless storytelling agent |

Replace `【填入真实数字】` placeholders with your real project numbers before interviews or live demos.
