# Form表单组件
对 `antdv`的form组件进行封装, 扩展一些常用的功能, 更加方便代码的开发, 提高整体效率

## 使用方式
有两种使用方式供选择:
1. 使用props 传递到组件内
2. 使用暴露的 api 进行传递
3. 两者结合
### **props使用方式**
::: details 点击查看代码
```vue
<template>
  <div>
    <q-form 
      :labelWidth="100"
      :schemas="schemas"
      :actionColOptions="{ span: 24 }"
      @submit="handleSubmit"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { QForm, FormSchema } from '@quantum-design/vue3-antd-pc-ui';
  import { useMessage } from '@quantum-design/hooks';
  const schemas: FormSchema[] = [ 
    {
      field: 'field',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      defaultValue: '1',
      componentProps: {
        placeholder: '自定义placeholder',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];

  export default defineComponent({
    components: { QForm },
    setup() {
      const { createMessage } = useMessage();
      return {
        schemas,
        handleSubmit: (values: any) => {
          createMessage.success('click search,values:' + JSON.stringify(values));
        },
      };
    },
  });
</script>
```
:::


### **useForm使用方式**
::: details 点击查看代码
```vue
<template>
  <div>
    <q-form
      @register="register"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { QForm, FormSchema } from '@quantum-design/vue3-antd-pc-ui';
  import { useMessage } from '@quantum-design/hooks';
  const schemas: computed<FormSchema<interface>[]>(() => ([
    {
      field: 'field',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      defaultValue: '1',
      componentProps: {
        placeholder: '自定义placeholder',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ]));

  export default defineComponent({
    components: { QForm },
    setup() {
      const { createMessage } = useMessage();
      const _defaultValue = {
        field: '1'
      } 
      const [register, {validate, resetFields, getFieldsValue, setFieldsValue, appendSchemaByField, removeSchemaByFiled}] = useForm({
        labelWidth: '100px',
        schemas: schemas,
        actionColOptions: {
          span: 24
        },
        submitFunc: handleSubmit
      });
      const handleSubmit = async() => {
          await validate() // 校验
          const data = await getFieldsValue(); // 获取值
          createMessage.success('click search,values:' + data);
          resetFields() // 重置值
        },
      onMounted(()=>{
        setFieldsValue(_defaultValue) // 设置值
      })
      return {
        register
      };
    },
  });
</script>
```
:::

## useForm
提供了 useForm, 方便调用函数内部方法

### 参数介绍
```js
const [register, methods] = useForm(props);
```
> 参数 props 内的值可以是 computed 或者 ref 类型, 方便响应式

**register**  
register 用于注册 useForm，如果需要使用 useForm 提供的 api，必须将 register 传入组件的 onRegister
```vue
<template>
  <QForm @register="register" @submit="handleSubmit" />
</template>
<script>
  export default defineComponent({
    components: { QForm },
    setup() {
      const [register] = useForm();
      return {
        register,
      };
    },
  });
</script>
```

### Methods

**getFieldsValue**  

类型: `() => Recordable;`

说明: 获取表单值

**setFieldsValue**

类型: `<T>(values: T) => Promise<void>`

说明: 设置表单字段值

**resetFields**

类型: `()=> Promise<any>`

说明: 重置表单值, 以及重置校验

**validateFields**

类型: `(nameList?: NamePath[]) => Promise<any>`

说明: 校验指定表单项

**validate**

类型: `(nameList?: NamePath[]) => Promise<any>`

说明: 校验整个表单

**submit**

类型: `() => Promise<void>`

说明: 提交表单

**scrollToField**

类型: `(name: NamePath, options?: ScrollOptions) => Promise<void>`

说明: 滚动到对应字段位置

**clearValidate**

类型: `(name?: string | string[]) => Promise<void>`

说明: 清空校验

**setProps**

:::warning
设置表单的 props 可以直接在标签上传递，也可以使用 setProps，或者初始化直接写 useForm(props)
:::

类型: `(formProps: Partial<FormProps>) => Promise<void>`

说明: 设置表单 Props

**removeSchemaByFiled**

类型: `(field: string | string[]) => Promise<void>`

说明: 根据 field 删除 Schema

**appendSchemaByField**

类型: `( schema: FormSchema, prefixField: string | undefined, first?: boolean | undefined ) => Promise<void>`

说明: 插入到指定 filed 后面，如果没传指定 field，则插入到最后,当 first = true 时插入到第一个位置

**updateSchema**

类型: `(data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>`

