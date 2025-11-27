# HTTP 包单元测试

本目录包含 `@quantum-design/http` 包的完整单元测试套件。

## 📂 测试文件结构

```
__tests__/
├── axios-cancel.test.ts      # 请求取消机制测试
├── axios-retry.test.ts       # 请求重试机制测试
├── axios.test.ts             # VAxios 核心类测试
├── check-status.test.ts      # HTTP 状态码处理测试
├── helper.test.ts            # 辅助函数测试
├── index.test.ts             # 导出接口和 transform 测试
├── integration.test.ts       # 集成测试
└── interface.test.ts         # TypeScript 类型定义测试
```

## 🎯 测试覆盖范围

### 1. axios-cancel.test.ts
测试请求取消和防重复请求机制：
- `getPendingUrl` 函数生成唯一请求标识
- `AxiosCanceler` 类的增删改查操作
- 请求去重逻辑
- Map 数据结构的重置和清理

### 2. axios-retry.test.ts
测试请求失败后的自动重试机制：
- 重试次数控制
- 重试延迟时间配置
- 达到最大重试次数的处理
- Headers 清理逻辑
- 重试计数器管理

### 3. axios.test.ts
测试核心 VAxios 类的功能：
- 实例创建和初始化
- 拦截器配置
- HTTP 方法快捷方式（GET/POST/PUT/DELETE）
- FormData 序列化
- 文件上传功能
- 请求配置管理
- 响应数据处理

### 4. check-status.test.ts
测试 HTTP 状态码处理：
- 各种错误状态码的映射
- 自定义错误消息
- 回调函数调用
- 边界情况处理
- 常见 HTTP 状态码（401/403/404/408/500/502/503 等）

### 5. helper.test.ts
测试辅助工具函数：
- `joinTimestamp` - 时间戳添加
- `joinEnvToUrl` - 环境变量参数
- `joinCookieToUrl` - Cookie 处理
- `dealToken` - Token 管理（设置和获取）
- LocalStorage 交互
- RESTful 和对象两种参数格式

### 6. index.test.ts
测试默认配置和工厂函数：
- `defaultTransform` 的各种钩子函数
- `beforeRequestHook` - 请求前处理
- `requestInterceptors` - 请求拦截
- `responseInterceptors` - 响应拦截
- 错误拦截器
- `createAxios` 工厂函数
- 配置合并逻辑
- 重试机制触发条件

### 7. integration.test.ts
集成测试，测试完整的请求流程：
- 完整的请求-响应周期
- 多个请求并发处理
- 自定义 transform 配置
- 请求取消机制集成
- 文件上传流程
- 错误处理流程
- Token 认证流程
- 环境配置切换
- FormData 处理

### 8. interface.test.ts
TypeScript 类型定义测试：
- `RequestOptions` 接口
- `RetryRequest` 接口
- `CreateAxiosOptions` 接口
- `AxiosResponseAgent` 接口
- `CustomAxiosTransform` 抽象类
- `AxiosTransform` 抽象类
- 类型扩展性测试
- 泛型类型支持

## 🚀 运行测试

### 运行所有测试
```bash
pnpm test
```

### 监听模式（开发时使用）
```bash
pnpm test:watch
```

### 生成覆盖率报告
```bash
pnpm test:coverage
```

## 📊 测试统计

- **测试文件数量**: 8
- **测试用例总数**: 200+
- **覆盖的功能模块**: 100%
- **代码覆盖率目标**: > 90%

## 🔍 测试重点

### 核心功能
- ✅ HTTP 请求方法（GET/POST/PUT/DELETE）
- ✅ 请求/响应拦截器
- ✅ 错误处理和重试机制
- ✅ 请求取消和防重复
- ✅ Token 认证管理
- ✅ 文件上传
- ✅ FormData 处理

### 边界情况
- ✅ 空值和 undefined 处理
- ✅ 网络错误和超时
- ✅ 并发请求处理
- ✅ 配置合并和覆盖
- ✅ 类型安全检查

### 集成场景
- ✅ 完整请求流程
- ✅ 多拦截器链式调用
- ✅ 自定义配置扩展
- ✅ 环境切换
- ✅ 错误恢复机制

## 🛠️ 测试技术栈

- **测试框架**: Vitest
- **DOM 模拟**: happy-dom
- **Mock 工具**: Vitest Mock Functions
- **覆盖率工具**: @vitest/coverage-v8
- **TypeScript**: 原生类型检查

## 📝 编写测试的最佳实践

1. **测试命名**: 使用清晰的中文描述测试意图
2. **测试隔离**: 每个测试用例相互独立，使用 `beforeEach` 清理状态
3. **Mock 策略**: 合理使用 mock，避免过度 mock
4. **覆盖率**: 关注核心业务逻辑，确保关键路径被测试
5. **边界测试**: 测试异常情况和边界条件
6. **类型测试**: 利用 TypeScript 进行编译时类型检查

## 🐛 调试测试

### 运行单个测试文件
```bash
pnpm vitest __tests__/axios.test.ts
```

### 运行特定测试用例
```bash
pnpm vitest -t "应该能够创建实例"
```

### 查看详细输出
```bash
pnpm vitest --reporter=verbose
```

## 📚 相关文档

- [Vitest 官方文档](https://vitest.dev/)
- [Axios 官方文档](https://axios-http.com/)
- [项目主 README](../README.md)

## 🤝 贡献指南

添加新功能时，请确保：
1. 为新功能编写相应的单元测试
2. 测试覆盖率不低于 90%
3. 所有测试用例通过
4. 更新本 README 文档

## 📄 License

ISC

