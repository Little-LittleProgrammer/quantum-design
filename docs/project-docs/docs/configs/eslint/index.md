# eslint

## 简介
npm包名称: `@wuefront/eslint`

当前版本: 1.0.3


提供了公共的eslint配置, 包括
1. `eslint-base.js`, 对应基础eslint配置
2. `eslint-tslib.js`, 用于 lib包
3. `eslint-vue.js`, 用于 vue 项目

## 使用

```js
module.exports = {
    extends: [require.resolve('@wuefrontnfigs/eslint/eslint-vue')]
};

```