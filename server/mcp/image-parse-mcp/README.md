# qm-image-parse-mcp 使用指南

## 简介

视觉理解 MCP Server，基于阿里云百炼 `qwen3-vl-plus` 模型，为 Claude Code 、 Cline、Cursor 等提供图像分析和视频理解能力。

## 配置

在项目的 `.cursor/mcp.json`（Cursor）或 `~/.claude.json`（Claude Code）中添加配置：

```json
{
    "mcpServers": {
        "image-parse": {
            "command": "npx",
            "args": ["-y", "qm-image-parse-mcp"],
            "env": {
                "DASHSCOPE_API_KEY": "你的阿里云API Key",
                "OSS_ACCESS_KEY_ID": "你的OSS AccessKeyId",
                "OSS_ACCESS_KEY_SECRET": "你的OSS AccessKeySecret",
                "OSS_BUCKET": "你的Bucket名称",
                "OSS_REGION": "oss-cn-hangzhou"
            }
        }
    }
}
```

## 可用工具

| 工具                           | 用途                          | 说明                                                                                    |
| ------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------- |
| `ui_to_artifact`               | UI 截图转代码/提示词/设计规范 | 将 UI 截图转换为代码、提示词、设计规范或自然语言描述                                    |
| `extract_text_from_screenshot` | OCR 提取文字                  | 使用先进的 OCR 能力从截图中提取和识别文字。专门用于代码、终端输出、文档和通用文本的提取 |
| `diagnose_error_screenshot`    | 分析报错截图并给出修复建议    | 解析错误弹窗、堆栈和日志截图，给出定位与修复建议                                        |
| `understand_technical_diagram` | 解读架构图、流程图、UML       | 针对架构图、流程图、UML、ER 图等技术图纸生成结构化解读                                  |
| `analyze_data_visualization`   | 分析仪表盘、图表数据          | 阅读仪表盘、统计图表，提炼趋势、异常与业务要点                                          |
| `ui_diff_check`                | 对比两张 UI 图的差异          | 对比两张 UI 截图，识别视觉差异和实现偏差。专门用于 UI 质量保证和设计到实现的验证        |
| `image_analysis`               | 通用图像理解                  | 通用图像理解能力，适配未被专项工具覆盖的视觉内容                                        |
| `video_analysis`               | 分析视频内容                  | 支持 MP4/MOV/M4V等格式的视频场景解析，抓取关键帧、事件与要点                            |

## 使用方式

直接用自然语言描述需求，Claude 会自动调用合适的工具：

```
"把这个截图转换成 React 组件"
"提取截图中所有的错误日志"
"分析这个报错截图并给出修复建议"
"对比设计稿和实现效果有什么差异"
"分析这个产品演示视频的主要功能"
"这张架构图的结构是什么"
```

图片支持本地路径、URL、Base64 三种方式传入。

## 注意事项

- Cursor 不支持直接粘贴截图调用 MCP，需将图片放在本地目录，指定路径调用
- 本地视频最大 8MB，超大文件请使用远程 URL，如配置了 `OSS相关变量` 可忽略此限制
- 确保 `所有环境变量` 配置正确

## 效果展示

描述图像中的内容或者对其进行分类打标，如识别人物、地点、动植物等。

| 资源 | AI 回答 |
| --- | --- |
| ![图片](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7372672671/p1025117.webp) 如果太阳很刺眼，我应该用这张图中的什么物品？ | 当太阳很刺眼时，你应该使用图中的粉色太阳镜。太阳镜可以有效阻挡强光、减少紫外线对眼睛的伤害，帮助你在阳光强烈时保护视力并提升视觉舒适度。 |
| ![图片](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7372672671/p1025118.webp) 请根据图片内容，帮我写一段有意思的朋友圈文案。 | 好的，这张图片充满了浓郁的中秋节日氛围，古典与现代元素结合得非常巧妙。根据图片中的主要元素，我为你准备了几个不同风格的朋友圈文案，你可以根据自己的喜好选择。<br>**诗意唯美风**<br>今夜月明人尽望，不知秋思落谁家。嫦娥奔月，玉兔捣药，古人的浪漫在今夜被点亮。愿这轮明月，能照亮你回家的路，也能寄去我最深的思念。中秋节快乐！<br>**温馨祝福风**<br>月圆人团圆，中秋夜最温柔。看烟花绽放，赏圆月当空，吃一口月饼，道一声安康。愿你我心中所念，皆能如愿以偿。祝大家中秋快乐，阖家幸福！ |
| ![图片](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7372672671/p1025119.webp) 提取图中的：['发票代码','发票号码','到站','燃油费','票价','乘车日期','开车时间','车次','座号']，请你以JSON格式输出。 | {"发票代码": "221021325353","发票号码": "10283819","到站": "开发区","燃油费": "2.0","票价": "8.00<全>","乘车日期": "2013-06-29","开车时间": "流水","车次": "040","座号": "371"} |
| ![图片](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7372672671/p1025123.webp) 根据我的草图设计使用HTML、CSS创建网页，主色调为黑色。 | ![图片](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7372672671/p1025124.png) 网页预览效果 |
