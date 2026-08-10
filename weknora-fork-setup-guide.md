# WeKnora 二开仓库设置指南

## 方案概述

基于 WeKnora 源码进行二次开发，同时保持与上游同步的能力。

## 设置步骤

### 1. 创建独立的二开仓库

```bash
# 在你的 Git 平台（GitHub/GitLab/Gitee）创建新仓库
# 例如: weknora-custom

# 克隆 WeKnora 源码到新目录
git clone <你的新仓库地址> weknora-custom
cd weknora-custom

# 添加 WeKnora 官方仓库作为上游
git remote add upstream <WeKnora官方仓库地址>
git remote -v  # 验证配置
```

### 2. 初始化二开代码

```bash
# 从当前 WeKnora 目录复制代码
cp -r ../WeKnora/* .
cp -r ../WeKnora/.* . 2>/dev/null || true

# 提交初始代码
git add .
git commit -m "feat: 初始化二开仓库基于 WeKnora"
git push origin main
```

### 3. 分支策略

```
main (或 master)     - 你的生产分支，包含所有二开功能
develop              - 开发分支
upstream-sync        - 用于同步上游更新的临时分支
feature/*            - 功能分支
```

### 4. 同步上游更新

#### 方式一：定期同步（推荐）

```bash
# 1. 获取上游最新代码
git fetch upstream

# 2. 创建同步分支
git checkout -b upstream-sync-$(date +%Y%m%d)

# 3. 合并上游更新
git merge upstream/main
# 或使用 rebase（保持提交历史清晰）
# git rebase upstream/main

# 4. 解决冲突（如果有）
# 编辑冲突文件
git add .
git commit -m "chore: 同步上游更新 $(date +%Y-%m-%d)"

# 5. 测试验证
# 运行测试确保功能正常

# 6. 合并到主分支
git checkout main
git merge upstream-sync-$(date +%Y%m%d)
git push origin main
```

#### 方式二：选择性同步（cherry-pick）

```bash
# 查看上游特定提交
git log upstream/main --oneline

# 选择性应用某个提交
git cherry-pick <commit-hash>

# 或应用一系列提交
git cherry-pick <start-commit>..<end-commit>
```

### 5. 保护你的二开代码

#### 使用独立的目录结构

```
weknora-custom/
├── custom/              # 你的二开代码
│   ├── features/
│   ├── plugins/
│   └── configs/
├── WeKnora原始代码...
└── .gitignore          # 忽略临时文件
```

#### 使用配置文件隔离

```yaml
# config/custom.yaml
custom:
  enabled: true
  features:
    - feishu_integration
    - deepwiki_integration
```

### 6. 自动化同步脚本

创建 `sync-upstream.sh`:

```bash
#!/bin/bash

set -e

echo "🔄 开始同步上游 WeKnora 更新..."

# 获取上游更新
git fetch upstream

# 创建同步分支
SYNC_BRANCH="upstream-sync-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$SYNC_BRANCH"

# 合并上游
echo "📥 合并上游更新..."
if git merge upstream/main --no-edit; then
    echo "✅ 合并成功，无冲突"
else
    echo "⚠️  发现冲突，请手动解决后运行:"
    echo "   git add ."
    echo "   git commit -m 'chore: 解决同步冲突'"
    echo "   git checkout main"
    echo "   git merge $SYNC_BRANCH"
    exit 1
fi

# 运行测试
echo "🧪 运行测试..."
# make test || echo "⚠️  测试失败，请检查"

# 提示下一步
echo "✅ 同步完成！"
echo "📝 下一步操作:"
echo "   1. 检查变更: git diff main"
echo "   2. 测试功能是否正常"
echo "   3. 合并到主分支: git checkout main && git merge $SYNC_BRANCH"
echo "   4. 推送: git push origin main"
```

### 7. 冲突解决策略

#### 常见冲突场景

1. **配置文件冲突** - 保留你的配置，选择性合并上游新增项
2. **核心功能修改** - 评估是否需要重构你的二开代码
3. **依赖版本冲突** - 优先使用上游版本，测试兼容性

#### 冲突解决工具

```bash
# 使用 mergetool
git mergetool

# 查看冲突文件
git diff --name-only --diff-filter=U

# 选择某一方的版本
git checkout --ours <file>    # 保留你的版本
git checkout --theirs <file>  # 使用上游版本
```

### 8. 版本标记

```bash
# 为你的二开版本打标签
git tag -a v1.0.0-custom -m "基于 WeKnora v1.2.3 的二开版本"
git push origin v1.0.0-custom

# 记录基于的上游版本
echo "WeKnora v1.2.3" > UPSTREAM_VERSION.txt
```

### 9. 文档维护

创建 `CUSTOM_CHANGES.md` 记录你的修改:

```markdown
# 二开功能列表

## 新增功能
- [ ] 飞书集成
- [ ] DeepWiki 集成
- [ ] 自定义认证

## 修改的文件
- `config/config.yaml` - 添加自定义配置
- `internal/api/` - 新增 API 端点

## 依赖变更
- 新增: xxx
- 升级: yyy
```

### 10. CI/CD 集成

```yaml
# .github/workflows/sync-upstream.yml
name: Check Upstream Updates

on:
  schedule:
    - cron: '0 0 * * 1'  # 每周一检查
  workflow_dispatch:

jobs:
  check-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch upstream
        run: |
          git remote add upstream <upstream-url>
          git fetch upstream
      - name: Check for updates
        run: |
          BEHIND=$(git rev-list --count HEAD..upstream/main)
          echo "Behind upstream by $BEHIND commits"
          if [ $BEHIND -gt 0 ]; then
            echo "::warning::有 $BEHIND 个上游更新待同步"
          fi
```

## 最佳实践

1. **定期同步** - 建议每 1-2 周同步一次上游更新
2. **小步快跑** - 每次同步后立即测试，避免积累太多变更
3. **保持克制** - 尽量减少对核心代码的修改，优先使用插件/扩展机制
4. **文档先行** - 记录每次二开的原因和实现方式
5. **自动化测试** - 建立测试套件，确保同步后功能正常

## 注意事项

- ⚠️ 不要直接修改上游核心文件，优先使用配置和扩展
- ⚠️ 同步前务必备份当前代码
- ⚠️ 重大版本升级时要特别谨慎，可能需要重构二开代码
- ⚠️ 保持与上游的沟通，考虑将通用功能贡献回上游
