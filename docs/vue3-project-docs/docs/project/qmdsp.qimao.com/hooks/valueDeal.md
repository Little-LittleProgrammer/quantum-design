# 数据处理

## 使用

::: tip

因为 业务需求 对用户输入内容，需要去除两端空格后进行保存，所以我们在发送请求时需要统一拦截数据进行处理

:::

1. 平台已统一拦截所有请求进行了格式处理，如要了解格式化实现原理可访问目录 [apps/qmdsp.qimao.com/src/hooks/specific/use-values-deal.ts](apps/qmdsp.qimao.com/src/hooks/specific/use-values-deal.ts)

2. 如业务开发中想单独使用此功能，可按以下方式调用
```js
import { set_format_trim_values } from '@/hooks/specific/use-values-deal';
_values = set_format_trim_values(_values);
```

## 原理

进行递归遍历, 对于每个字段进行处理
