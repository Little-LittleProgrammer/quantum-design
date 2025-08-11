# eslint

## 简介

npm 包名称: `@quantum-design/eslint`

当前版本: 1.0.2

提供了公共的 eslint 配置, 包括

1. `eslint-base.js`, 对应基础 eslint 配置
2. `eslint-tslib.js`, 用于 lib 包
3. `eslint-vue.js`, 用于 vue 项目

## 使用

```js
module.exports = {
    extends: [require.resolve('@quantum-design-configs/eslint/eslint-vue')],
};
```
