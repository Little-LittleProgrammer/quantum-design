# 组件注册

## 按需引入
1. 使用vite 的 `vite-plugin-components`
```js
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';

plugins: [
  ViteComponents({
      customComponentResolvers: [AntDesignVueResolver()]
  })
]
```
这种方式,会按需引入 antd 组件及其样式, 当页面加载到此组件后, 再去请求相关代码与样式

:::tip 说明
本项目未用此方式, 是因为使用了scss语言以及使用了主题切换功能, 使用按需加载, 会让css资源重复加载
:::


## 全局注册

如果不习惯按需引入方式，可以进行全局注册。全局注册也分两种方式

### 全局按需注册

**本项目采用此方式**

只注册需要的组件

代码地址：[src/components/antd.ts]()

```ts
import type { App } from 'vue';
// import { Icon } from './Icon';
import {
    ConfigProvider, // 全局化配置
    Layout, // 布局
    Row, // 布局
    Col, // 布局
    Menu, // 总览菜单
    DatePicker, // 日期选择框
    Form, // 表单
    Radio, // 单选框
    Checkbox, // 多选框
    Select, // 选择器
    Switch, // 开关
    Input, // 输入框
    Button, // 按钮
    Table, // 表格
    Tabs, // 标签页
    Tag, // 标签
    Tree, // 树
    Modal, // 对话框
    Upload, // 上传
    Tooltip, // 文字提示气泡框
    Popconfirm, // 气泡确认框
    Popover, // 气泡卡片
    InputNumber, // 数字输入框
    Steps, // 步骤
    Statistic, // 数据展示
    Transfer, // 穿梭框
    Card, // 卡片模块,
    Pagination, // 分页
    Empty, // 空状态
    // AutoComplete, // 自动完成
    // Descriptions, // 描述列表
    // PageHeader, // 页头
    // Divider, // 分割线
    // Badge, // 徽标数
    // Cascader, // 级联选择
    Result // 结果
} from 'ant-design-vue';

export function registerGlobComp(app: App) {
    app.use(Input).use(Button).use(Layout).use(ConfigProvider).use(Row)
        .use(Col).use(Menu).use(DatePicker).use(Form).use(Radio).use(Checkbox)
        .use(Select).use(Switch).use(Table).use(Tag).use(Tabs).use(Tree).use(Modal)
        .use(Upload).use(Tooltip).use(Popconfirm).use(Popover).use(InputNumber).use(Steps)
        .use(Statistic).use(Transfer).use(Card).use(Result).use(Pagination).use(Empty);
}
```

### 全量注册

- 在`main.ts`内

```ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
const app = createApp(App);
app.use(Antd);
```

