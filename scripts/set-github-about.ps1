# Set GitHub repo About (description + topics). Requires: gh auth login
$ErrorActionPreference = "Stop"
$desc = "Domain RAG knowledge hub for supply chain planning (MRP, APS, S&OP, TOC). WeKnora fork with SCP glossary corpus, Docker Compose quickstart, and agent/MCP retrieval."
$topics = @(
  "supply-chain", "supply-chain-planning", "rag", "knowledge-base",
  "mrp", "aps", "weknora", "docker-compose", "ai-agents"
)
$topicArgs = $topics | ForEach-Object { "--add-topic"; $_ }
gh repo edit --description $desc @topicArgs
Write-Host "Done. Check: https://github.com/mizuno0237/supply-chain-knowledge-hub"
