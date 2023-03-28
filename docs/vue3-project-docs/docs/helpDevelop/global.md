# 全局

## 全局接口

> 目录: XXXX/types, 可根据实际情况更改

```js
// global.d.ts
ISelectOption: 筛选项
ISelectList<T extends string>: 筛选项集合
IApiTableData<T extends string, V extends string>: 接口返回的 table 数据
ITableData<T extends string>: <T extends string>
IPageOption: 分页信息
IModalData: modal信息
TimeoutHandle: timeout 方法
IntervalHandle: interval 方法

// http.d.ts
Result: http相应
UploadFileParams: 文件上传

// index.d.ts
SelectPartial<T, V extends keyof T>: <T, K>将 T 中的 K 属性变成必须
Nullable<T>: 给 T 增加 null
Recordable<K>: Record<K, string>
Fn<T = any, R = T>: 普通方法
PromiseFn<T = any, R = T>: Promise方法
RefType
TargetContext: // window.open
ComponentElRef<T extends HTMLElement = HTMLDivElement> {$el: T;}
ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
ElRef<T extends HTMLElement = HTMLDivElement>
ChangeEvent: change 事件

// router.d.ts
menuData: 接口返回的菜单信息
RouteMeta: router的meta
```


