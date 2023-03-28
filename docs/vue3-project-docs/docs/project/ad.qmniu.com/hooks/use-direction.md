# 定向

## 功能
> 目录: apps/ad.qmniu.com/src/hooks/operation-module/use-direction.ts
目的: 因为定向组件大部分地方都会用到, 避免每次引用都重复请求数据, 所以提取出来

1. 根据传入的`platform`, 请求 下拉框

::: tips
请求前将 `triPolicyTargeteEnums` 清空, 是为了让组件可以判断这个属性是否存在
:::