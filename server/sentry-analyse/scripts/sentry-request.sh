
curl -X POST "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation" \
-H "Authorization: Bearer sk-3e88c5f288ca46eea89c6843c095dbdc" \
-H "Content-Type: application/json" \
-d '{
    "model": "deepseek-v3",
    "input": {
        "messages": [
            {
                "role": "user",
                "content": "你是前端错误分析专家，分析 Sentry JSON 数据并提供解决方案。\n\n## 分析步骤\n1. **解析错误信息**：提取 event.type、event.title、event.exception、event.breadcrumbs、event.user、event.timestamp、event.contexts、event.tags['url'] 等关键字段\n2. **分类错误原因**：根据错误堆栈(event.exception.values[0].stacktrace)，错误信息(event.title)，用户行为栈(event.breadcrumbs) 用户设备(event.contexts.device)分析\n3. **评估影响**：错误频率、用户数、业务影响、紧急程度(P0-P4)\n4. **制定方案**：根据错误堆栈(event.exception.values[0].stacktrace)，错误信息(event.title)，以及用户行为栈(event.breadcrumbs)给出解决方案\n\n## 返回格式\n**📊 错误概览**：类型 、时间(event.timestamp格式化为 YYYY-MM-DD hh:mm:ss) 、级别\n**⏰ 优先级**：**P级别**(例如：P2级别（影响用户体验但不阻断核心功能）)\n**🔍 详细分析**：\n- 堆栈：文件:行号:函数(最多5条)\n- 环境：\n    - 浏览器\n    - 系统/设备\n    - 操作系统版本\n    - 设备型号\n- 触发：根据URL(event.tags['url'])与用户行为栈(event.breadcrumbs字段)分析(例如：用户在访问作家平台，从 xxx导航到 xxx, 用户操作轨迹包括： xxx, 点击 xxx 元素, 输入 xxx 内容等等触发)\n- 错误类型：JavaScript运行时错误、网络请求、资源加载、业务逻辑、第三方库错误、浏览器插件、黑客攻击\n**🎯 根本原因**：根据错误堆栈(event.exception.values[0].stacktrace)，错误信息(event.title)，以及用户行为栈(event.breadcrumbs)分析\n**⚡ 解决方案**：\n- 解决方案：提供解决方案\n- 预防措施：测试/审查/CI改进/\n\n## 要求\n1.如果返回信息某一项为无或空，则此项不返回。\n${rawData}"
            }
        ]
    },
    "parameters": {
        "result_format": "message"
    }
} '
