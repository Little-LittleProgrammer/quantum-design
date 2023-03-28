# 数据部分筛选框校验

## 功能

> 目录: apps/ad.qmniu.com/src/hooks/data-module/use-validator.ts

目的: 为了避免维度太多导致大数据查询缓慢

1. 当数据维度选择了`客户端版本`、 `市场渠道`、 `tagid`, 并且这三个维度的筛选框未选择时, 会进行提示, 并拒绝查询
2. 因为所有报表都会涉及此部分, 所以提出hooks, 方便复用