说明: 更新表单的 schema, 只更新函数所传的参数
```js
updateSchema({ field: 'filed', componentProps: { disabled: true } });
updateSchema([
  { field: 'filed', componentProps: { disabled: true } },
  { field: 'filed1', componentProps: { disabled: false } },
]);
```

## Props
::: tip
除以下参数外，官方文档内的 props 也都支持，具体可以参考 antv form
:::
| 属性 | 类型 | 默认值 | 可选值 | 说明 | 版本 |
| --- | --- | --- | --- | --- | -- |
| schemas | `ComputedRef<Schema[]>` | - | - | 表单配置，见下方 `FormSchema` 配置 |  |
| submitOnReset | `boolean` | `true` | - | 重置时是否提交表单 |  |
| labelCol | `Partial<ColEx>` | - | - | 整个表单通用 LabelCol 配置 |  |
| wrapperCol | `Partial<ColEx>` | - | - | 整个表单通用 wrapperCol 配置 |  |
| baseColProps | `Partial<ColEx>` | - | - | 配置所有选子项的 ColProps，不需要逐个配置，子项也可单独配置优先与全局 |  |
| baseRowStyle | `object` | - | - | 配置所有 Row 的 style 样式 |  |
| labelWidth | `number , string` | - | - | 扩展 form 组件，增加 label 宽度，表单内所有组件适用，可以单独在某个项覆盖或者禁用 |  |
| labelAlign | `string` | - | `left`,`right` | label 布局 |  |
| mergeDynamicData | `object` | - | - | 额外传递到子组件的参数 values |  |
| autoFocusFirstItem | `boolean` | `false` | - | 是否聚焦第一个输入框，只在第一个表单项为 input 的时候作用 |  |
| compact | `boolean` | `false` | `true/false` | 紧凑类型表单，减少 margin-bottom |  |
| size | `string` | `default` | `'default' , 'small' , 'large'` | 向表单内所有组件传递 size 参数,自定义组件需自行实现 size 接收 |  |
| disabled | `boolean` | `false` | `true/false` | 向表单内所有组件传递 disabled 属性，自定义组件需自行实现 disabled 接收 |  |
| autoSetPlaceHolder | `boolean` | `true` | ` true/false` | 自动设置表单内组件的 placeholder，自定义组件需自行实现 |  |
| autoSubmitOnEnter | `boolean` | `false` | ` true/false` | 在input中输入时按回车自动提交 | 2.4.0  |
| rulesMessageJoinLabel | `boolean` | `false` | `true/false` | 如果表单项有校验，会自动生成校验信息，该参数控制是否将字段中文名字拼接到自动生成的信息后方 |  |
| showActionButtonGroup | `boolean` | `true` | `true/false` | 是否显示操作按钮(重置/提交) | |
| actionColOptions | `Partial<ColEx>` | - | - | 操作按钮外层 Col 组件配置，具体见下方 actionColOptions |  |
| showResetButton | `boolean` | `true` | - | 是否显示重置按钮 |  |
| resetButtonOptions | `object` |  | - | 重置按钮配置见下方 ActionButtonOption |  |
| showSubmitButton | `boolean` | `true` | - | 是否显示提交按钮 |  |
| submitButtonOptions | `object` |  | - | 确认按钮配置见下方 ActionButtonOption |  |
| resetFunc | ` () => Promise<void>` |  | - | 自定义重置按钮逻辑`() => Promise<void>;` |  |
| submitFunc | ` () => Promise<void>` |  | - | 自定义提交按钮逻辑`() => Promise<void>;` |  |
| fieldMapToTime | `[string, [string, string], string?][]` |  | - | 用于将表单内时间区域的应设成 2 个字段,见下方说明 |  |

### ActionButtonOption
```js
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
```

### fieldMapToTime

将表单内时间区域的值映射成 2 个字段

如果表单内有时间区间组件，获取到的值是一个数组，但是往往我们传递到后台需要是 2 个字段

```js
useForm({
  fieldMapToTime: [
    // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
    // 'YYYY-MM-DD'为时间格式，参考moment
    ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],
    // 支持多个字段
    ['datetime1', ['startTime1', 'endTime1'], 'YYYY-MM-DD HH:mm:ss'],
  ],
});

// fieldMapToTime没写的时候表单获取到的值
{
  datetime: [Date(),Date()]
}
//  ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],之后
{
    datetime: [Date(),Date()],
    startTime: '2020-08-12',
    endTime: '2020-08-15',
}
```

