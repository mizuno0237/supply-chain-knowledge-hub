#!/bin/bash

# WeKnora 上游同步脚本
# 用于同步官方 WeKnora 仓库的更新到你的二开仓库

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${BLUE}🔄 WeKnora 上游同步工具${NC}"
echo "================================"

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  警告: 有未提交的更改${NC}"
    echo "请先提交或暂存你的更改:"
    echo "  git add ."
    echo "  git commit -m 'your message'"
    echo "或者暂存更改:"
    echo "  git stash"
    read -p "是否继续? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查 upstream 远程是否存在
if ! git remote | grep -q "^${UPSTREAM_REMOTE}$"; then
    echo -e "${YELLOW}⚠️  未找到 upstream 远程仓库${NC}"
    read -p "请输入 WeKnora 官方仓库地址: " UPSTREAM_URL
    git remote add "$UPSTREAM_REMOTE" "$UPSTREAM_URL"
    echo -e "${GREEN}✅ 已添加 upstream 远程仓库${NC}"
fi

# 获取上游更新
echo -e "${BLUE}📥 获取上游更新...${NC}"
git fetch "$UPSTREAM_REMOTE"

# 检查是否有新的提交
BEHIND=$(git rev-list --count HEAD.."${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}" 2>/dev/null || echo "0")
if [ "$BEHIND" -eq 0 ]; then
    echo -e "${GREEN}✅ 已是最新版本，无需同步${NC}"
    exit 0
fi

echo -e "${YELLOW}📊 上游有 ${BEHIND} 个新提交${NC}"

# 显示上游更新日志
echo -e "${BLUE}📝 上游更新内容:${NC}"
git log --oneline --graph --decorate HEAD.."${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}" | head -20

echo ""
read -p "是否继续同步? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消同步"
    exit 0
fi

# 创建同步分支
SYNC_BRANCH="upstream-sync-$(date +%Y%m%d-%H%M%S)"
echo -e "${BLUE}🌿 创建同步分支: ${SYNC_BRANCH}${NC}"
git checkout -b "$SYNC_BRANCH"

# 合并上游更新
echo -e "${BLUE}🔀 合并上游更新...${NC}"
if git merge "${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}" --no-edit; then
    echo -e "${GREEN}✅ 合并成功，无冲突${NC}"
    MERGE_SUCCESS=true
else
    echo -e "${YELLOW}⚠️  发现冲突，需要手动解决${NC}"
    echo ""
    echo "冲突文件列表:"
    git diff --name-only --diff-filter=U
    echo ""
    echo "解决冲突后请执行:"
    echo "  git add ."
    echo "  git commit -m 'chore: 解决上游同步冲突'"
    echo "  git checkout ${CURRENT_BRANCH}"
    echo "  git merge ${SYNC_BRANCH}"
    echo "  git push origin ${CURRENT_BRANCH}"
    MERGE_SUCCESS=false
    exit 1
fi

# 如果合并成功，提供后续操作建议
if [ "$MERGE_SUCCESS" = true ]; then
    echo ""
    echo -e "${GREEN}✅ 同步完成！${NC}"
    echo ""
    echo -e "${BLUE}📝 建议的后续操作:${NC}"
    echo "1. 查看变更内容:"
    echo "   git diff ${CURRENT_BRANCH}"
    echo ""
    echo "2. 运行测试验证:"
    echo "   make test"
    echo "   # 或手动测试关键功能"
    echo ""
    echo "3. 如果一切正常，合并到主分支:"
    echo "   git checkout ${CURRENT_BRANCH}"
    echo "   git merge ${SYNC_BRANCH}"
    echo "   git push origin ${CURRENT_BRANCH}"
    echo ""
    echo "4. 删除同步分支:"
    echo "   git branch -d ${SYNC_BRANCH}"
    echo ""
    echo "5. 打标签记录版本:"
    echo "   git tag -a v1.0.0-custom-$(date +%Y%m%d) -m 'Synced with upstream'"
    echo "   git push origin --tags"
    echo ""
    
    # 询问是否自动合并到主分支
    read -p "是否立即合并到 ${CURRENT_BRANCH} 分支? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout "$CURRENT_BRANCH"
        git merge "$SYNC_BRANCH"
        echo -e "${GREEN}✅ 已合并到 ${CURRENT_BRANCH}${NC}"
        echo "请运行测试后执行: git push origin ${CURRENT_BRANCH}"
    fi
fi
