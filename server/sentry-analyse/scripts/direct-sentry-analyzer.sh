#!/bin/bash

#==============================================================================
# Sentry 错误分析直接执行脚本
# 功能：从标准输入读取 Sentry JSON 数据，调用 AI 分析，发送飞书通知
# 用法：cat sentry-data.json | ./direct-sentry-analyzer.sh
#      echo '{"event": {...}}' | ./direct-sentry-analyzer.sh
# 作者：AI Assistant
# 日期：$(date +%Y-%m-%d)
#==============================================================================

set -euo pipefail

# 全局变量
SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
TEMP_DIR="${SCRIPT_DIR}/temp"
TEMP_JSON_FILE="${TEMP_DIR}/sentry-data-$$.json"
TEMP_RESULT_FILE="${TEMP_DIR}/analysis-result-$$.json"

# 配置
RETRY_COUNT=3
TIMEOUT=120

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#==============================================================================
# 工具函数
#==============================================================================

# 日志函数
log() {
    local level="$1"
    shift
    local message="$*"
    
    case "$level" in
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message" >&2
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message" >&2
            ;;
        "INFO")
            echo -e "${GREEN}[INFO]${NC} $message"
            ;;
        "DEBUG")
            echo -e "${BLUE}[DEBUG]${NC} $message"
            ;;
    esac
}

# 错误处理函数
error_exit() {
    local message="$1"
    local exit_code="${2:-1}"
    log "ERROR" "$message"
    cleanup
    exit "$exit_code"
}

# 清理函数
cleanup() {
    log "DEBUG" "清理临时文件..."
    [[ -f "$TEMP_JSON_FILE" ]] && rm -f "$TEMP_JSON_FILE"
    [[ -f "$TEMP_RESULT_FILE" ]] && rm -f "$TEMP_RESULT_FILE"
    # 清理可能残留的请求文件
    rm -f "${TEMP_DIR}"/api-request-*.json 2>/dev/null || true
}

# 陷阱处理
trap cleanup EXIT
trap 'error_exit "脚本被中断" 130' INT TERM

#==============================================================================
# 环境检查函数
#==============================================================================

check_dependencies() {
    log "INFO" "检查依赖项..."
    
    local deps=("curl" "jq")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error_exit "缺少依赖：$dep。请安装后重试。"
        fi
    done
    
    log "INFO" "依赖项检查通过"
}

check_environment() {
    log "INFO" "检查配置变量..."
    
    if [[ -z "$DASHSCOPE_API_KEY" ]]; then
        error_exit "配置变量 DASHSCOPE_API_KEY 未设置"
    fi
    
    if [[ -z "$FEISHU_WEBHOOK_URL" ]]; then
        error_exit "配置变量 FEISHU_WEBHOOK_URL 未设置"
    fi
    
    log "INFO" "配置变量检查通过"
}

setup_directories() {
    log "DEBUG" "设置目录结构..."
    
    [[ ! -d "$TEMP_DIR" ]] && mkdir -p "$TEMP_DIR"
    
    log "DEBUG" "目录结构设置完成"
}

#==============================================================================
# 输入处理函数
#==============================================================================

# read_input_data() {
#     log "INFO" "从标准输入读取 Sentry 数据..."
    
#     # 检查是否有输入数据
#     if [[ -t 0 ]]; then
#         error_exit "需要从标准输入提供 Sentry JSON 数据。用法：cat data.json | $SCRIPT_NAME"
#     fi
    
#     # 从标准输入读取数据
#     cat > "$TEMP_JSON_FILE"
    
#     # 检查文件是否为空
#     if [[ ! -s "$TEMP_JSON_FILE" ]]; then
#         error_exit "输入数据为空"
#     fi
    
#     log "INFO" "数据读取完成，大小：$(wc -c < "$TEMP_JSON_FILE") 字节"
# }

read_input_data() {
    log "INFO" "从标准输入读取 Sentry 数据..."
    
    # 检查 rawData 变量是否存在且不为空
    if [[ -z "${rawData:-}" ]]; then
        error_exit "全局变量 rawData 未设置或为空。用法：rawData='...' && analyze_sentry_error"
    fi
    
    # 将 rawData 写入临时文件
    echo "$rawData" > "$TEMP_JSON_FILE"
    
    # 检查文件是否为空
    if [[ ! -s "$TEMP_JSON_FILE" ]]; then
        error_exit "rawData 数据为空"
    fi
    
    log "INFO" "数据读取完成，大小：$(wc -c < "$TEMP_JSON_FILE") 字节"
}

#==============================================================================
# JSON 数据处理函数
#==============================================================================