### FormSchema

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| field | `string` | - | - | 字段名 |
| label | `string` | - | - | 标签名 |
| subLabel | `string` | - | - | 二级标签名灰色 |
| suffix | `string , number , ((values: RenderCallbackParams) => string / number);` | - | - | 组件后面的内容 |
| changeEvent | `string` | - | - | 表单更新事件名称 |
| helpMessage | `string , string[]` | - | - | 标签名左侧温馨提示 |
| helpComponentProps | `HelpComponentProps` | - | - | 标签名左侧温馨提示组件 props,见下方 HelpComponentProps |
| labelWidth | `string , number` | - | - | 覆盖统一设置的 labelWidth |
| disabledLabelWidth | `boolean` | false | true/false | 禁用 form 全局设置的 labelWidth,自己手动设置 labelCol 和 wrapperCol |
| component | `string` | - | - | 组件类型，见下方 ComponentType |
| componentProps | `any,()=>{}` | - | - | 所渲染的组件的 props |
| rules | `ValidationRule[]` | - | - | 校验规则,见下方 ValidationRule |
| required | `boolean` | - | - | 简化 rules 配置，为 true 则转化成 [{required:true}]。`2.4.0`之前的版本只支持string类型的值 |
| rulesMessageJoinLabel | `boolean` | false | - | 校验信息是否加入 label |
| itemProps | `any` | - | - | 参考下方 FormItem |
| colProps | `ColEx` | - | - | 参考上方 actionColOptions |
| defaultValue | `object` | - | - | 所渲渲染组件的初始值 |
| render | `(renderCallbackParams: RenderCallbackParams) => VNode / VNode[] / string` | - | - | 自定义渲染组件 |
| renderColContent | `(renderCallbackParams: RenderCallbackParams) => VNode / VNode[] / string` | - | - | 自定义渲染组件（需要自行包含 formItem） |
| renderComponentContent | `(renderCallbackParams: RenderCallbackParams) => any / string` | - | - | 自定义渲染组内部的 slot |
| slot | `string` | - | - | 自定义 slot，渲染组件 |
| colSlot | `string` | - | - | 自定义 slot，渲染组件 （需要自行包含 formItem） |
| show | ` boolean / ((renderCallbackParams: RenderCallbackParams) => boolean)` | - | - | 动态判断当前组件是否显示，css 控制，不会删除 dom |
| ifShow | ` boolean / ((renderCallbackParams: RenderCallbackParams) => boolean)` | - | - | 动态判断当前组件是否显示，js 控制，会删除 dom |
| dynamicDisabled | `boolean / ((renderCallbackParams: RenderCallbackParams) => boolean) ` | - | - | 动态判断当前组件是否禁用 |
| dynamicRules | `boolean / ((renderCallbackParams: RenderCallbackParams) => boolean)` | - | - | 动态判返当前组件你校验规则 |

**RenderCallbackParams**
```js
export interface RenderCallbackParams {
  schema: FormSchema;
  values: any;
  model: any;
  field: string;
}
```

**componentProps**
- 当值为对象类型时,该对象将作为component所对应组件的的 props 传入组件
- 当值为一个函数时候

参数有 3 个:
`schema`: 表单的整个 schemas  

`formActionType`: 操作表单的函数。与 useForm 返回的操作函数一致

`formModel`: 表单的双向绑定对象，这个值是响应式的。所以可以方便处理很多操作

```js
{
  // 简单例子，值改变的时候操作表格或者修改表单内其他元素的值
  component:'Input',
  componentProps: ({ schema, tableAction, formActionType, formModel }) => {
    return {
      // xxxx props
      onChange:e=>{
        const {reload}=tableAction
        reload()
        // or
        formModel.xxx='123'
      }
    };
  };
}
```

**HelpComponentProps**
```js
export interface HelpComponentProps {
  maxWidth: string;
  // 是否显示序号
  showIndex: boolean;
  // 文本列表
  text: any;
  // 颜色
  color: string;
  // 字体大小
  fontSize: string;
  icon: string;
  absolute: boolean;
  // 定位
  position: any;
}
```

**ComponentType**

schema 内组件的可选类型
```js
export type ComponentType =
  | 'Input'
  | 'InputGroup'
  | 'InputPassword'
  | 'InputSearch'
  | 'InputTextArea'
  | 'InputNumber'
  | 'Select'
  | 'TreeSelect'
  | 'RadioButtonGroup'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Cascader'
  | 'DatePicker'
  | 'MonthPicker'
  | 'RangePicker'
  | 'WeekPicker'
  | 'TimePicker'
  | 'Switch'
  | 'Upload'
  | 'Icon'
  | 'Render'
  | 'Slider'
  | 'Rate'
  | 'Divider'
  | 'Text'
  | 'Link'
```

### Divider schema说明

