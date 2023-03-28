# domTools

dom操作方法

## 方法

| 方法名    |                                 方法                              | 说明              |
| -------- | ------------------------------------------------------------------ | ---------------- |
| css      | `(dom:HTMLElement, key: string | CSSStyleDeclaration, value:string) => void`   | 给元素设置样式     |
| offset   |  `(dom: Element & HTMLElement) => { left: number, top: number}`   | 计算当前元素距离body的偏移量 |
| hasClass | `(el: Element, cls: string) => boolean`  | 是否有此class          |
| addClass  | `(el: Element, cls: string) => void` | 添加class      |
| removeClass  | `(el: Element, cls: string) => void` | 删除class      |
| on  | `(element: Element | HTMLElement | Document | Window, event: string, handler: EventListener | EventListenerObject)=>void` | 绑定事件      |
| off  | `(element: Element | HTMLElement | Document | Window, event: string, handler: EventListener | EventListenerObject)=>void` | 移除事件      |

## 使用方法

前提`import { xxx } from '@/assets/ts/domTools'`

### css
```js
css(dom, 'background', '#FFF') 或者
css(dom, {
  background: '#FFF',
  color: '#000' 
})
```

### offset
```js
/**
 * return {top: 10, left: 10}
*/
offset(dom)

```

### hasClass
```js
/**
 * return true ? false
*/
hasClass(dom, 'container')

```

### addClass
```js
/**
 * <div class="container flex w-100">
*/
addClass(dom, 'container, flex, w-100')

```
### removeClass
```js
/**
 * <div class="">
*/
removeClass(dom, 'container, flex, w-100')

```

### on
```js
/**
 * 添加事件
*/
const event = (e) => {
  console.log(e)
}
on(dom, 'click', event)

```

### off
```js
/**
 * 删除事件
*/
const event = (e) => {
  console.log(e)
}
off(dom, 'click', event)

```

