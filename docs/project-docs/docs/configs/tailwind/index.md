# Tailwind CSS 配置

`@quantum-design-configs/tailwind` 提供了项目中使用的 Tailwind CSS 配置，支持主题定制和 CSS 变量集成。

## 安装

```bash
pnpm add @quantum-design-configs/tailwind -D
```

## 特性

- 自动检测并包含 monorepo 中的所有 packages 和 apps 目录下的文件
- 支持 CSS 变量与 Tailwind 集成
- 内置动画和过渡效果
- 暗黑模式支持
- 自定义颜色系统

## 使用方法

在项目根目录创建 `tailwind.config.mjs` 文件：

```js
import tailwindConfig from '@quantum-design-configs/tailwind';

export default tailwindConfig;
```

## 配置详情

### 颜色系统

配置支持通过 CSS 变量定义颜色，实现动态主题切换：

```js
const customColors = {
    green: {
        ...createColorsPalette('green-color'),
    },
    header: {
        DEFAULT: 'var(--header-bg)',
    },
    main: {
        DEFAULT: 'var(--body-bg)',
    },
    // 其他颜色...
};
```

### 暗黑模式

暗黑模式通过 CSS 选择器实现：

```js
darkMode: 'selector',
```

### 动画

内置多种动画效果：

```js
animation: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'collapsible-down': 'collapsible-down 0.2s ease-in-out',
  'collapsible-up': 'collapsible-up 0.2s ease-in-out',
  float: 'float 5s linear 0ms infinite',
},
```

### 插件

内置插件：

- `animate`: 提供基础动画效果
- `enterAnimationPlugin`: 自定义入场动画

## 与组件库集成

Tailwind CSS 配置已与 Vue 组件库集成，支持在组件中使用 Tailwind 类名和 CSS 变量：

```vue
<template>
    <div class="bg-main text-success">
        <!-- 组件内容 -->
    </div>
</template>
```
