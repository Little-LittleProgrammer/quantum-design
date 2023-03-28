# tools

基本操作方法

## 方法

| 方法名    |                              方法                  | 说明              |
| -------- | -------------------------------------------------- | ---------------- |
| deep_copy      | `(obj: T) => T`   | 深拷贝   |
| get_uuid   |  `(len: number, radix: number) => string`   | 生成一个uuid |
| deep_merge | `(src: any = {}, target: any = {}) => T`  | 对象合并,支持对象深度合并 |
| use_debounced_ref  | `(value: T, delay = 200) => void` | 延时响应式数据的反应      |
| throttle_event  | `(n: any, data: any) => void` | 防抖      |
| set_table_height  | `(tableClass: string, subHeight = 0)=>Promise(height)` | 获取表格应该设置的高度      |
| get_table_header_columns  | `<T>(headerObj: T, options: any) => Array` | 设置适用于antd的表格头      |
| reg_fen_to_yuan  | `(fen: number | string, isFormat: boolean = false,  digit: number = 100) => string` | 金额转化-分转元    |
| reg_yuan_to_fen  | `(yuan: number | string, digit: number = 100) => number` | 金额转化-元转分    |

## 使用方法

前提`import { xxx } from '@/assets/ts/tool'`

### set_table_height
```js
set_table_height(tableClassName, 88).then((height) => {
  this.tableHeight = height
}) 

```
### throttle_event
```js
const fn = (a, b, c) => {
  console.log(a, b, c )
}

throttle_event(fn, {
  args: [1,2,3],
  time: 500,
  context: this
})

```

### deep_merge
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
deep_merge(a, b)

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

### reg_fen_to_yuan
```js
const _fen = 150010;
const _yuan = reg_fen_to_yuan(_fen, true); // 1,500.10

```

### reg_yuan_to_fen
```js
const _yuan = 1500.10;
const _fen = reg_yuan_to_fen(_yuan); // 150010

```