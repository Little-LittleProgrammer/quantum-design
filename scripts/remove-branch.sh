#!/bin/bash

# 清除一个月以上未更新的 Git 分支
# 作者: Assistant
# 使用方法: ./cleanup_branches.sh [选项]

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
DRY_RUN=true
FORCE_DELETE=true
EXCLUDE_BRANCHES=("main" "master" "develop")
DAYS_THRESHOLD=30

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -f, --force     强制删除分支（默认是预览模式）"
    echo "  -d, --days N    设置天数阈值（默认: 30天）"
    echo "  -e, --exclude   排除的分支名称（可多次使用）"
    echo "  -h, --help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                  # 预览将要删除的分支"
    echo "  $0 -f              # 强制删除一个月以上的分支"
    echo "  $0 -f -d 60        # 强制删除两个月以上的分支"
    echo "  $0 -f -e staging   # 删除时排除 staging 分支"
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--force)
            DRY_RUN=false
            shift
            ;;
        -d|--days)
            DAYS_THRESHOLD="$2"
            if ! [[ "$DAYS_THRESHOLD" =~ ^[0-9]+$ ]]; then
                echo -e "${RED}错误: 天数必须是数字${NC}"
                exit 1
            fi
            shift 2
            ;;
        -e|--exclude)
            EXCLUDE_BRANCHES+=("$2")
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}未知选项: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# 检查是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 获取当前日期的时间戳
current_timestamp=$(date +%s)

echo -e "${BLUE}=== Git 分支清理工具 ===${NC}"
echo -e "${BLUE}阈值设置: ${DAYS_THRESHOLD} 天${NC}"
echo -e "${BLUE}排除分支: ${EXCLUDE_BRANCHES[*]}${NC}"
echo -e "${BLUE}模式: ${DRY_RUN:+预览}${DRY_RUN:-强制删除}${NC}"
echo ""

# 更新远程分支信息
echo -e "${YELLOW}正在获取最新的远程分支信息...${NC}"
git fetch --prune

# 计算时间阈值（秒）
threshold_seconds=$((DAYS_THRESHOLD * 24 * 60 * 60))
cutoff_timestamp=$((current_timestamp - threshold_seconds))

