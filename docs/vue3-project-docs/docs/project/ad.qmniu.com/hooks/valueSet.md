# 子组件数据处理
> 目录: apps/ad.qmniu.com/src/hooks/specific/use-values-set.ts

## 功能
### `useValuesSet`
当服务端返回值后, 要将值传到子组件中, 可以在`props`中传入`values`, 当所需值嵌套比较深时, 可以通过`props.type="a.b.c"`获取深层值

#### 方法api
```js

/**
 * values: 值对象
 * visible: 服务端请求结束, 获取到值 visible = true, 页面关闭 visible = false
 * setFieldsValue: q-form Api
 */

interface IFormFunc { 
    setFieldsValue: <T>(values: T) => Promise<void>
    resetFields: () => Promise<any>
}

type useValuesSet = <P extends Record<'values' | 'visible', any> & {type?:string}>(props:P, formFunc: IFormFunc) => void
```

### `useValuesGet`

将组件的值, 暴露给父组件、会按照`useValuesSet`的方式, 将值原路暴露, 支持多个组件

#### 方法api

```js
type useValuesGet = () => { getValues: () => Object , childRefs: Ref<HTMLElement> }
```

## 使用

1. 子组件需暴露出三个方法属性

```js
// validate: 校验方法
// getFieldsValue: 获取值方法
// type: 值路径, 例如: 'direction', 'direction.id'
defineExpose({
    validate, getFieldsValue, type: props.type
});
```

2. 父组件需要给`子组件组或者单独子组件`设置ref属性

## 案例
```vue
<!-- 父组件 -->
<template>
    <div v-for="(comp, index) in getModules" :key="index ===0 ? index : data.values.policy_type+''+index">
        <component :is="comp" ref="childRefs" :visible="data.visible" :values="data.values"></component>
    </div>
</template>

<script lang='ts' setup>
const {getValues, childRefs} = useValuesGet();
const data = reactive({
    visible: false,
    values: {}
})

api().then(res=>{
    if (res.code ===200) {
        data.values = res.data,
        data.visible=true
    }
} )

</script>
```

```vue
<!-- 子组件 -->

<script lang='ts' setup>

import { useValuesSet } from '@/hooks/specific/use-values-set';
import { QForm, useForm, FormSchema} from '@wuefront/vue3-antd-ui';

const props = defineProps({
    visible: propTypes.bool.def(false), // 这个编辑框是否开启或者关闭
    type: propTypes.string.def('a.b.c'),
    values: {
        type: Object,
        default: () => {}
    }
});

const [register, {setFieldsValue, validate, getFieldsValue, resetFields}] = useForm({
    schemas,
    labelWidth: 190,
    baseColProps: { span: 20 },
    wrapperCol: {span: 10},
    showActionButtonGroup: false
});

useValuesSet(props, {setFieldsValue, resetFields});

defineExpose({
    validate, getFieldsValue, type: props.type
});

</script>
```