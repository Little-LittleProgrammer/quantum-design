# storage 本地存储
将localStorage 和 sessionStorage 进行二次封装, 并拓展了过期时间, 和是否加密

## 方法

| 方法名    |                                 方法                          | 说明              |
| -------- | ------------------------------------------------------------ | ---------------- |
| set      | `(key: string, value: any, expire: number \| null = timeout) => void` | 设置     |
| get   |  `(key: string) => any`   | 获取 |
| remove   |  `(key: string) => void`   | 移除 |
| clear   |  `() => void`   | 清空 |

## 使用说明

可以创建 `localStorage` 或者 `sessionStorage`

### 未加密

```js
...
import { js_create_local_storage,  js_create_session_storage} from '@wuefront/utils';
...
const ls = js_create_local_storage(); // createSessionStorage

// 设置
/**
 * 对于控制台
 *  
 * LOCAL_WORLD: { value: 'hello', time: '12312312312', expire: '123123123 }
*/
ls.set('world', 'hello', 1000*1000) 

// 获取
ls.get('world')

// 移除
ls.remove('world')

// 清空
ls.clear()
```

### 加密

```js
const ls = js_create_local_storage({hasEncrypt = true}); // createSessionStorage
```


## API

```js
const option= {
    storage: Storage, // 使用的storage;类型
    hasEncrypt: boolean, // 是否使用加密
    prefixKey: string, // 存储时使用的前缀
    encryption: any // 加密方法, 本项目默认使用 AES
}

createStorage(option)

```