# propTypes

对子组件接受父组件 `props` 属性进行了二次封装, 可以更方便的定义基本类型和默认值

## 使用方式
```js
props: {
    // 定义一个为 boolean 类型,且默认值为 false 的数据
    visible: propTypes.bool.def(false)
    str: propTypes.string.def('vue3')
},

```

## 源码
目录: [src/assets/ts/propTypes.ts]()

```js
import { CSSProperties, VNodeChild } from 'vue';
import { createTypes, VueTypeValidableDef, VueTypesInterface } from 'vue-types';

export type VueNode = VNodeChild | JSX.Element;

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
  // readonly trueBool: VueTypeValidableDef<boolean>;
};

const propTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    object: undefined,
    integer: undefined
}) as PropTypes;

propTypes.extend([
    {
        name: 'style',
        getter: true,
        type: [String, Object],
        default: undefined
    },
    {
        name: 'VNodeChild',
        getter: true,
        type: undefined
    }
]);

export { propTypes };

```