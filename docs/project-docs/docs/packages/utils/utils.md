# tools

基本操作方法

## 方法

| 方法名    |                              方法                  | 说明              |
| -------- | -------------------------------------------------- | ---------------- |
| js_utils_deep_copy      | `(obj: T) => T`   | 深拷贝   |
| js_utils_get_uuid   |  `(len: number, radix: number) => string`   | 生成一个uuid |
| js_utils_first_to_upper   |  `(string) => string`   | 首字母大写 |
| js_utils_deep_merge | `(src: any = {}, target: any = {}) => T`  | 对象合并,支持对象深度合并 |
| js_utils_throttle_event  | `(n: any, data: any) => void` | 防抖      |
| js_utils_quick_sort  | `(nums: number[]) => number[]` | 快排      |
| js_utils_format_money_num  | `(nums: T) => string` | 千分位格式化      |
| js_utils_add_to_object  | `(obj: Record<string \| number, any>, key: string \| number, value: any, index: number)  => Record<string \| number, any>` | 为对象指定位置添加新属性   |
| js_utils_find_attr  | `(object: any, path: string) => any` | 查找多层值, `'a.b.c' =>  {a: {b:{c: {}}}}`  |
| js_utils_edit_attr  | `(path:string, value: any, obj:any) => any` | 多层设置值, `('a.b.c', '1', {a: {b:{c: {}}}}) => {a: {b:{c: 1}}}`  |
| js_utils_set_table_height  | `(tableClass: string, subHeight = 0)=>Promise(height)` | 获取表格应该设置的高度      |
| js_utils_get_table_header_columns  | `<T>(headerObj: T, options: any) => Array` | 设置适用于antd的表格头      |
| js_utils_array_to_csv  | `(list: string[][])=> void` | 数组转化成csv文件      |
| js_utils_csv_to_array  | `(file: File, encoding = 'utf-8') => string[][]` | csv转化为 array      |
| js_utils_fen_to_yuan  | `(fen: number \| string, isFormat = false, digit = 100) => string` | 金额转化-分转元（isFormat: 是否格式化为千分位）    |
| js_utils_yuan_to_fen  | `(yuan: number \| string, digit = 100) => string` | 金额转化-元转分    |

## 使用方法

前提`import { xxx } from '@/assets/ts/tool'`

### set_table_height
```js
set_table_height(tableClassName, 88).then((height) => {
  this.tableHeight = height
}) 

```
### js_utils_throttle_event
```js
const fn = (a, b, c) => {
  console.log(a, b, c )
}

js_utils_throttle_event(fn, {
  args: [1,2,3],
  time: 500,
  context: this
})

```

### js_utils_deep_merge
```js
const a = {
  var1: '1',
  var2: {
    var3: '2'
  }
}

const b = {
  var2: {
    var3: '3'
  }
}

/**
 * return {
 *  var1: '1',
 *   var2: {
 *     var3: '3'
 *   }
 * }
*/
js_utils_deep_merge(a, b)

```

### get_table_header_columns
```js
const _options = {
      alignData: {
          'ad_id': 'left',
          'ad_title'
      },
      widthData: {
          all: '120'
      },
      sortData: ['ad_id']
 };
 
data.tableData.header = get_table_header_columns<Record<IHeaderStr | 'action', string>>(
    {..._res.data.header, action: '操作'},
    _options
);
```

### js_utils_fen_to_yuan
```js
const _fen = 150010;
const _yuan = js_utils_fen_to_yuan(_fen, true); // 1,500.10

```

### js_utils_yuan_to_fen
```js
const _yuan = 1500.10;
const _fen = js_utils_yuan_to_fen(_yuan); // 150010

```