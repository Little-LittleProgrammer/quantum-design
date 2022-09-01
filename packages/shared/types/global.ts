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
 export declare type SelectPartial<T, V extends keyof T> = Partial<Omit<T, V>> & Required<Pick<T, V>>

 /**
   * 给 T 增加 null
   */
  export declare type Nullable<T> = T | null;
 
  export declare type Recordable<K extends string | number | symbol> = Record<K, string>;
 
  export declare interface Fn<T = any, R = T> {
     (...arg: T[]): R;
 }
 
 export declare interface PromiseFn<T = any, R = T> {
     (...arg: T[]): Promise<R>;
 }
 
 export declare type RefType<T> = T | null;
 
 export declare type EmitType = (event: string, ...args: any[]) => void;
 
 // window.open
 export declare type TargetContext = '_self' | '_blank';
 
 export declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
     $el: T;
 }
 
 export declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
 
 export declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
 
 // change事件
 export declare interface ChangeEvent extends Event {
     target: HTMLInputElement;
 }
 
 