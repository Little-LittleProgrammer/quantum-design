# vuex 
是对 vuex的二次封装, 更加便捷 vuex 的使用


:::warning 警告
`hooks` 的 `vuex` 只能应用于 `setup()` 方法中, 因为 二次封装的 hooks 是基于 `useStore()` 的

如果要在ts文件中使用, 请使用原生的 store
```js
import store from '@/store'
```

:::

## 前提

因为 vuex 的 ts 声明文件, 声明的 store.getters 为 any, 以及 dispatch, commit的参数为string类型, 无法在使用时给出明确的提示, 无法提高开发效率, 所以对vuex进行二次封装

## 使用方式

```js
...
import { useQmStore } from '@/hooks';
...
const store = useQmStore();
...
store.state;
store.getters;
store.dispatch;
store.commit
```

## 原理

- vuex的官方声明文件
```js
// node_modules/vuex/types/index.d.ts

// 虽然可以使用, 但是调用时不会给提示
export interface Dispatch {
    // type 为string
    (type: string, payload?: any, options?: DispatchOptions): Promise<any>;
    <P extends Payload>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

export interface Commit {
    // type 为string
    (type: string, payload?: any, options?: CommitOptions): void;
    <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}

export interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  getters: any; // any?
  rootState: R;
  rootGetters: any; // any?
}
```
- vuex Hooks封装

> 以 `getters` 为例, 其余的同理
1. 根据module类型，遍历模块名
```js
type GetGetter<Module> = Module extends { getters: infer G } ? G : unknown;

type GetGetters<Modules> = {
    [K in keyof Modules]: GetGetter<Modules[K]>
}
type QmGetters = GetGetters<typeof modules>;
```
2. 声明数据格式类型，参考上面注释解析
```js
type Addprefix<P, K> = `${P & string}/${K & string}`;
type GetSpliceKey<P, Module> = Addprefix<P, keyof Module>
```
3. 遍历泛型Modules，使其数据格式约定为GettersName类型
```js
type GetSpliceKeys<Modules> = {
    [K in keyof Modules]: GetSpliceKey<K, Modules[K]>;
}[keyof Modules];
```
4. 遍历循环GettersName类型，并找出对应的函数方法
```js
type GetSpliceObj<T> = {
    [K in GetSpliceKeys<T>]: K extends `${infer A}/${infer B}` ? GetFunc<T, A, B> : unknown
}
type ModuleGetters = GetSpliceObj<QmGetters>;
```
5. 通过ReturnType返回函数的数据类型，并暴露外部使用，至此getters的声明结束
```js
type Getters = {
    [K in keyof ModuleGetters]: ReturnType<ModuleGetters[K]>;
};
export {
    Getters
};
```
