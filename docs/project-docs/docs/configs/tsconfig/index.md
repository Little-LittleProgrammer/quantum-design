# eslint

## 简介

npm 包名称: `@quantum-design/tsconfig`

当前版本: 2.0.3

提供了公共的 eslint 配置, 包括

1. `base.json`, 对应基础 tsconfigt 配置
2. `lib.json`, 用于 lib 包
3. `vue.json`, 用于 vue3 项目

## 使用

```json
{
    "extends": "@quantum-design-configs/tsconfig/vue.json",
    "include": ["docs/**/*.ts", "docs/**/*.d.ts", "docs/**/*.tsx", "docs/**/*.vue", "node_modules/@quantum-design/types/**/*.d.ts"],
    "exclude": ["dist"]
}
```