validate_json() {
    log "DEBUG" "验证 JSON 格式..."
    
    if ! jq empty "$TEMP_JSON_FILE" 2>/dev/null; then
        error_exit "无效的 JSON 格式"
    fi
    
    # 检查基本的 Sentry 事件结构
    if ! jq -e '.event' "$TEMP_JSON_FILE" >/dev/null 2>&1; then
        log "WARN" "JSON 数据可能不是标准的 Sentry 事件格式"
    fi
    
    log "DEBUG" "JSON 格式验证通过"
}

#==============================================================================
# AI 分析函数
#==============================================================================

build_analysis_prompt() {
    local sentry_data="$1"
    
    cat << EOF
你是前端错误分析专家，分析 Sentry JSON 数据并提供解决方案。

## 分析步骤
1. **解析错误信息**：提取 event.type、event.title、event.exception、event.breadcrumbs、event.user、event.timestamp、event.contexts、event.tags['url'] 等关键字段
2. **分类错误原因**：根据错误堆栈(event.exception.values[0].stacktrace)，错误信息(event.title)，用户行为栈(event.breadcrumbs) 用户设备(event.contexts.device)分析
3. **评估影响**：错误频率、用户数、业务影响、紧急程度(P0-P4)
4. **制定方案**：根据错误堆栈(event.exception.values[0].stacktrace)，错误信息(event.title)，以及用户行为栈(event.breadcrumbs)给出解决方案

## 返回格式
**📊 错误概览**：类型 、时间(event.timestamp格式化为 YYYY-MM-DD hh:mm:ss) 、级别
**⏰ 优先级**：**P级别**(例如：P2级别（影响用户体验但不阻断核心功能）)
**🔍 详细分析**：
- 堆栈：文件:行号:函数(最多5条)
- 环境：
    - 浏览器
    - 系统/设备
    - 操作系统版本
    - 设备型号
- 触发：根据URL(event.tags['url'])与用户行为栈(event.breadcrumbs字段)分析(例如：用户在访问作家平台，从 xxx导航到 xxx, 用户操作轨迹包括： xxx, 点击 xxx 元素, 输入 xxx 内容等等触发)
- 错误类型：JavaScript运行时错误、网络请求、资源加载、业务逻辑、第三方库错误、浏览器插件、黑客攻击
**🎯 根本原因**：根据错误堆栈(event.exception.values[0].stacktrace)，错误信息(event.title)，以及用户行为栈(event.breadcrumbs)分析
**⚡ 解决方案**：
- 解决方案：提供解决方案
- 预防措施：测试/审查/CI改进/

## 要求
1.如果返回信息某一项为无或空，则此项不返回。

${sentry_data}
EOF
}

call_dashscope_api() {
    local prompt="$1"
    local attempt=1
    
    log "INFO" "调用 Dashscope API 进行分析..."
    
    while [[ $attempt -le $RETRY_COUNT ]]; do
        log "DEBUG" "尝试第 $attempt 次调用 API..."
        
        # 构建请求 JSON 到临时文件
        local request_file="${TEMP_DIR}/api-request-$$.json"
        jq -n --arg prompt "$prompt" '{
            "model": "deepseek-r1-0528",
            "input": {
                "messages": [
                    {
                        "role": "user",
                        "content": $prompt
                    }
                ]
            },
            "parameters": {
                "result_format": "message"
            }
        }' > "$request_file"
        
        local response
        local curl_exit_code
        
        # 执行 curl 调用，捕获退出码但不让其导致脚本退出
        set +e
        response=$(curl -s --max-time "$TIMEOUT" \
            -X POST "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation" \
            -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
            -H "Content-Type: application/json" \
            -d "@$request_file" 2>&1)
        curl_exit_code=$?
        set -e
        
        # 清理请求文件
        [[ -f "$request_file" ]] && rm -f "$request_file"
        
        if [[ $curl_exit_code -eq 0 ]] && [[ -n "$response" ]]; then
            log "DEBUG" "收到 API 响应，长度: $(echo "$response" | wc -c) 字符"
            
            # 检查响应是否包含错误
            if echo "$response" | jq -e '.output.choices[0].message.content' >/dev/null 2>&1; then
                echo "$response" > "$TEMP_RESULT_FILE"
                log "INFO" "API 调用成功"
                return 0
            else
                local error_msg
                error_msg=$(echo "$response" | jq -r '.message // .error // .code // "未知错误"' 2>/dev/null)
                log "WARN" "API 响应格式异常 (尝试 $attempt/$RETRY_COUNT): $error_msg"
                log "DEBUG" "完整响应: $response"
            fi
        else
            local error_details=""
            case $curl_exit_code in
                28) error_details="(超时)" ;;
                6) error_details="(无法解析主机)" ;;
                7) error_details="(无法连接)" ;;
                *) error_details="(退出码: $curl_exit_code)" ;;
            esac
            log "WARN" "API 调用失败 $error_details，尝试 $attempt/$RETRY_COUNT"
            [[ -n "$response" ]] && log "DEBUG" "错误响应: $response"
        fi
        
        ((attempt++))
        if [[ $attempt -le $RETRY_COUNT ]]; then
            local sleep_time=$((attempt * 2))
            log "DEBUG" "等待 $sleep_time 秒后重试..."
            sleep $sleep_time
        fi
    done
    
    error_exit "API 调用失败，已达到最大重试次数"
}

