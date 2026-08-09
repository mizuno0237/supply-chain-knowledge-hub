# Public sprint roadmap

Aligned with Master Plan §5.3.3 (W2-02b).

## Repository layout (target by 08-13)

```
supply-chain-knowledge-hub/
├── README.md
├── docker-compose.yml      # frontend + backend + vector store
├── .env.example
├── data/
│   └── scp-corpus/         # MRP / APS / TOC glossary (synthetic, no customer data)
├── docs/
│   ├── ARCHITECTURE.md
│   └── UPSTREAM-WEKNORA.md
└── … (sanitized WeKnora fork)
```

## Daily checklist

| Day | Date | Deliverable |
|---|---|---|
| D1 | 08-10 Mon | Audit secrets; `.env.example`; gitleaks clean |
| D2 | 08-11 Tue | `docker compose up` green |
| D3 | 08-12 Wed | SCP corpus slot + architecture README |
| D4 | 08-13 Thu | Full push; GitHub About keywords |

## Corpus sources (sanitized only)

- `Learning-Project/08-supply-chain/glossary.md` — planning terms for seed import
- Synthetic planning docs (no Fortune 500 customer names, no internal GitLab URLs)

## Upstream

- Base: [Tencent/WeKnora](https://github.com/Tencent/WeKnora) v0.6.x
- Internal fork (pre-sanitize): `UHAlean-Project/weknora-knowledgehub/`
