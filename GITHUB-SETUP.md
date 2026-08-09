# GitHub 远程仓库 — 一次性配置

## 若 Agent 未能自动 push

GitHub 上必须先有**空仓库**（SSH 只能 push，不能代你建库）。

### 方式 A · 网页（30 秒）

1. 打开（名称已预填）：  
   https://github.com/new?name=supply-chain-knowledge-hub&description=Supply+chain+planning+domain+RAG&visibility=public
2. **不要**勾选 Add a README / .gitignore / license（本地已有）
3. 点 **Create repository**
4. 在本目录执行：

```powershell
cd d:\新生\GitHub-project\supply-chain-knowledge-hub
git push -u origin main
```

### 方式 B · GitHub CLI

```powershell
gh auth login
gh repo create supply-chain-knowledge-hub --public --source=. --remote=origin --push
```

## 远程

```
git@github.com:mizuno0237/supply-chain-knowledge-hub.git
```

## 本地源码（脱敏前）

开发源码在 `UHAlean-Project/weknora-knowledgehub/`（内网 GitLab remote）。08-10 起做 gitleaks 审计，08-13 前把 sanitize 后的代码合入本公开仓库。
