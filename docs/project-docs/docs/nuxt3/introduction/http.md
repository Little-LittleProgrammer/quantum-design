# 通讯模块

> 文件地址 composables/http/use-custom-fetch.ts
## 通讯模块可扩展配置
```ts
// 默认将prefix 添加到url
joinPrefix: true,
// 是否返回原生响应头 比如：需要获取响应头时使用该属性
isReturnNativeResponse: false,
//  是否加入时间戳
joinTime: true,
// 是否在请求中加入环境参数
env: () => '',
// 是否加入cokie
// joinCookie: true,
// 忽略重复请求
cancelToken: true,
// 是否携带token
withToken: true,
// 消息提示类型
errorMessageMode: 'message',
// 接口地址
apiUrl: '',
uploadUrl: '',
// 接口拼接地址
urlPrefix: 'api'
```