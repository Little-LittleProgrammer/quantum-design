# 项目规范

## 开发规范
1. setup语法糖尽量不要应用于业务页面(即会出现在侧边菜单栏的页面),因为keepalive要识别name属性
2. 尽量不要使用this, 类除外

## 命名规范
[点击链接查看](http://wiki.km.com/pages/viewpage.action?pageId=62329239)

## ts开发规范
1. 类型推测上, 尽量不要使用any
2. ts已经开启严格模式, 会更精准的提示报错
3. http请求配置时,尽量配置返回类型, 这样在使用时,可以更加精准的给予提示
```js
// Result<ISelectObj> 为返回数据的类型
export function api_get_adv_dsp_data_select() {
    return defHttp.get<Result<ISelectObj>>({
        url: Api.dspDataSelect
    });
}
```

## ts公共类型(type, interface)
::: warning 提示
如果已有的声明涉及的不全, 可以根据自己的业务去补充和更改
:::
### 业务类型
以下为业务中常用的类型, 已全局声明, 不需要导入
```js
// 编写业务时,用到的常用接口类型
import { ColumnProps } from 'ant-design-vue/lib/table/interface';

declare global {

  // selectOption
  interface ISelectOption {
    label: string | number;
    value: string | number;
    [key: string]: string | number | boolean
  }

  // select
  type ISelectList<T extends string> = {
    [key in T] : ISelectOption[];
  }

  // 接口返回的 table
  type IApiTableData<T extends string, V extends string> = {
    header: {
      [key in T]: string;
    };
    list: {
      [key in T | V]: string | Object | string[]
    }[];
    page_config?: {
      page: string;
      page_size: string;
      total_num: string
    };
    [k: string]: string | Object | undefined
  }

  // 实际渲染的 Table
  type ITableData<T extends string> = {
    header: (ColumnProps & Partial<Recordable<'autoTitle'>>)[];
    list: {
      [key in T & string]: string | Object | string[]
    }[];
  }

  // 分页信息
  type IPageOption = Record<'current' | 'pageSize' | 'total', number>

  // modal信息
  type IModalData<T = Recordable<string>> = {
    visible: boolean,
    formData: T
  }
}


```
### 公用类型转换
以下为公用类型转换方法, 已全局声明, 不需要导入
详情请看[packages/types](/packages/types/index.md)
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

### http返回
http返回, 以下是请求中常用的类型
```js
// http请求
declare interface Result<T = any> {
    code: number;
    data: T;
    msg: string;
}

// 文件上传
declare interface UploadFileParams {
    // Other parameters
    data?: Record<string, any>;
    // File parameter interface field name
    name?: string;
    // file name
    file: File | Blob;
    // file name
    filename?: string;
    [key: string]: any;
}
```

## ESLint规范
**.eslintrc.js配置**
```js
// equire.resolve('@q-front-npm-configs//eslint/eslint-vue') 继承 packages下的规范
module.exports = {
    extends: [require.resolve('@q-front-npm-configs/eslint/eslint-vue')],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
};

```

## tsconfig.json规范
```js
{
    "extends": "@q-front-npm-configs/tsconfig/vue.json", // 继承 packages下的配置
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "#/*": ["types/*"]
        }
    },
    "include": [
        "src/**/*.ts",
        "src/**/*.d.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "types/*.d.ts",
        "build/**/*.ts",
        "build/**/*.d.ts",
        "node_modules/@q-front-npm/types/**/*.d.ts" // 为了将packags下的公共规范也引入
    ],
    "exclude": [
        "dist"
    ]
}

```