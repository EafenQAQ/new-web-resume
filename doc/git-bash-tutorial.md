# Git Bash 新手完全教程

## 目录
1. [Git Bash 简介](#git-bash-简介)
2. [基本概念](#基本概念)
3. [安装与配置](#安装与配置)
4. [初始化仓库](#初始化仓库)
5. [规范提交](#规范提交)
6. [分支管理](#分支管理)
7. [远程仓库操作](#远程仓库操作)
8. [常用命令速查](#常用命令速查)

---

## Git Bash 简介

Git Bash 是 Windows 系统下提供的 Git 命令行工具，它模拟了 Linux 的 Bash 环境，让你可以使用 Unix 风格的命令来操作 Git。

### 什么是 Git？
Git 是一个分布式版本控制系统，用于跟踪文件的变化、协调多人协作开发。它可以记录每次修改的历史，方便回滚和比较不同版本。

---

## 基本概念

在开始使用 Git 之前，需要理解几个重要概念：

```
工作区 (Working Directory) → 暂存区 (Staging Area) → 本地仓库 (Local Repository) → 远程仓库 (Remote Repository)
    |                          |                           |                            |
  你的文件                git add                  git commit                   git push
```

- **工作区**：你在电脑上看到的文件目录
- **暂存区**：保存下次提交的文件信息（类似购物车）
- **本地仓库**：保存在本地的版本历史
- **远程仓库**：保存在服务器（如 GitHub、GitLab）上的版本历史

---

## 安装与配置

### 1. 检查 Git 是否已安装

打开 Git Bash，输入：
```bash
git --version
```

如果显示版本号（如 `git version 2.x.x`），说明已安装。

### 2. 配置用户信息

首次使用需要配置你的身份：

```bash
# 设置全局用户名
git config --global user.name "你的名字"

# 设置全局邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

### 3. 常用配置选项

```bash
# 设置默认分支名称为 main
git config --global init.defaultBranch main

# 设置提交时自动转换换行符（Windows 推荐）
git config --global core.autocrlf true

# 设置命令别名（可选）
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

---

## 初始化仓库

### 方法一：从零开始创建仓库

```bash
# 1. 创建项目目录
mkdir my-project
cd my-project

# 2. 初始化 Git 仓库
git init

# 此时会在当前目录创建 .git 隐藏文件夹
```

### 方法二：克隆现有仓库

```bash
# 从远程仓库克隆
git clone https://github.com/username/repository.git

# 克隆到指定目录
git clone https://github.com/username/repository.git my-folder
```

### 查看仓库状态

```bash
# 查看当前状态
git status

# 查看分支
git branch

# 查看提交历史
git log
git log --oneline  # 简洁显示
```

---

## 规范提交

### 1. 查看文件变化

```bash
# 查看未暂存的修改
git diff

# 查看已暂存的修改
git diff --staged

# 查看文件列表
git ls-files
```

### 2. 添加文件到暂存区

```bash
# 添加指定文件
git add filename.txt

# 添加多个文件
git add file1.txt file2.txt

# 添加所有修改的文件
git add .

# 添加所有文件（包括删除）
git add -A

# 交互式添加（推荐新手使用）
git add -i
```

### 3. 提交到本地仓库

```bash
# 基本提交
git commit -m "提交信息"

# 添加并提交（跳过 git add）
git commit -am "提交信息"

# 修改最后一次提交
git commit --amend

# 查看提交历史
git log
```

### 4. 规范的提交信息格式

推荐使用 **约定式提交（Conventional Commits）** 格式：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

#### 常用类型

- **feat**: 新功能
  ```
  feat(auth): 添加用户登录功能
  ```

- **fix**: 修复 Bug
  ```
  fix(api): 修复用户数据返回错误
  ```

- **docs**: 文档更新
  ```
  docs(readme): 更新安装说明
  ```

- **style**: 代码格式调整（不影响功能）
  ```
  style(components): 统一缩进格式
  ```

- **refactor**: 重构代码
  ```
  refactor(utils): 优化数据验证逻辑
  ```

- **test**: 测试相关
  ```
  test(user): 添加用户模块单元测试
  ```

- **chore**: 构建/工具配置等
  ```
  chore(deps): 升级依赖包版本
  ```

#### 完整示例

```bash
# 简单提交
git commit -m "feat: 添加首页轮播图组件"

# 带范围的提交
git commit -m "fix(auth): 修复登录验证超时问题"

# 带详细说明的提交
git commit -m "feat(api): 添加用户数据导出功能

- 支持 CSV 和 Excel 格式
- 添加数据过滤和排序
- 实现异步导出机制

Closes #123"
```

### 5. 撤销操作

```bash
# 撤销工作区的修改（恢复到上次提交的状态）
git restore filename.txt
# 或旧版本
git checkout -- filename.txt

# 撤销暂存区的文件（保留修改）
git restore --staged filename.txt
# 或旧版本
git reset HEAD filename.txt

# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃修改）
git reset --hard HEAD~1

# 回退到指定提交
git reset --hard <commit-hash>
```

---

## 分支管理

分支让你可以同时进行多个开发任务，互不影响。

### 1. 分支的基本操作

```bash
# 查看所有分支
git branch

# 查看所有分支（包含远程）
git branch -a

# 创建新分支
git branch feature-login

# 切换到指定分支
git checkout feature-login
# 或新版本命令
git switch feature-login

# 创建并切换到新分支
git checkout -b feature-login
# 或
git switch -c feature-login

# 删除本地分支
git branch -d feature-login

# 强制删除分支（未合并时）
git branch -D feature-login

# 重命名分支
git branch -m old-name new-name
```

### 2. 分支工作流程

典型的 Git 工作流：

```
main (主分支，稳定版本)
  ↓
develop (开发分支)
  ↓
feature/xxx (功能分支)
  ↓
hotfix/xxx (紧急修复分支)
```

#### 创建功能分支

```bash
# 1. 确保在主分支
git switch main

# 2. 拉取最新代码
git pull origin main

# 3. 创建功能分支
git switch -c feature-user-profile

# 4. 进行开发和提交
git add .
git commit -m "feat(profile): 添加用户资料页面"
```

### 3. 合并分支

```bash
# 1. 切换到目标分支
git switch main

# 2. 合并其他分支
git merge feature-user-profile

# 3. 如果有冲突，解决冲突后
git add .
git commit -m "merge: 合并用户资料功能"

# 4. 删除已合并的分支
git branch -d feature-user-profile
```

### 4. 变基（Rebase）

变基可以让提交历史更清晰：

```bash
# 将 feature 分支的提交应用到 main 的最新状态
git switch feature
git rebase main

# 交互式变基（可以修改历史提交）
git rebase -i HEAD~3  # 修改最近3次提交
```

**注意**：不要对已经推送的提交进行变基！

### 5. 解决合并冲突

当两个分支修改了同一文件的同一部分时，会产生冲突。

```bash
# Git 会提示冲突文件
git status

# 打开冲突文件，查找冲突标记
<<<<<<< HEAD
// 当前分支的代码
=======
// 被合并分支的代码
>>>>>>> feature-branch

# 手动编辑，保留需要的代码，删除标记

# 标记冲突已解决
git add conflicted-file.txt

# 完成合并
git commit
```

---

## 远程仓库操作

### 1. 关联远程仓库

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 修改远程仓库地址
git remote set-url origin https://github.com/username/new-repo.git

# 删除远程仓库关联
git remote remove origin
```

### 2. 推送到远程仓库

```bash
# 首次推送（设置上游分支）
git push -u origin main

# 推送到默认远程分支
git push

# 推送到指定分支
git push origin feature-branch

# 推送所有分支
git push --all

# 强制推送（谨慎使用）
git push -f origin main
```

### 3. 从远程仓库拉取

```bash
# 拉取并合并
git pull origin main

# 拉取（不合并）
git fetch origin main

# 拉取所有远程分支
git fetch --all

# 拉取并变基（保持提交历史清晰）
git pull --rebase origin main
```

---

## 常用命令速查

### 每日工作流

```bash
# 1. 开始工作
git switch main
git pull origin main
git switch -c feature-new-feature

# 2. 开发过程中
git status                  # 查看状态
git add .                   # 添加修改
git commit -m "feat: 添加新功能"  # 提交

# 3. 完成工作
git switch main             # 切换回主分支
git merge feature-new-feature  # 合并功能
git push origin main        # 推送到远程
git branch -d feature-new-feature  # 删除功能分支
```

### 快速参考

| 命令 | 说明 |
|------|------|
| `git init` | 初始化仓库 |
| `git clone <url>` | 克隆仓库 |
| `git status` | 查看状态 |
| `git add .` | 添加所有修改 |
| `git commit -m "message"` | 提交 |
| `git push` | 推送到远程 |
| `git pull` | 拉取并合并 |
| `git branch` | 查看分支 |
| `git switch <branch>` | 切换分支 |
| `git merge <branch>` | 合并分支 |
| `git log --oneline` | 查看历史 |
| `git diff` | 查看差异 |

---

## 最佳实践

### 1. 提交规范
- 频繁提交，每次提交只做一件事
- 使用清晰、规范的提交信息
- 提交前确保代码可以运行

### 2. 分支策略
- `main` 分支保持稳定，只合并经过测试的代码
- 使用功能分支开发新功能
- 定期从主分支拉取更新，避免冲突积累

### 3. 代码审查
- 推送前检查修改内容
- 使用 `git diff` 确认只提交必要的文件
- 不要提交敏感信息（密码、密钥等）

### 4. 忽略文件
创建 `.gitignore` 文件指定不需要版本控制的文件：

```
# 依赖
node_modules/
__pycache__/

# IDE
.vscode/
.idea/

# 环境配置
.env
.env.local

# 构建产物
dist/
build/
*.log
```

---

## 常见问题

### Q1: 如何撤销一次错误的提交？
```bash
# 如果还没推送到远程
git reset --soft HEAD~1  # 保留修改
git reset --hard HEAD~1  # 丢弃修改

# 如果已经推送
git revert HEAD  # 创建新提交撤销修改
git push
```

### Q2: 如何查看某次提交的详细内容？
```bash
# 查看提交详情
git show <commit-hash>

# 查看指定文件的修改历史
git log -p filename.txt
```

### Q3: 如何临时保存工作？
```bash
# 保存当前工作状态
git stash

# 查看保存的状态
git stash list

# 恢复保存的状态
git stash pop

# 删除保存的状态
git stash drop
```

---

## 进阶学习资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub Git 指南](https://guides.github.com/)
- [learngitbranching.js.org](https://learngitbranching.js.org/) - 交互式学习工具
- [约定式提交规范](https://www.conventionalcommits.org/)

---

**记住**：Git 是一个强大的工具，但需要时间掌握。建议从基本命令开始，逐步学习高级功能。遇到问题时，使用 `git --help` 或在线搜索解决方案。
