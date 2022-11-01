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
 
 