# 黑暗主题

## 介绍

项目已经内置了黑暗主题切换，只需配置自己需要的颜色变量，即可在项目中使用

主题已经存入 localStorage 中


## 原理

1. 通过 vite.config.ts 设置主题色
  ```js
      css: {
          preprocessorOptions: {
              less: {
                  modifyVars: _antdCssData,
                  javascriptEnabled: true
              },
              scss: {
                  additionalData: _baseScssFile
              }
          }
      },
  ```
2. vite项目引入静态资源时, 会自动解析并返回其字符串
  例: 
  ```css
  // demo.scss
  .demo {
    color: #FFF
    .demo1 {
      background: #000
    }
  }
  ```

  ```js
  import demo from 'demo.scss'

  /**
   * .demo {
     color: #FFF
   }
   .demo .demo1 {
     background: #000
   }
  */
  console.log(demo)
  ```
3. 引入 ant-design-vue, 自带基础版的黑暗主题 `antd.dark.less` 与正常主题 `antd.less` 
  ```js
    import dark from 'ant-design-vue/dist/antd.dark.less';
    import lighter from 'ant-design-vue/dist/antd.less';
  ```
4. 通过全局方法 动态配置主题, 将 dark 和light 字符串, 通过dom方法,添加至head中
```js
  const $styleDom = document.createElement('style');
  $styleDom.dataset.type = 'theme';
  $styleDom.innerHTML = content // dark . light;
  _head.insertBefore($styleDom, $startDom);
```

5. 因为 import 引入了即挂载了, 所以之后要删除掉 之前引入的两个antd原生样式
```js
for (let i = _getStyle.length - 1; i >= 0; i--) {
    if (_getStyle[i]?.innerHTML.includes('style-start-load')) {
        $startDom = _getStyle[i];
    }
    // 删除 antd 的 样式
    if (_getStyle[i]?.innerHTML.includes('[class^=ant-]::-ms-clear')) {
        _getStyle[i].remove();
    }
}
```
6. 引入的 antd 自带主题包 只适用与大部分的场景, 小部分场景,以及自定义样式, 需要自己手动去配置
```css
// mixin.scss
// 背景色
@mixin bg-color($key) {
    background-color: map-get($colors-light, $key);
    [data-theme="dark"] & {
      background-color: map-get($colors-dark, $key);
    }
  }
// text色
@mixin text-color($key) {
    color: map-get($colors-light, $key);
    [data-theme="dark"] & {
        color: map-get($colors-dark, $key);
    }
}
// border色
@mixin border-color($key, $direct:'') {
    @if $direct == '' {
        border-color: map-get($colors-light, $key);
        [data-theme="dark"] & {
            border-color: map-get($colors-dark, $key);
        }
    }
    @else {
        border-#{$direct}-color: map-get($colors-light, $key);
        [data-theme="dark"] & {
            border-#{$direct}-color: map-get($colors-dark, $key);
        }
    }
    
}

```

7. 最最主要一点, 是防止样式覆盖, 所以,在‘vite-project’项目的 app.vue 中, 定义了` data-type="start"` 的style, 然后通过insertBefore插入, 以确保antd的样式引入在这前面 (也可通过增加样式权重去实现不被覆盖)


## 配置

```css
// 浅色
$colors-light: (
    body-bg: $body-bg,
    aside-bg: $aside-bg,
    table-even-bg: $table-even-bg,

    border-color: $border-color-base,
    text-color: $text-color,
    text-color-secondary: $text-color-secondary,
    heading-color: $heading-color
);
 
// 深色
$colors-dark: (
    body-bg: #000,
    aside-bg: rgb(29, 29, 29),
    table-even-bg: rgb(29, 29, 29),

    border-color: #303030,
    text-color: #c9d1d9,
    text-color-secondary: #8b949e,
    heading-color: rgba(255,255,255,0.85)
);
```

## 切换
> 目录 : [src/assets/ts/theme.ts]
```js

/**
 * 更改主题
 * @param mode 主题模式
 */
update_theme()
```
