# 组件库文档开发手册

::: danger 注意: 对于需要写文档的业务组件
1. 组件开发时, 禁止使用别名引入文件,  
    例如: `@/xxx` 必须写成 `../**/xxx`的格式
:::

### 步骤
1. 在项目的`package.json`中, 按照以下代码配置
```json
{
    ...,
    "exports": {
        "./components/": "./src/components/"
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

### 文档开发

1. 为了增加代码查看与复制按钮, 变成类似` antd` 官网的格式, 必须使用 `code-view` 进行包装
2. 为了使代码高亮, 请使用 `highlight-code` 组件
3. 对于具体项目, 请在 `project/xxxx` 建立项目目录(xxx为项目名称), 在里面书写 业务组件代码

**举例**
> 具体可以参考[button](/project/ad.qmniu.com/comp/button)

```vue

<script setup>
    import {QButtonGroup} from '@components/ad.qmniu.com/q-buttom'
</script>

<code-view title="基本用法" description="基本按钮用法">
    <QButtonGroup xxx> </QButtonGroup>
    <div #codeText>
        <highlight-code code="let a= 1">
    </div>
</code-view>

```



<code-view title="基本用法" description="基本按钮用法">
    <div xxx>123123 </div>
    <template #codeText>
        <highlight-code code="let a= 1"/>
    </template>
</code-view>

::: tip
赶时间上工, 如果有bug或者什么问题, 可以联系我
:::