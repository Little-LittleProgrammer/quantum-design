# Direct Sentry Analyzer 使用说明

## 概述

`direct-sentry-analyzer.sh` 是一个简化版的 Sentry 错误分析脚本，专门设计用于直接执行，无需复杂的 CLI 参数。该脚本从标准输入读取 Sentry JSON 数据，进行 AI 分析，并发送飞书通知。

## 特性

-   ✅ **简化操作**: 无需记忆复杂的 CLI 参数
-   ✅ **直接执行**: 通过管道直接传入数据即可运行
-   ✅ **AI 分析**: 基于阿里云 Dashscope API 的智能错误分析
-   ✅ **飞书通知**: 自动发送分析结果到飞书群组
-   ✅ **完整日志**: 保留详细的执行日志和错误处理
-   ✅ **自动清理**: 自动清理临时文件

## 使用方法

### 基本用法

```bash
# 从文件读取 Sentry 数据
cat sentry-error.json | ./direct-sentry-analyzer.sh

# 从其他命令的输出读取
curl -s "https://api.example.com/sentry-data" | ./direct-sentry-analyzer.sh

# 直接传入 JSON 数据
echo '{"event": {"id": "123", "title": "Error"}}' | ./direct-sentry-analyzer.sh
```

### 示例

```bash
# 分析本地错误文件
cat logs/sentry-error-20250114.json | ./direct-sentry-analyzer.sh

# 从 API 获取并分析
curl -H "Authorization: Bearer YOUR_TOKEN" \
    "https://sentry.io/api/0/projects/PROJECT_ID/events/EVENT_ID/" | \
    ./direct-sentry-analyzer.sh

# 处理多个错误文件
for file in logs/*.json; do
    echo "处理文件: $file"
    cat "$file" | ./direct-sentry-analyzer.sh
    sleep 5  # 避免频繁调用
done
```

## 配置要求

### 环境变量

脚本内置了以下配置，如需修改请编辑脚本：

```bash
DASHSCOPE_API_KEY="sk-xxxxxxxx"
FEISHU_WEBHOOK_URL="https://x0sgcptncj.feishu.cn/base/automation/webhook/event/DS8NaRuBtwMzrThsmzdcQEtPnUb"
```

### 依赖项

-   `curl`: 用于 API 调用
-   `jq`: 用于 JSON 处理

安装依赖：

```bash
# macOS
brew install curl jq

# Ubuntu/Debian
sudo apt-get install curl jq

# CentOS/RHEL
sudo yum install curl jq
```

## 输入格式

脚本期望输入标准的 Sentry 事件 JSON 格式：

```json
{
  "event": {
    "id": "event_id",
    "title": "Error message",
    "timestamp": "2025-01-14T10:30:00.000Z",
    "type": "error",
    "exception": {
      "values": [
        {
          "type": "TypeError",
          "value": "Cannot read property 'xxx' of undefined",
          "stacktrace": {
            "frames": [...]
          }
        }
      ]
    },
    "breadcrumbs": [...],
    "contexts": {...},
    "tags": {...},
    "user": {...}
  }
}
```

## 输出结果

脚本会输出以下内容：

### 1. 控制台输出

-   执行进度信息
-   最终的 AI 分析结果

### 2. 日志文件

-   位置: `logs/sentry-analyzer-YYYYMMDD.log`
-   包含详细的执行日志和错误信息

### 3. 飞书通知

自动发送包含以下内容的通知：

-   📊 错误概览
-   ⏰ 优先级评估
-   🔍 详细分析
-   🎯 根本原因
-   ⚡ 解决方案

## 错误处理

### 常见错误及解决方案

1. **"需要从标准输入提供 Sentry JSON 数据"**

    - 确保通过管道或重定向提供输入数据

2. **"无效的 JSON 格式"**

    - 检查输入数据是否为有效的 JSON
    - 使用 `jq` 验证：`cat data.json | jq .`

3. **"缺少依赖：curl"**

    - 安装缺失的依赖项

4. **API 调用失败**
    - 检查网络连接
    - 验证 API Key 是否有效
    - 查看日志文件获取详细错误信息

## 自定义配置

如需修改配置，可以编辑脚本中的以下变量：

```bash
# API 配置
DASHSCOPE_API_KEY="your-api-key"
FEISHU_WEBHOOK_URL="your-webhook-url"

# 重试配置
RETRY_COUNT=3
TIMEOUT=120
```

## 与原版脚本的区别

| 特性       | 原版脚本          | 直接执行版本   |
| ---------- | ----------------- | -------------- |
| 参数解析   | 支持多种 CLI 参数 | 只支持标准输入 |
| 使用复杂度 | 中等              | 简单           |
| 灵活性     | 高                | 中等           |
| 执行速度   | 一般              | 快速           |
| 详细模式   | 可选              | 默认开启       |
| 测试模式   | 支持              | 不支持         |

## 最佳实践

1. **批量处理**: 处理多个错误时添加延迟避免频繁调用
2. **日志管理**: 定期清理日志目录
3. **数据验证**: 处理前验证 JSON 格式
4. **错误监控**: 监控脚本执行状态和错误率

## 故障排除

查看日志文件获取详细信息：

```bash
tail -f logs/sentry-analyzer-$(date +%Y%m%d).log
```

检查临时文件（如果清理失败）：

```bash
ls -la temp/
```

测试 JSON 格式：

```bash
cat your-data.json | jq . >/dev/null && echo "JSON 格式正确"
```

## 许可证

与原项目相同的许可证。
