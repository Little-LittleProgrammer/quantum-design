# router 

`vue-router` 的 `router` 方法比较全, 所以没有进行全部更改, 只二次封装了 `router.push` `router.replace` 方法, 为了全局方法让步

## 使用方式

### 路由跳转
1. setup() 中使用
```js
import { useGo } from '@/hooks'
...
const go  = useGo()

const opt ={
    path: 'xxx',
    query: {
        t: 'xxx'
    }
}
const isReplace = true // 为true 则使用 router.replace()

go(opt, isReplace)
```

2. ts文件中使用
```js
import router from '@/router'
import { useGo } from '@/hooks'
...
const go  = useGo(router)

const opt ={
    path: 'xxx',
    query: {
        t: 'xxx'
    }
}
const isReplace = true // 为true 则使用 router.replace()

go(opt, isReplace)
```
