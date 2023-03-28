# 数据处理

## 使用

::: tip

因为 服务端对于价格与百分比 需要存成整数特殊处理, 所以我们在上传时需要统一拦截数据进行处理

:::

1. 如何服务端商量需要处理, 请加入到对应位置, [apps/ad.qmniu.com/src/hooks/specific/use-values-deal.ts](apps/ad.qmniu.com/src/hooks/specific/use-values-deal.ts)

```ts
// apps/ad.qmniu.com/src/hooks/specific/use-values-deal.ts
// 如何服务端商量需要处理, 请加入到对应位置
const specificDealWanEnums = ['second_price_ratio', 'discount', 'percent', 'display_percent', 'factor'];// 10000
const specificDealBaiEnums = ['floor_price', 'reserve_price', 'price', 'second_price_value', 'cpm_limit']; // 100

_values = get_format_decimals_values(_values) // 除以10000 或 100
_values = set_format_decimals_values(_values) // 乘以10000 或 100

```

2. 如果该接口有相同字段且不需要处理, 请在配置接口时, 按以下处理
```js
export function api_policy_get_uni_detail(params: Record<'id', number>) {
    return defHttp.get<Result<IPolicyUniDetail>>({
        url: Api.policyUniDetail,
        params
    }, {
        notDeal: true
    });
}
```

## 原理

进行递归寻找, 对于设置字段进行处理