# 格式化截止日期
cutoff_date=$(date -d "@$cutoff_timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -r "$cutoff_timestamp" "+%Y-%m-%d %H:%M:%S")

echo -e "${BLUE}截止日期: $cutoff_date${NC}"
echo ""

# 存储待处理的分支
declare -a branches_to_delete

# 获取本地分支信息
echo -e "${YELLOW}检查本地分支...${NC}"
while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        # 解析分支信息：提交哈希 时间戳 时区 分支名
        commit_hash=$(echo "$line" | awk '{print $1}')
        branch_name=$(echo "$line" | awk '{$1=$2=$3=""; print $0}' | sed 's/^  *//')
        
        # 获取最后一次提交的时间戳
        last_commit_timestamp=$(git show -s --format=%ct "$commit_hash" 2>/dev/null)
        
        if [[ -n "$last_commit_timestamp" ]]; then
            # 检查是否超过阈值
            if [[ $last_commit_timestamp -lt $cutoff_timestamp ]]; then
                # 检查是否在排除列表中
                should_exclude=false
                for exclude_branch in "${EXCLUDE_BRANCHES[@]}"; do
                    if [[ "$branch_name" == "$exclude_branch" ]] || [[ "$branch_name" == "remotes/origin/$exclude_branch" ]]; then
                        should_exclude=true
                        break
                    fi
                done
                
                if [[ "$should_exclude" == false ]] && [[ "$branch_name" != "HEAD" ]]; then
                    branches_to_delete+=("$branch_name|$last_commit_timestamp")
                fi
            fi
        fi
    fi
done < <(git for-each-ref --sort=committerdate refs/heads/ --format='%(objectname) %(committerdate:raw) %(refname:short)')

# 获取远程分支信息
echo -e "${YELLOW}检查远程分支...${NC}"
while IFS= read -r line; do
    if [[ -n "$line" ]]; then
        commit_hash=$(echo "$line" | awk '{print $1}')
        branch_info=$(echo "$line" | awk '{$1=$2=$3=""; print $0}' | sed 's/^  *//')
        
        # 提取远程分支名
        if [[ $branch_info == remotes/origin/* ]]; then
            branch_name=$branch_info
            last_commit_timestamp=$(git show -s --format=%ct "$commit_hash" 2>/dev/null)
            
            if [[ -n "$last_commit_timestamp" ]]; then
                if [[ $last_commit_timestamp -lt $cutoff_timestamp ]]; then
                    # 检查是否在排除列表中
                    branch_short_name=${branch_name#remotes/origin/}
                    should_exclude=false
                    for exclude_branch in "${EXCLUDE_BRANCHES[@]}"; do
                        if [[ "$branch_short_name" == "$exclude_branch" ]]; then
                            should_exclude=true
                            break
                        fi
                    done
                    
                    if [[ "$should_exclude" == false ]]; then
                        branches_to_delete+=("$branch_name|$last_commit_timestamp")
                    fi
                fi
            fi
        fi
    fi
done < <(git for-each-ref --sort=committerdate refs/remotes/origin --format='%(objectname) %(committerdate:raw) %(refname:short)' | grep -v 'HEAD')

# 如果没有找到要删除的分支
if [[ ${#branches_to_delete[@]} -eq 0 ]]; then
    echo -e "${GREEN}没有找到超过 $DAYS_THRESHOLD 天未更新的分支${NC}"
    exit 0
fi

# 显示要处理的分支
echo -e "${YELLOW}找到 ${#branches_to_delete[@]} 个符合条件的分支:${NC}"
echo "----------------------------------------"

for branch_data in "${branches_to_delete[@]}"; do
    branch_name=$(echo "$branch_data" | cut -d'|' -f1 | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
    timestamp=$(echo "$branch_data" | cut -d'|' -f2)
    commit_date=$(date -d "@$timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -r "$timestamp" "+%Y-%m-%d %H:%M:%S")
    
    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}[预览]${NC} $branch_name (${commit_date})"
    else
        echo -e "${RED}[将删除]${NC} $branch_name (${commit_date})"
    fi
done

echo "----------------------------------------"

# 执行删除操作
if [[ "$DRY_RUN" == false ]]; then
    echo ""
    read -p "确认删除以上分支? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}操作已取消${NC}"
        exit 0
    fi
    
    echo -e "${YELLOW}开始删除分支...${NC}"
    
    success_count=0
    fail_count=0
    
    for branch_data in "${branches_to_delete[@]}"; do
        branch_name=$(echo "$branch_data" | cut -d'|' -f1)
        if [[ $branch_name == remotes/origin/* ]]; then
            # 删除远程分支
            remote_branch=${branch_name#remotes/origin/}
            echo -e "${BLUE}删除远程分支:${NC} origin/$remote_branch"
            if git push origin --delete "$remote_branch" 2>/dev/null; then
                ((success_count++))
            else
                echo -e "${RED}删除失败: origin/$remote_branch${NC}"
                ((fail_count++))
            fi
        else
            # 删除本地分支
            echo -e "${BLUE}删除本地分支:${NC} $branch_name"
            delete_flag="-d"
            [[ "$FORCE_DELETE" == true ]] && delete_flag="-D"
            
            if git branch $delete_flag "$branch_name" 2>/dev/null; then
                ((success_count++))
            else
                echo -e "${RED}删除失败: $branch_name${NC}"
                ((fail_count++))
            fi
        fi
    done
    
    echo ""
    echo -e "${GREEN}删除成功: $success_count${NC}"
    echo -e "${RED}删除失败: $fail_count${NC}"
else
    echo ""
    echo -e "${YELLOW}这是预览模式，不会实际删除任何分支${NC}"
    echo -e "${BLUE}如需真正删除，请使用 -f 参数${NC}"
fi

echo -e "${GREEN}操作完成!${NC}"
