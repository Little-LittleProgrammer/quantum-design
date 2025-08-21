# useDesignTokens

`useDesignTokens` 是一个用于管理设计令牌（Design Tokens）和 CSS 变量的 Hook，支持动态主题切换和颜色系统管理。

## 基本用法

```typescript
import { useDesignTokens } from '@quantum-design/hooks';

const { updateCssVariables, generateColors } = useDesignTokens();
```

## 功能特性

### CSS 变量管理

`useDesignTokens` 提供了一套完整的 CSS 变量管理方案，支持：

- 基础颜色系统
- 暗黑模式切换
- 动态主题色生成
- 组件样式变量

### 与 Tailwind CSS 集成

设计令牌系统与 Tailwind CSS 完全集成，可以在 Tailwind 类中使用 CSS 变量：

```html
<div class="bg-success text-header">使用 CSS 变量定义的颜色</div>
```

### 动态主题色生成

```typescript
import { useDesignTokens } from '@quantum-design/hooks';

const { generateColors } = useDesignTokens();

// 根据主色生成色板
const colorPalette = generateColors('#1890ff');
```

## API 参考

### updateCssVariables

更新文档根元素的 CSS 变量。

```typescript
function updateCssVariables(options: { primaryColor?: string; isDark?: boolean; customVariables?: Record<string, string> }): void;
```

### generateColors

根据主色生成完整的颜色系统。

```typescript
function generateColors(primaryColor: string): Record<string, string>;
```

## 使用示例

### 切换暗黑模式

```typescript
import { useDesignTokens } from '@quantum-design/hooks';

const { updateCssVariables } = useDesignTokens();

// 切换到暗黑模式
updateCssVariables({ isDark: true });

// 切换到亮色模式
updateCssVariables({ isDark: false });
```

### 更改主题色

```typescript
import { useDesignTokens } from '@quantum-design/hooks';

const { updateCssVariables } = useDesignTokens();

// 更改主题色
updateCssVariables({ primaryColor: '#f5222d' });
```

### 自定义 CSS 变量

```typescript
import { useDesignTokens } from '@quantum-design/hooks';

const { updateCssVariables } = useDesignTokens();

// 自定义 CSS 变量
updateCssVariables({
    customVariables: {
        '--header-bg': '#f0f2f5',
        '--body-bg': '#ffffff',
    },
});
```
