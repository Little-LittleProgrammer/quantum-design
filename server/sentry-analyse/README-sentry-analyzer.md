# Sentry 错误分析自动化脚本

一个完整的自动化脚本，用于分析 Sentry 错误数据并发送飞书通知。

## 功能特性

-   🔍 **智能分析**: 使用 DeepSeek AI 模型深度分析错误信息
-   📊 **详细报告**: 生成包含错误概览、优先级、详细分析的结构化报告
-   🚀 **飞书通知**: 自动发送富文本格式的分析报告到飞书群
-   🛡️ **错误处理**: 完善的错误处理和重试机制
-   📝 **日志记录**: 详细的执行日志，便于调试和监控
-   🔧 **多种输入**: 支持文件、命令行参数、管道等多种输入方式

## 环境要求

### 系统依赖

```bash
# macOS
brew install curl jq

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install curl jq

# CentOS/RHEL
sudo yum install curl jq
```

### 环境变量

创建 `.env` 文件或设置环境变量：

```bash
# 阿里云 Dashscope API Key (必需)
export DASHSCOPE_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# 飞书 Webhook URL (必需)
export FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx"
```

## 安装和配置

### 1. 下载脚本

```bash
# 确保脚本有执行权限
chmod +x sentry-error-analyzer.sh
```

### 2. 配置环境变量

```bash
# 方法一：直接导出
export DASHSCOPE_API_KEY="your-api-key"
export FEISHU_WEBHOOK_URL="your-webhook-url"

# 方法二：使用 .env 文件
echo "DASHSCOPE_API_KEY=your-api-key" >> .env
echo "FEISHU_WEBHOOK_URL=your-webhook-url" >> .env
source .env
```

### 3. 测试安装

```bash
# 显示帮助信息
./sentry-error-analyzer.sh -h

# 测试环境（不发送通知）
./sentry-error-analyzer.sh -n -d '{"event": {"title": "Test Error"}}'
```

## 使用方法

### 基本用法

```bash
# 从文件读取
./sentry-error-analyzer.sh -f sentry-error.json

# 从管道读取
cat sentry-error.json | ./sentry-error-analyzer.sh

# 直接传入数据
./sentry-error-analyzer.sh -d '{"event": {...}}'
```

### 高级选项

```bash
# 详细输出模式
./sentry-error-analyzer.sh -v -f sentry-error.json

# 测试模式（不发送飞书通知）
./sentry-error-analyzer.sh -n -f sentry-error.json

# 自定义重试次数和超时时间
./sentry-error-analyzer.sh -r 5 -t 60 -f sentry-error.json
```

### 命令行选项

| 选项 | 长选项      | 描述                        | 默认值 |
| ---- | ----------- | --------------------------- | ------ |
| `-f` | `--file`    | 从文件读取 Sentry JSON 数据 | -      |
| `-d` | `--data`    | 直接传入 JSON 数据字符串    | -      |
| `-v` | `--verbose` | 启用详细输出模式            | false  |
| `-n` | `--dry-run` | 测试模式，不发送通知        | false  |
| `-r` | `--retry`   | API 调用重试次数            | 3      |
| `-t` | `--timeout` | 请求超时时间（秒）          | 30     |
| `-h` | `--help`    | 显示帮助信息                | -      |

## 输入数据格式

脚本接受标准的 Sentry 事件 JSON 格式：

```json
{
  "event": {
    "type": "error",
    "title": "TypeError: Cannot read property 'foo' of undefined",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "exception": {
      "values": [
        {
          "type": "TypeError",
          "value": "Cannot read property 'foo' of undefined",
          "stacktrace": {
            "frames": [...]
          }
        }
      ]
    },
    "breadcrumbs": [...],
    "user": {...},
    "contexts": {...},
    "tags": {
      "url": "https://example.com/page"
    }
  }
}
```

## 输出示例

### 分析报告格式

