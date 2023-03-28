# 组件库文档开发手册

::: danger 注意: 对于需要写文档的业务组件
1. 在开发组件时, 必须将所有依赖都引入到当前开发组件中  
    例如: 对于全局引入的组件(a-button), 必须在组件中引入一次
2. 组件开发时, 禁止使用别名引入文件,  
    例如: `@/xxx` 必须写成 `../**/xxx`的格式
:::

### 步骤
1. 在项目的`package.json`中, 按照以下代码配置
```json
{
    ...,
    "exports": {
        "./components": "./src/components/"
    },
    ...
}
```
2. 在 文档项目的`package.json`中, 按照以下代码配置(以`ad.qmniu.com`举例)
```json
{
    ...,
    "dependencies": {
        ...,
        "ad.qmniu.com": "workspace:*",
        ...
    },
    ...
}
```
3. 对于不常用的组件, 在md文件中直接使用(以`ad.qmniu.com`举例)
```vue
<script setup>
    import {QButtonGroup} from '@components/ad.qmniu.com/q-buttom'
</script>

<QButtonGroup> </QButtonGroup>

```

4. 对于经常用组件, 在`vue3-project-docs/docs/.vitepress/theme/index.ts` 中 使用 `enhanceApp` 注册

### 开发

1. 为了增加代码查看与复制按钮, 变成类似` antd` 官网的格式, 必须使用 `code-view` 进行包装

```vue

<script setup>
    import {QButtonGroup} from '@components/ad.qmniu.com/q-buttom'
</script>

<code-view title="基本用法" description="基本按钮用法">
    <QButtonGroup xxx> </QButtonGroup>
    <div #codeText>
        ```vue
            <div class="demo-button">
            <div>
            <q-button>默认按钮</q-button>
            <q-button type="primary">主要按钮</q-button>
            <q-button type="success">成功按钮</q-button>
            <q-button type="info">信息按钮</q-button>
            <q-button type="warning">警告按钮</q-button>
            <q-button type="danger">危险按钮</q-button>
            </div>
        </div>
        ```
    </div>
</code-view>

```



<code-view title="基本用法" description="基本按钮用法">
    <div xxx>123123 </div>
    <template #codeText>
       ```vue
       ```
    </template>
</code-view>