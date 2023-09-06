# 开始
## 快速开始
1. 拷贝 `template/nuxt3`代码
2. `pnpm i ` 安装依赖
3. `pnpm dev` 运行代码

## 已有模块
> 以下模块以及里面包含的所有组件已经完成按需导入，项目中直接使用即可
### 组件模块
`ant-design-vue``@q-front-npm/vue3-pc-ui-nuxt`, `@q-front-npm/vue3-antd-pc-ui-nuxt`

### 功能模块
`vue`、`pinia`、`pwa`

### 通讯模块
`useCustomFetch`

#### 通讯模块使用方式
```vue
const http = useCustomFetch();

const {data} = await http.get({url: 'xxx', params: 'xxx'})

const {data} = await http.post({url: 'xxx', params: 'xxx'})

const {data} = await http.upload({url: 'xxx', params: 'xxx'})
```