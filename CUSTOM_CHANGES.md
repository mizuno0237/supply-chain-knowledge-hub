# 二开功能变更记录 · Supply Chain Planning Knowledge Hub

## 版本历史

### v1.0.1-public (2026-08-12)

- D3：`docs/ARCHITECTURE.md` — SCP RAG architecture + agent harness wiring
- D3：`data/scp-corpus/README.md` + `manifest.json` — corpus ingest guide
- README：corpus 表格 + architecture 文档链接

### v1.0.0-public (2026-08-10)

- 公开仓库 `supply-chain-knowledge-hub` — 基于 WeKnora 二开
- 对外定位：供应链计划领域 RAG（MRP / APS / S&OP / TOC）
- 预置语料槽：`data/scp-corpus/glossary.md`

### v1.0.0-custom (2026-03-20)

- 初始化二开仓库
- 基于现有 WeKnora 代码

## 与 upstream WeKnora 的差异（公开版）

| 项 | 说明 |
|---|---|
| **对外标题** | Supply Chain Planning Knowledge Hub（非泛用知识库） |
| **语料** | `data/scp-corpus/` 计划领域 glossary |
| **README** | 英文供应链场景 + 指向 `README_WEKNORA.md` |

## 同步上游

见 [`SYNC_UPSTREAM.md`](SYNC_UPSTREAM.md) 与 `./sync-upstream.sh`

## 注意事项

- 自定义代码优先放在 `custom/` 目录，减少与 upstream merge 冲突
- Push 前确认无 `.env`、token、内网-only 配置
