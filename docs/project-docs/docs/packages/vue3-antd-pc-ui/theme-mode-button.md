# q-theme-mode-button 主题模式切换按钮

`q-theme-mode-button` 是一个用于切换明亮/暗黑主题模式的按钮组件。

## 基本用法

```vue
<template>
    <q-theme-mode-button />
</template>

<script setup lang="ts">
import { QThemeModeButton } from '@quantum-design/vue3-antd-pc-ui';
</script>
```

## 功能特性

- 支持明亮/暗黑主题模式切换
- 自动保存用户主题偏好
- 与 CSS 变量和 Tailwind CSS 集成
- 支持系统主题跟随

## 属性

| 属性名       | 类型                                     | 默认值       | 说明         |
| ------------ | ---------------------------------------- | ------------ | ------------ |
| size         | `'small' \| 'default' \| 'large'`        | `'default'`  | 按钮大小     |
| placement    | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'`   | 图标位置     |
| showTooltip  | `boolean`                                | `true`       | 是否显示提示 |
| tooltipTitle | `string`                                 | `'切换主题'` | 提示文本     |

## 事件

| 事件名 | 说明               | 回调参数                    |
| ------ | ------------------ | --------------------------- |
| change | 主题模式变化时触发 | `(isDark: boolean) => void` |

## 示例

### 自定义大小和位置

```vue
<template>
    <q-theme-mode-button size="large" placement="right" :showTooltip="true" tooltipTitle="切换明亮/暗黑模式" @change="handleThemeChange" />
</template>

<script setup lang="ts">
import { QThemeModeButton } from '@quantum-design/vue3-antd-pc-ui';

const handleThemeChange = (isDark: boolean) => {
    console.log('当前是暗黑模式:', isDark);
};
</script>
```

### 与 CSS 变量集成

主题模式按钮会自动更新文档根元素上的 CSS 变量，与 `useDesignTokens` Hook 配合使用：

```vue
<template>
    <div>
        <q-theme-mode-button @change="handleThemeChange" />
        <div class="bg-main text-success p-4">这个区域会根据主题模式自动切换样式</div>
    </div>
</template>

<script setup lang="ts">
import { QThemeModeButton } from '@quantum-design/vue3-antd-pc-ui';
import { useDesignTokens } from '@quantum-design/hooks';

const { updateCssVariables } = useDesignTokens();

const handleThemeChange = (isDark: boolean) => {
    // 可以在这里执行额外的主题相关操作
    updateCssVariables({
        isDark,
        // 可以同时更新其他变量
        customVariables: {
            '--header-bg': isDark ? '#1f1f1f' : '#ffffff',
        },
    });
};
</script>
```