```
📊 错误概览：JavaScript运行时错误、2024-01-15 10:30:00、高级别

⏰ 优先级：P1级别（严重影响核心功能，需要立即处理）

🔍 详细分析：
- 堆栈：
  - main.js:123:handleClick
  - utils.js:45:processData
  - api.js:78:fetchUserData
- 环境：
  - 浏览器：Chrome 120.0.0.0
  - 系统/设备：macOS
  - 操作系统版本：macOS 14.2
- 触发：用户在访问作家平台，从首页导航到用户中心，点击数据统计按钮
- 错误类型：JavaScript运行时错误

🎯 根本原因：访问未定义对象的属性，可能是异步数据加载时序问题

⚡ 解决方案：
- 解决方案：添加空值检查和防御性编程
- 预防措施：增加单元测试覆盖率，完善错误边界处理
```

### 飞书通知效果

脚本会发送格式化的富文本卡片到飞书群，包含：

-   🚨 醒目的错误警报标题
-   📊 完整的分析报告内容
-   📅 分析时间戳
-   🔴 红色主题突出严重性

## 日志和调试

### 日志文件

```bash
# 日志文件位置
./logs/sentry-analyzer-YYYYMMDD.log

# 查看最新日志
tail -f logs/sentry-analyzer-$(date +%Y%m%d).log

# 查看错误日志
grep "ERROR" logs/sentry-analyzer-*.log
```

### 调试模式

```bash
# 启用详细输出
./sentry-error-analyzer.sh -v -f sentry-error.json

# 测试模式（查看飞书消息内容但不发送）
./sentry-error-analyzer.sh -n -v -f sentry-error.json
```

## 故障排除

### 常见问题

#### 1. API Key 错误

```
错误：环境变量 DASHSCOPE_API_KEY 未设置
解决：检查环境变量是否正确设置
```

#### 2. JSON 格式错误

```
错误：无效的 JSON 格式
解决：使用 jq 验证 JSON 格式：jq . sentry-error.json
```

#### 3. 网络连接问题

```
错误：API 调用失败，已达到最大重试次数
解决：检查网络连接，增加重试次数和超时时间
```

#### 4. 飞书通知失败

```
错误：飞书通知发送失败
解决：检查 Webhook URL 是否正确，确认机器人权限
```

### 调试技巧

```bash
# 检查依赖
which curl jq

# 测试 API 连接
curl -I https://dashscope.aliyuncs.com

# 验证 JSON 数据
jq empty sentry-error.json

# 测试飞书 Webhook
curl -X POST "$FEISHU_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"msg_type":"text","content":{"text":"测试消息"}}'
```

## 集成示例

### 1. 定时任务

```bash
# 添加到 crontab，每小时检查一次
0 * * * * /path/to/sentry-error-analyzer.sh -f /path/to/sentry-errors.json
```

### 2. Webhook 集成

```bash
# 在 Web 服务中调用
curl -X POST http://your-server/webhook \
  -H "Content-Type: application/json" \
  -d @sentry-error.json | ./sentry-error-analyzer.sh
```

### 3. CI/CD 集成

```yaml
# GitHub Actions 示例
- name: Analyze Sentry Errors
  run: |
      export DASHSCOPE_API_KEY="${{ secrets.DASHSCOPE_API_KEY }}"
      export FEISHU_WEBHOOK_URL="${{ secrets.FEISHU_WEBHOOK_URL }}"
      ./sentry-error-analyzer.sh -f errors.json
```

## 性能优化

### 1. 批处理

```bash
# 处理多个错误文件
for file in errors/*.json; do
  ./sentry-error-analyzer.sh -f "$file"
  sleep 2  # 避免 API 限流
done
```

### 2. 并发控制

```bash
# 使用 xargs 并发处理
ls errors/*.json | xargs -n 1 -P 3 ./sentry-error-analyzer.sh -f
```

## 扩展功能

### 自定义分析提示词

可以修改脚本中的 `build_analysis_prompt` 函数来自定义分析逻辑：

```bash
# 编辑脚本
vim sentry-error-analyzer.sh

# 找到 build_analysis_prompt 函数并修改提示词
```

### 添加其他通知渠道

可以扩展脚本支持钉钉、企业微信等其他通知方式：

```bash
# 在 send_feishu_notification 函数后添加新的通知函数
send_dingtalk_notification() {
  # 钉钉通知实现
}
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

> 💡 **提示**: 建议在生产环境使用前，先在测试环境充分验证脚本功能。
