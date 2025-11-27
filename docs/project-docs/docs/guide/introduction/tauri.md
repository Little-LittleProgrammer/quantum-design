# Tauri 支持

Quantum Design 现已集成 Tauri 2.0，支持构建高性能、安全的跨平台桌面应用。

## 什么是 Tauri

Tauri 是一个用于构建跨平台桌面应用的框架，它使用 Web 前端技术构建 UI，使用 Rust 构建后端，具有以下特点：

- **体积小**：比 Electron 应用小 10-100 倍
- **安全**：基于 Rust 的安全特性和基于能力的权限系统
- **性能高**：底层使用 Rust 和系统 WebView
- **跨平台**：支持 Windows、macOS 和 Linux

## 依赖版本

根据 `pnpm-workspace.yaml`，项目使用以下 Tauri 依赖：

```yaml
# 客户端
'@tauri-apps/cli': '^2'
'@tauri-apps/api': '^2'
'@tauri-apps/plugin-fs': '~2'
'@tauri-apps/plugin-notification': '^2'
'@tauri-apps/plugin-opener': '^2'
```

## Playground 中的 Tauri 示例

在 `apps/playground` 中已集成了 Tauri 示例，提供了以下功能演示：

### 基础功能

- 基础的 UI 交互
- 前端与 Rust 后端的通信
- 命令调用与参数传递

### 高级功能

- 流式数据传输（支持 SSE 和二进制流）
- 文件系统操作（读写文件、目录操作）
- 系统通知（带权限请求）
- 打开 URL 和文件
- 运行系统命令
- 系统对话框

## 项目结构

Tauri 项目结构如下：

```
apps/playground/
  ├── src/                  # 前端代码
  │   └── views/demo/tauri/ # Tauri 示例页面
  │       ├── index.vue     # 主界面
  │       └── stream.ts     # 流式传输工具
  └── src-tauri/            # Rust 后端代码
      ├── src/              # Rust 源码
      │   ├── main.rs       # 主入口
      │   ├── lib.rs        # 库入口
      │   ├── fetch.rs      # HTTP 请求处理
      │   ├── stream.rs     # 流处理
      │   ├── http_utils.rs # HTTP 工具
      │   └── system.rs     # 系统功能
      ├── capabilities/     # 权限配置
      │   └── default.json  # 默认权限
      ├── Cargo.toml        # Rust 依赖配置
      └── tauri.conf.json   # Tauri 配置
```

## 开发指南

### 安装依赖

确保已安装 Rust 和系统依赖：

```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# macOS 依赖
xcode-select --install

# Windows 依赖
# 安装 Visual Studio 2022 并选择"使用 C++ 的桌面开发"工作负载

# Linux 依赖 (Ubuntu/Debian)
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

### 开发命令

项目已配置了 npm 脚本，可以直接使用：

```bash
# 开发模式
pnpm tauri:dev

# 构建应用
pnpm tauri:build
```

这些命令会在 `package.json` 中调用 Turbo 进行构建：

```json
"scripts": {
  "tauri": "turbo run tauri",
  "tauri:dev": "turbo run tauri:dev",
  "tauri:build": "turbo run tauri:build"
}
```

### 权限系统

Tauri 2.0 引入了基于能力的权限系统，在 `src-tauri/capabilities/default.json` 中配置：

```json
{
    "permissions": ["path:default", "event:default", "window:default", "app:default", "resources:default", "menu:default", "tray:default", "shell:allow-open", "fs:scope-app", "fs:scope-app-data", "fs:scope-app-local-data", "notification:default"]
}
```

主要权限说明：

- **path:default**: 路径操作权限
- **event:default**: 事件系统权限
- **window:default**: 窗口操作权限
- **app:default**: 应用操作权限
- **shell:allow-open**: 允许打开 URL
- **fs:scope-xxx**: 文件系统访问范围
- **notification:default**: 系统通知权限

## 示例代码

### 前端调用 Rust 函数

```typescript
import { invoke } from '@tauri-apps/api/core';

// 调用 Rust 函数
const result = await invoke('greet', { name: 'World' });
```

### Rust 命令定义

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 文件系统操作

```typescript
import { exists, readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

// 检查文件是否存在
const fileExists = await exists('config.json', { baseDir: BaseDirectory.AppData });

// 读取文件
if (fileExists) {
    const content = await readTextFile('config.json', { baseDir: BaseDirectory.AppData });
    console.log('配置内容:', JSON.parse(content));
}

// 写入文件
await writeTextFile('config.json', JSON.stringify({ key: 'value' }), {
    baseDir: BaseDirectory.AppData,
});
```

### 系统通知

```typescript
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

// 检查通知权限
let permissionGranted = await isPermissionGranted();

// 如果没有权限，请求权限
if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
}

// 发送通知
if (permissionGranted) {
    await sendNotification({
        title: '操作完成',
        body: '您的任务已成功完成！',
    });
}
```

### 打开 URL 和文件

```typescript
import { openUrl, revealItemInDir } from '@tauri-apps/plugin-opener';

// 打开网页
await openUrl('https://tauri.app');

// 在文件管理器中显示文件
await revealItemInDir('config.json', { baseDir: BaseDirectory.AppData });
```

### 流式数据处理

```typescript
// 从 stream.ts 导入流处理函数
import { streamFetch } from './stream';

// 流式请求
const response = await streamFetch('https://api.example.com/stream', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-SSE': 'enable',
    },
    body: JSON.stringify({ query: 'data' }),
});

// 处理流式响应
const reader = response.body?.getReader();
if (reader) {
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        console.log('收到数据:', text);
    }
}
```

## 打包与发布

### 配置应用信息

在 `src-tauri/tauri.conf.json` 中配置应用信息：

```json
{
    "package": {
        "productName": "Quantum App",
        "version": "0.1.0"
    },
    "build": {
        "beforeBuildCommand": "pnpm build",
        "beforeDevCommand": "pnpm dev",
        "devUrl": "http://localhost:5173",
        "frontendDist": "../dist"
    },
    "app": {
        "security": {
            "csp": null
        },
        "windows": [
            {
                "fullscreen": false,
                "height": 720,
                "resizable": true,
                "title": "Quantum App",
                "width": 1280
            }
        ]
    }
}
```

### 构建应用

```bash
# 构建生产版本
pnpm tauri:build
```

构建完成后，可以在 `src-tauri/target/release/bundle` 目录下找到打包好的应用：

- **Windows**: `.msi` 和 `.exe` 安装程序
- **macOS**: `.dmg` 和 `.app` 应用
- **Linux**: `.deb`、`.AppImage` 等格式

## 最佳实践

1. **权限最小化**：仅启用应用所需的最小权限集
2. **错误处理**：在前端和 Rust 代码中都实现完善的错误处理
3. **异步操作**：对于 I/O 操作，使用异步函数避免阻塞 UI
4. **资源释放**：确保正确关闭文件和网络连接
5. **版本兼容性**：注意 Tauri API 版本兼容性，特别是在 2.x 版本中
