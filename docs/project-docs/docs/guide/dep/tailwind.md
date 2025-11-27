# Tailwind CSS 集成指南

Quantum Design 框架已集成 Tailwind CSS，提供现代化的原子 CSS 解决方案，支持主题定制和 CSS 变量集成。

## 概述

Tailwind CSS 是一个功能类优先的 CSS 框架，它提供了低级实用程序类，可以直接在 HTML 中组合以构建任何设计，而无需离开 HTML。

在 Quantum Design 中，我们通过 `@quantum-design-configs/tailwind` 包提供了预配置的 Tailwind 设置，与我们的设计系统和主题机制完美集成。

## 安装

项目已经在 `pnpm-workspace.yaml` 中配置了 Tailwind CSS 相关依赖：

```yaml
# Tailwind/PostCSS
'@manypkg/get-packages': '^2.2.2'
'@tailwindcss/typography': '^0.5.16'
'autoprefixer': '^10.4.20'
'cssnano': '^7.0.6'
'postcss': '^8.5.3'
'postcss-antd-fixes': '^0.2.0'
'postcss-import': '^16.1.0'
'postcss-preset-env': '^10.1.5'
'tailwindcss': '^3.4.17'
'tailwindcss-animate': '^1.0.7'
'@types/postcss-import': '^14.0.3'
```

在新项目中，只需要安装 `@quantum-design-configs/tailwind` 包：

```bash
pnpm add @quantum-design-configs/tailwind -D
```

## 配置

### 基础配置

在项目根目录创建 `tailwind.config.mjs` 文件：

```js
import tailwindConfig from '@quantum-design-configs/tailwind';

export default tailwindConfig;
```

### PostCSS 配置

创建 `postcss.config.mjs` 文件：

```js
import { postcssConfig } from '@quantum-design-configs/tailwind';

export default postcssConfig;
```

## 特性

### 自动内容检测

配置会自动检测并包含 monorepo 中的所有 packages 和 apps 目录下的文件：

```js
content: ['./index.html', ...tailwindPackages.map((item) => path.join(item, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'))];
```

### CSS 变量集成

Tailwind 配置与 CSS 变量系统完全集成，支持动态主题切换：

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
darkMode: 'selector';
```

这允许我们使用 `.dark` 类选择器来控制暗黑模式样式。

### 动画系统

内置丰富的动画效果：

```js
animation: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'collapsible-down': 'collapsible-down 0.2s ease-in-out',
  'collapsible-up': 'collapsible-up 0.2s ease-in-out',
  float: 'float 5s linear 0ms infinite',
}
```

### 插件

内置插件：

- `animate`: 提供基础动画效果
- `enterAnimationPlugin`: 自定义入场动画

## 与设计系统集成

### 颜色系统

Tailwind 配置中的颜色系统与我们的设计令牌系统完全集成：

```js
function createColorsPalette(name: string) {
  return {
    50: `var(--${name}-50)`,
    100: `var(--${name}-100)`,
    200: `var(--${name}-200)`,
    300: `var(--${name}-300)`,
    400: `var(--${name}-400)`,
    500: `var(--${name}-500)`,
    600: `var(--${name}-600)`,
    700: `var(--${name}-700)`,
    // 更多语义化命名
    active: `var(--${name}-700)`,
    'background-light': `var(--${name}-200)`,
    'background-lighter': `var(--${name}-100)`,
    'background-lightest': `var(--${name}-50)`,
    border: `var(--${name}-400)`,
    'border-light': `var(--${name}-300)`,
    hover: `var(--${name}-600)`,
    text: `var(--${name}-500)`,
    'text-active': `var(--${name}-700)`,
    'text-hover': `var(--${name}-600)`,
  };
}
```

### 间距和尺寸

预配置了符合设计规范的间距和尺寸：

```js
spacing: {
  '0': '0px',
  px: '1px',
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  // 更多尺寸...
}
```

### 边框圆角

使用 CSS 变量定义边框圆角，确保整个系统的一致性：

```js
borderRadius: {
  lg: 'var(--border-radius-base)',
  md: 'calc(var(--border-radius-base) - 2px)',
  sm: 'calc(var(--border-radius-base) - 4px)',
  xl: 'calc(var(--border-radius-base) + 4px)',
}
```

## 使用指南

### 基础用法

在 Vue 组件中直接使用 Tailwind 类名：

```vue
<template>
    <div class="bg-main text-success flex items-center justify-between p-4">
        <h1 class="text-2xl font-bold">标题</h1>
        <button class="bg-success hover:bg-success-hover rounded-lg px-4 py-2 text-white">按钮</button>
    </div>
</template>
```

### 主题切换

结合 `useDesignTokens` Hook 和 Tailwind 类名实现主题切换：

```vue
<template>
    <div :class="['p-4', isDark ? 'dark' : '']">
        <div class="bg-main rounded-lg p-4">
            <h2 class="text-xl font-medium">卡片标题</h2>
            <p class="text-gray-500 dark:text-gray-400">这段文字在暗黑模式下会自动切换颜色</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDesignTokens } from '@quantum-design/hooks';

const isDark = ref(false);
const { updateCssVariables } = useDesignTokens();

function toggleTheme() {
    isDark.value = !isDark.value;
    updateCssVariables({ isDark: isDark.value });
}
</script>
```

### 响应式设计

使用 Tailwind 的响应式前缀创建响应式布局：

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <!-- 内容 -->
</div>
```

### 与 Ant Design Vue 集成

Tailwind 配置已针对 Ant Design Vue 进行了优化，可以同时使用两者：

```vue
<template>
    <a-card class="shadow-md transition-shadow hover:shadow-lg">
        <div class="space-y-4">
            <h3 class="text-lg font-medium">卡片标题</h3>
            <p class="text-gray-600">卡片内容</p>
            <a-button type="primary" class="w-full"> 按钮 </a-button>
        </div>
    </a-card>
</template>
```

## 最佳实践

1. **优先使用 Tailwind 类名**：对于简单的样式，直接使用 Tailwind 类名
2. **组合使用 CSS 变量**：对于需要动态变化的样式，结合 CSS 变量使用
3. **避免内联样式**：尽量避免使用内联样式，优先使用 Tailwind 类名
4. **提取组件**：对于重复使用的 UI 模式，提取为组件
5. **使用主题变量**：使用 `bg-main`、`text-success` 等基于变量的类名，而不是硬编码的颜色值

## 扩展配置

如需扩展默认配置，可以创建自定义配置：

```js
import tailwindConfig from '@quantum-design-configs/tailwind';
import { mergeDeep } from '@quantum-design/utils';

export default mergeDeep(tailwindConfig, {
    // 自定义配置
    theme: {
        extend: {
            colors: {
                custom: '#ff0000',
            },
        },
    },
});
```