Divider类型用于在schemas中占位，将会渲染成一个分割线（始终占一整行的版面），可以用于较长表单的版面分隔。请只将Divider类型的schema当作一个分割线，而不是一个常规的表单字段。

- Divider 使用schema中的label以及helpMessage来渲染分割线中的提示内容
- Divider 可以使用componentProps来设置除type之外的props
- Divider 不会渲染AFormItem，因此schema中除label、componentProps、helpMessage、helpComponentProps以外的属性不会被用到

## 添加自定义组件
在 src/components/Form/src/componentMap.ts 内，添加需要的组件，并在上方 ComponentType 添加相应的类型 key

### 方式1
这种写法适用与适用频率较高的组件

```js
componentMap.set('componentName', 组件);

// ComponentType
export type ComponentType = xxxx | 'componentName';
```

### 方式2
使用 `useComponentRegister` 进行注册
::: warning
这种写法只能在当前页使用，页面销毁之后会从 componentMap 删除相应的组件
::: 
```js
import { useComponentRegister } from '@quantum-design/vue3-antd-pc-ui';

import { StrengthMeter } from '@/components/strength-meter/index';

useComponentRegister('StrengthMeter', StrengthMeter);
```

::: tip
方式 2 出现的原因是为了减少打包体积，如果某个组件体积很大，用方式 1 的话可能会使首屏体积增加
:::

### render
自定义渲染内容, 通过jsx方式
::: details 点击查看代码
```vue
<template>
  <div >
    <QForm @register="register" @submit="handleSubmit" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { QForm, FormSchema, useForm } from '@quantum-design/vue3-antd-pc-ui';
  import { useMessage } from '@/hooks';
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Input, {
          placeholder: '请输入',
          value: model[field],
          onChange: (e: ChangeEvent) => {
            model[field] = e.target.value;
          },
        });
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: {
        span: 8,
      },
      rules: [{ required: true }],
      renderComponentContent: () => {
        return {
          suffix: () => 'suffix',
        };
      },
    },
  ];
  export default defineComponent({
    components: { QForm },
    setup() {
      const { createMessage } = useMessage();
      const [register, { setProps }] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: {
          span: 24,
        },
      });
      return {
        register,
        schemas,
        handleSubmit: (values: any) => {
          createMessage.success('click search,values:' + JSON.stringify(values));
        },
        setProps,
      };
    },
  });
</script>
```
:::

### slot
自定义渲染内容, 通过插槽方式
::: details 点击查看代码
```vue
<template>
  <div class="m-4">
    <QForm @register="register">
      <template #customSlot="{ model, field }">
        <a-input v-model:value="model[field]" />
      </template>
    </QForm>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'compatible-vue';
  import { QForm, useForm } from '@quantum-design/vue3-antd-pc-ui/index';
  import { BasicModal } from '@/components/modal/index';
  export default defineComponent({
    name: 'FormDemo',
    setup(props) {
      const [register] = useForm({
        labelWidth: 100,
        actionColOptions: {
          span: 24,
        },
        schemas: [
          {
            field: 'field1',
            label: '字段1',
            slot: 'customSlot',
          },
        ],
      });
      return {
        register,
      };
    },
  });
</script>
```
:::

### ifShow/show/dynamicDisabled
自定义显示/禁用
::: details 点击查看代码
```vue
<template>
  <div class="m-4">
    <QForm @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { QForm, FormSchema, useForm } from '@quantum-design/vue3-antd-pc-ui';
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      show: ({ values }) => {
        return !!values.field5;
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: {
        span: 8,
      },
      ifShow: ({ values }) => {
        return !!values.field6;
      },
    },
    {
      field: 'field3',
      component: 'DatePicker',
      label: '字段3',
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field7;
      },
    },
  ];

  export default defineComponent({
    components: { QForm },
    setup() {
      const [register, { setProps }] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: {
          span: 24,
        },
      });
      return {
        register,
        schemas,
        setProps,
      };
    },
  });
</script>
```
:::


## Slots
| 名称          | 说明         |
| ------------- | ------------ |
| formFooter    | 表单底部区域 |
| formHeader    | 表单顶部区域 |
| resetBefore   | 重置按钮前   |
| submitBefore  | 提交按钮前   |

## RadioButtonGroup

Radio Button 风格的选择按钮

### Usage

```ts
const schemas: FormSchema[] = [
  {
    field: 'field',
    component: 'RadioButtonGroup',
    label: '字段',
  },
];
```

### Props

| 属性    | 类型                                                     | 默认值 | 说明     |
| ------- | -------------------------------------------------------- | ------ | -------- |
| options | `{ label: string; value: string; disabled?: boolean }[]` | -      | 数据字段 |