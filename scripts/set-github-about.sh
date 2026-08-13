#!/usr/bin/env bash
# Set GitHub repo About (description + topics). Requires: gh auth login
set -euo pipefail
gh repo edit \
  --description "Domain RAG knowledge hub for supply chain planning (MRP, APS, S&OP, TOC). WeKnora fork with SCP glossary corpus, Docker Compose quickstart, and agent/MCP retrieval." \
  --add-topic supply-chain \
  --add-topic supply-chain-planning \
  --add-topic rag \
  --add-topic knowledge-base \
  --add-topic mrp \
  --add-topic aps \
  --add-topic weknora \
  --add-topic docker-compose \
  --add-topic ai-agents
echo "Done. Check: https://github.com/mizuno0237/supply-chain-knowledge-hub"
