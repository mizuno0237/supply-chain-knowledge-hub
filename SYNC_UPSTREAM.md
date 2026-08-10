# 代码同步文档

## 仓库信息

- **上游仓库 (upstream)**: https://github.com/Tencent/WeKnora.git
- **Public repository (origin)**: https://github.com/mizuno0237/supply-chain-knowledge-hub

## 初始配置

如果还没有配置上游仓库，执行以下命令：

```bash
git remote add upstream https://github.com/Tencent/WeKnora.git
```

查看远程仓库配置：

```bash
git remote -v
```

## 同步上游代码

### 方式一：标准合并（推荐）

```bash
# 1. 切换到主分支
git checkout main

# 2. 拉取上游最新代码
git fetch upstream

# 3. 查看上游更新内容（可选）
git log HEAD..upstream/main --oneline

# 4. 合并上游代码
git merge upstream/main

# 5. 解决冲突（如果有）
# 编辑冲突文件后执行：
# git add .
# git commit -m "resolve merge conflicts"

# 6. 推送到个人仓库
git push origin main
```

### 方式二：一键同步

```bash
cd weknora-custom && \
git fetch upstream && \
git merge upstream/main && \
git push origin main
```

### 方式三：使用 rebase（保持提交历史清晰）

```bash
# 1. 拉取上游代码
git fetch upstream

# 2. 使用 rebase 合并
git rebase upstream/main

# 3. 解决冲突（如果有）
# 编辑冲突文件后执行：
# git add .
# git rebase --continue

# 4. 强制推送到个人仓库
git push origin main --force-with-lease
```

## 常用命令

### 查看上游更新

```bash
# 查看上游有哪些新提交
git fetch upstream
git log HEAD..upstream/main --oneline

# 查看详细差异
git diff HEAD..upstream/main
```

### 放弃本地修改

```bash
# 放弃工作区修改
git checkout .

# 放弃暂存区修改
git reset HEAD

# 强制同步上游（会丢失本地提交）
git reset --hard upstream/main
git push origin main --force
```

### 解决冲突

```bash
# 查看冲突文件
git status

# 编辑冲突文件，保留需要的代码

# 标记冲突已解决
git add <冲突文件>

# 完成合并
git commit -m "resolve conflicts"
```

### 取消合并

```bash
# 如果合并出现问题，可以取消
git merge --abort

# 或者回退到合并前
git reset --hard HEAD~1
```

## 同步频率建议

- **日常开发**: 每周同步一次上游代码
- **重大更新**: 关注上游 Release，及时同步
- **提交前**: 建议先同步上游，避免大量冲突

## 注意事项

1. 同步前先提交本地修改，保持工作区干净
2. 如果有未提交的修改，可以先 stash：
   ```bash
   git stash
   # 同步代码...
   git stash pop
   ```
3. 使用 `--force-with-lease` 而不是 `--force`，更安全
4. 重要修改前建议创建备份分支：
   ```bash
   git checkout -b backup-$(date +%Y%m%d)
   ```

## 常见问题

### Q: git fetch 报错 "Error in the HTTP2 framing layer"？

A: 这是 HTTP/2 协议问题，有以下几种解决方案：

**方案1: 禁用 HTTP/2（推荐）**
```bash
git config --global http.version HTTP/1.1
```

**方案2: 增加缓冲区大小**
```bash
git config --global http.postBuffer 524288000
```

**方案3: 使用代理（如果有）**
```bash
# 设置代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**方案4: 切换到 SSH 协议**
```bash
# 修改上游仓库地址为 SSH
git remote set-url upstream git@github.com:Tencent/WeKnora.git
```

**方案5: 临时禁用 HTTP/2**
```bash
GIT_HTTP_VERSION=HTTP/1.1 git fetch upstream
```

执行后重试 `git fetch upstream`

### Q: 合并时出现大量冲突怎么办？

A: 可以使用图形化工具解决冲突，或者：
```bash
# 取消本次合并
git merge --abort

# 使用 rebase 逐个提交处理
git rebase upstream/main
```

### Q: 推送时提示 rejected？

A: 说明远程有新提交，先拉取：
```bash
git pull origin main --rebase
git push origin main
```

### Q: 如何只同步特定文件？

A: 使用 checkout：
```bash
git fetch upstream
git checkout upstream/main -- <文件路径>
git commit -m "sync specific file from upstream"
```

## 自动化脚本

创建 `sync.sh` 脚本：

```bash
#!/bin/bash
set -e

echo "开始同步上游代码..."

# 检查工作区是否干净
if [[ -n $(git status -s) ]]; then
    echo "警告: 工作区有未提交的修改"
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 拉取上游代码
git fetch upstream

# 显示更新内容
echo "上游更新内容:"
git log HEAD..upstream/main --oneline

# 确认合并
read -p "是否合并? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git merge upstream/main
    git push origin main
    echo "同步完成!"
else
    echo "已取消"
fi
```

使用方法：
```bash
chmod +x sync.sh
./sync.sh
```