extract_analysis_result() {
    
    if [[ ! -f "$TEMP_RESULT_FILE" ]]; then
        error_exit "分析结果文件不存在"
    fi
    
    local content
    content=$(jq -r '.output.choices[0].message.content' "$TEMP_RESULT_FILE" 2>/dev/null)
    
    if [[ -z "$content" || "$content" == "null" ]]; then
        error_exit "无法提取分析结果"
    fi
    
    echo "$content"
}

#==============================================================================
# 飞书通知函数
#==============================================================================

build_feishu_message() {
    local analysis_result="$1"
    local sentry_data="$2"
    
    # 从 sentry_data 中提取 event.id
    local event_id
    event_id=$(echo "$sentry_data" | jq -r '.event.id // "unknown"' 2>/dev/null)
    
    # 构建简化的飞书消息
    jq -n --arg event_id "$event_id" --arg content "$analysis_result" '{
        "event_id": $event_id,
        "content": $content
    }'
}

send_feishu_notification() {
    local message="$1"
    local attempt=1
    
    log "INFO" "发送飞书通知..."
    
    while [[ $attempt -le $RETRY_COUNT ]]; do
        log "DEBUG" "尝试第 $attempt 次发送通知..."
        
        local response
        response=$(curl -s --max-time "$TIMEOUT" \
            -X POST "$FEISHU_WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "$message" 2>/dev/null)
        
        if [[ $? -eq 0 ]]; then
            # 检查飞书响应
            local status_code
            status_code=$(echo "$response" | jq -r '.StatusCode // .code // 0' 2>/dev/null)
            
            if [[ "$status_code" == "0" ]]; then
                log "INFO" "飞书通知发送成功"
                return 0
            else
                log "WARN" "飞书通知发送失败: $(echo "$response" | jq -r '.StatusMessage // .msg // "未知错误"')"
            fi
        else
            log "WARN" "飞书通知发送失败，尝试 $attempt/$RETRY_COUNT"
        fi
        
        ((attempt++))
        [[ $attempt -le $RETRY_COUNT ]] && sleep $((attempt * 2))
    done
    
    error_exit "飞书通知发送失败，已达到最大重试次数"
}

#==============================================================================
# 主程序
#==============================================================================

main() {
    echo -e "${GREEN}🚀 开始执行 Sentry 错误分析...${NC}"
    
    # 1. 环境检查
    check_dependencies
    check_environment 
    setup_directories
    
    # 2. 读取输入数据
    read_input_data
    
    # 3. JSON 验证
    validate_json
    
    # 4. 读取 Sentry 数据
    local sentry_data
    sentry_data=$(cat "$TEMP_JSON_FILE")

    log "DEBUG" "Sentry 数据大小: $(echo "$sentry_data" | wc -c) 字节"
    
    # 5. 构建分析提示词
    local prompt
    prompt=$(build_analysis_prompt "$sentry_data")
    
    # 6. 调用 AI 分析
    call_dashscope_api "$prompt"
    
    # 7. 提取分析结果
    local analysis_result
    analysis_result=$(extract_analysis_result)
    log "INFO" "分析完成，结果长度: $(echo "$analysis_result" | wc -c) 字符"
    
    # 8. 构建飞书消息
    local feishu_message
    feishu_message=$(build_feishu_message "$analysis_result" "$sentry_data")
    
    # 9. 发送飞书通知
    send_feishu_notification "$feishu_message"
    
    echo -e "${GREEN}✅ Sentry 错误分析流程完成${NC}"
    
    # 10. 输出分析结果
    echo -e "\n${GREEN}📋 === 分析结果 ===${NC}"
    echo "$analysis_result"
}

#==============================================================================
# 脚本入口
#==============================================================================

main "$@" 

