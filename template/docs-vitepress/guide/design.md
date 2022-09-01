# 样式

## 介绍

主要介绍如何在项目中使用和规划样式文件。

默认使用 scss 作为预处理语言。

项目中使用的通用样式，都存放于 [src/assets/style/]() 下面。

```bash
.
├── includes # ant design 一些样式覆盖 已经全局 的定义, 尽量不要修改
├── ad-font.scss # 字体
├── ad-global.scss # 全局
├── ad-layout.scss # 布局
├── ad-manage.scss # 主题相关
├── ad-modal.scss  # 每个组件都会自动引入样式
└── global # 入口文件

```

::: tip 全局注入

base.scss 以及 mixin.scss 这个文件会被全局注入到所有文件，所以在页面内可以直接使用变量而不需要手动引入

:::


## 开启 scoped

没有加 `scoped` 属性，默认会编译成全局样式，可能会造成全局污染

```vue
<style></style>

<style scoped></style>
```

::: tip 温馨提醒

使用 scoped 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

:::

## 深度选择器

有时我们可能想明确地制定一个针对子组件的规则。

如果你希望 `scoped` 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 `>>>` 操作符。有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

详情可以查看 RFC[0023-scoped-styles-changes](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)。

使用 scoped 后，父组件的样式将不会渗透到子组件中，所以可以使用以下方式解决：

```vue
<style scoped>
  /* deep selectors */
  ::v-deep(.foo) {
  }
  /* shorthand */
  :deep(.foo) {
  }

  /* targeting slot content */
  ::v-slotted(.foo) {
  }
  /* shorthand */
  :slotted(.foo) {
  }

  /* one-off global rule */
  ::v-global(.foo) {
  }
  /* shorthand */
  :global(.foo) {
  }
</style>
```

## CSS 样式覆盖

针对 样式覆盖 以及 重复引用 问题，放到 [黑暗主题](/doc-next/dep/dark.html) 去详细说明


