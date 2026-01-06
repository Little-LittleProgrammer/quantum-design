# 视觉理解 MCP

<Info>
  视觉理解 MCP Server 是一个基于模型上下文协议 (Model Context Protocol) 的 qwen3-vl-plus 能力实现，为 Claude Code, Cline 等兼容 MCP 的客户端提供智谱的强大能力，包括图像分析、视频理解等功能。
</Info>

## 产品简介

<Tip>
  此拥有视觉能力的 Local MCP Server 让您的 Code Agent 拥有眼睛，视觉理解。
</Tip>

<Note>
  除了 Claude Code 之外，直接在客户端粘贴图片无法调用此 MCP Server，客户端默认会将图片转码后直接调用模型接口。\
  最佳实践是将图片放到本地目录，通过对话的方式指定图片名称或路径来调用 Mcp Server。\
  例如: `What does demo.png describe?`
</Note>

## 功能特性

<CardGroup cols={3}>
  <Card title="图像分析" icon={<svg style={{maskImage: "url(/resource/icon/image.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持多种图像格式的智能分析和内容理解，让您的 AI Agent 拥有视觉
  </Card>

  <Card title="视频理解" icon={<svg style={{maskImage: "url(/resource/icon/video.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持本地视频与远端视频的视觉理解
  </Card>
</CardGroup>

## 支持的工具

该服务器实现了模型上下文协议，可与任何兼容 MCP 的客户端一起使用，模型可根据用户 Prompt 自主调用最匹配的工具，实现在以下类型任务中更精准的效果。目前提供以下工具：

* **`ui_to_artifact`** - 将 UI 截图转换为代码、提示词、设计规范或自然语言描述，覆盖从前端落地到生成式设计提示的全流程
* **`extract_text_from_screenshot`** - 使用先进的 OCR 能力从截图中提取和识别文字。专门用于代码、终端输出、文档和通用文本的提取
* **`diagnose_error_screenshot`** - 解析错误弹窗、堆栈和日志截图，给出定位与修复建议
* **`understand_technical_diagram`** - 针对架构图、流程图、UML、ER 图等技术图纸生成结构化解读
* **`analyze_data_visualization`** - 阅读仪表盘、统计图表，提炼趋势、异常与业务要点
* **`ui_diff_check`** - 对比两张 UI 截图，识别视觉差异和实现偏差。专门用于 UI 质量保证和设计到实现的验证
* **`image_analysis`** - 通用图像理解能力，适配未被专项工具覆盖的视觉内容
* **`video_analysis`** - 支持 MP4/MOV/M4V(限制本地最大8M) 等格式的视频场景解析，抓取关键帧、事件与要点


## 实现方式

### mcp 调用
支持 本地路径、 url 、 base64 调用
如果是本地路径，要通过 js 先转化为 base64

### 图片视频理解

使用 阿里云百炼 实现 图片的所有解析能力
模型：qwen3-vl-plus

### 使用案例

#### 图片理解

```bash
curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
-H "Authorization: Bearer $DASHSCOPE_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "model": "qwen3-vl-plus",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
          # 支持 base64， 远程url
            "url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg"
          }
        },
        {
          "type": "image_url",
          "image_url": {
          # 支持 base64， 远程url
            "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/tiger.png"
          }
        },
        {
          "type": "text",
          "text": "这些图描绘了什么内容？"
        }
      ]
    }
  ]
}'
```
#### 视频理解

```bash
curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "qwen3-vl-plus",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "video_url",
            "video_url": {
              # 视频url, 支持 base64， 远程url
              "url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241115/cqqkru/1.mp4"
            },
            "fps":2
          },
          {
            "type": "text",
            "text": "这段视频的内容是什么?"
          }
        ]
      }
    ]
  }'
```
