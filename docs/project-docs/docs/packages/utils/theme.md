# 主题

更改主题颜色

## 方法

| 方法名    |                       方法                       | 说明              |
| -------- | -------------------------------------------------| ---------------- |
| update_theme | `(mode: string \| null = 'light') => void`   | 更新主题     |
| add_skin   |  `(content: string) => void`   | 添加样式 |
| reserve_color | `(colorStr: string) => string`  | 反转颜色          |
| mix_darken  | `(el: Element, cls: string) => void` | 融合黑色      |
| mix_lighten  | `(el: Element, cls: string) => void` | 融合白色      |

## 使用方法

前提`import { xxx } from '@/assets/ts/domTools'`

### update_theme
```js
update_theme('light')

```

### add_skin
```js
/**
 * return {top: 10, left: 10}
*/
add_skin(`
    .demo {
        color: red
    }
`)

```

### reserve_color
```js
/**
 * return '#FFF'
*/
reserve_color('000' | '#000')

```

### mix_darken
```js
/**
 * 颜色混合000
 * @param colorStr 颜色的string值
 * @param weight 轻重 越低越接近传入值
 */
mix_darken('000' | '#000', 0.5)

```
### mix_lighten
```js
/**
 * 颜色混合fff
 * @param colorStr 颜色的string值
 * @param weight 轻重 越低越接近传入值
 */
mix_lighten('000' | '#000', 0.5)

```

