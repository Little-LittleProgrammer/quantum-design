# global types

## http
```ts
declare interface Result<T = any> { // 接口格式
    code: number;
    data: T;
    msg: string;
}

declare interface UploadFileParams { // 上传格式
    data?: Record<string, any>;
    name?: string;
    action?: string;
    file: File | Blob;
    filename?: string;
    [key: string]: any;
  }
```

## 公共类型

以下为公用类型转换方法, 已全局声明, 不需要导入
```js
// 全局处理逻辑时用到的接口类型

/**
   * <T, K>将 T 中的 K 属性变成必须按
   * ```js
   *  interface aaa {
   *      name: string,
   *      age:number
   *  }
   *  SelectPartial<aaa, 'name'> == {
   *      name: string,
   *      age?: number
   *  }
   *
   * ```
   */
declare type SelectPartial<T, V extends keyof T> = Partial<Omit<T, V>> & Required<Pick<T, V>>

/**
   * 给 T 增加 null
   */
declare type Nullable<T> = T | null;

declare type Recordable<K extends string | number | symbol> = Record<K, string>;

declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
    (...arg: T[]): Promise<R>;
}

declare type RefType<T> = T | null;

declare type EmitType = (event: string, ...args: any[]) => void;

// window.open
declare type TargetContext = '_self' | '_blank';

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

// change事件
declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
}

declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

declare interface WheelEvent {
    path?: EventTarget[];
}

declare type TimeoutHandle = ReturnType<typeof setTimeout>;
declare type IntervalHandle = ReturnType<typeof setInterval>;

```