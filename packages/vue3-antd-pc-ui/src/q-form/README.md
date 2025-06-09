# Q-Form 类型推断使用指南

## 概述

Q-Form 组件库现已支持智能的类型推断，当您指定 `component` 时，`componentProps` 的类型会自动推断，提供更好的开发体验和类型安全。

**🎯 核心特性**：

-   ✅ 根据 `component` 值精确推断 `componentProps` 类型
-   ✅ 支持多个自定义组件，每个组件都有独立的类型，不是联合类型
-   ✅ 完整的 TypeScript 类型检查和智能提示
-   ✅ 向后兼容现有代码

## 基础用法

### 1. 使用 createFormSchema 创建表单配置

```typescript
import { createFormSchema } from '@vue3-antd/q-form';

// Input 组件 - 自动推断 InputProps 类型
const nameSchema = createFormSchema({
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: {
        placeholder: '请输入姓名',
        maxLength: 100,
        allowClear: true,
        // 此时会有完整的 Input 组件属性提示
    },
});

// InputNumber 组件 - 自动推断 InputNumber 类型
const ageSchema = createFormSchema({
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
    componentProps: {
        min: 0,
        max: 120,
        step: 1,
        precision: 0,
        // 此时会有完整的 InputNumber 组件属性提示
    },
});

// Select 组件 - 自动推断 SelectProps 类型
const genderSchema = createFormSchema({
    field: 'gender',
    label: '性别',
    component: 'Select',
    componentProps: {
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
        ],
        placeholder: '请选择性别',
        allowClear: true,
        // 此时会有完整的 Select 组件属性提示
    },
});
```

### 2. 使用 createFormSchemas 创建表单配置数组

```typescript
import { createFormSchemas } from '@vue3-antd/q-form';

const formSchemas = createFormSchemas([
    {
        field: 'username',
        label: '用户名',
        component: 'Input',
        componentProps: {
            placeholder: '请输入用户名',
            prefix: 'user',
        },
    },
    {
        field: 'password',
        label: '密码',
        component: 'InputPassword',
        componentProps: {
            placeholder: '请输入密码',
            visibilityToggle: true,
        },
    },
    {
        field: 'birthday',
        label: '生日',
        component: 'DatePicker',
        componentProps: {
            format: 'YYYY-MM-DD',
            placeholder: '请选择生日',
        },
    },
]);
```

## 多个自定义组件支持 🚀

### 1. 定义多个自定义组件类型

```typescript
import type { DefineCustomComponents } from '@vue3-antd/q-form';

// 定义多个自定义组件的属性类型
type MyCustomComponents = DefineCustomComponents<{
    MyInput: {
        customProp: string;
        onChange: (value: string) => void;
        disabled?: boolean;
        theme?: 'light' | 'dark';
    };
    MySelect: {
        options: Array<{ label: string; value: any; disabled?: boolean }>;
        multiple?: boolean;
        searchable?: boolean;
        onSelect?: (value: any) => void;
    };
    MyDatePicker: {
        format: string;
        showTime?: boolean;
        onDateChange?: (date: string) => void;
        disabledDates?: string[];
    };
    MyUpload: {
        maxFiles: number;
        acceptTypes: string[];
        onUpload: (files: File[]) => void;
        showProgress?: boolean;
    };
}>;
```

### 2. 精确的类型推断 - 不是联合类型

```typescript
// ✅ MyInput 组件 - 只有 MyInput 的属性，精确类型推断
const inputSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'input1',
    label: '自定义输入',
    component: 'MyInput',
    componentProps: {
        customProp: 'test',
        onChange: (value: string) => console.log(value),
        disabled: false,
        theme: 'light',

        // ❌ 以下属性会报 TypeScript 错误，因为它们属于其他组件
        // options: [], // MySelect 的属性
        // format: '', // MyDatePicker 的属性
        // maxFiles: 5, // MyUpload 的属性
    },
});

// ✅ MySelect 组件 - 只有 MySelect 的属性，精确类型推断
const selectSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'select1',
    label: '自定义选择',
    component: 'MySelect',
    componentProps: {
        options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2, disabled: true },
        ],
        multiple: true,
        searchable: true,
        onSelect: (value) => console.log('selected:', value),

        // ❌ 以下属性会报 TypeScript 错误
        // customProp: 'test', // MyInput 的属性
        // showTime: true, // MyDatePicker 的属性
    },
});

// ✅ MyDatePicker 组件 - 只有 MyDatePicker 的属性，精确类型推断
const dateSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'date1',
    label: '自定义日期',
    component: 'MyDatePicker',
    componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        onDateChange: (date) => console.log('date:', date),
        disabledDates: ['2024-01-01', '2024-12-25'],

        // ❌ 以下属性会报 TypeScript 错误
        // multiple: true, // MySelect 的属性
        // acceptTypes: [], // MyUpload 的属性
    },
});
```

### 3. 混合使用内置组件和多个自定义组件

```typescript
const mixedSchemas = createFormSchemas<Record<string, any>, MyCustomComponents>([
    // 内置组件
    {
        field: 'name',
        label: '姓名',
        component: 'Input',
        componentProps: {
            placeholder: '请输入姓名',
            maxLength: 50,
            // customProp: 'error', // ❌ 内置组件不能有自定义属性
        },
    },

    // 自定义组件 MyInput
    {
        field: 'customInput',
        label: '自定义输入',
        component: 'MyInput',
        componentProps: {
            customProp: 'test',
            onChange: (value: string) => console.log(value),
            // options: [], // ❌ 不能有其他自定义组件的属性
        },
    },

    // 自定义组件 MySelect
    {
        field: 'customSelect',
        label: '自定义选择',
        component: 'MySelect',
        componentProps: {
            options: [{ label: 'test', value: 1 }],
            multiple: false,
            // format: 'YYYY-MM-DD', // ❌ 不能有其他自定义组件的属性
        },
    },

    // 内置组件 DatePicker
    {
        field: 'birthday',
        label: '生日',
        component: 'DatePicker',
        componentProps: {
            format: 'YYYY-MM-DD',
            showTime: false,
            // onDateChange: () => {}, // ❌ 内置组件不能有自定义方法
        },
    },
]);
```

## 函数形式的 componentProps

```typescript
// 函数形式也支持精确的类型推断
const dynamicInputSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'dynamic1',
    label: '动态输入',
    component: 'Input', // 内置组件
    componentProps: (opt) => {
        // 返回值必须符合 Input 组件的 props 类型
        return {
            placeholder: `请输入${opt.schema.label}`,
            disabled: opt.formModel.readonly,
            maxLength: opt.formModel.isVip ? 200 : 100,
            // customProp: 'error', // ❌ Input 组件不能有自定义属性
        };
    },
});

const dynamicCustomSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'dynamic2',
    label: '动态自定义',
    component: 'MyInput', // 自定义组件
    componentProps: (opt) => {
        // 返回值必须符合 MyInput 组件的 props 类型
        return {
            customProp: `custom-${opt.schema.label}`,
            onChange: (value: string) => console.log(value),
            theme: opt.formModel.darkMode ? 'dark' : 'light',
            // options: [], // ❌ MyInput 不能有其他自定义组件的属性
        };
    },
});
```

## 字段类型约束

```typescript
// 定义表单数据类型
interface UserForm {
    name: string;
    age: number;
    email: string;
    profile: {
        bio: string;
        avatar: string;
    };
}

// 使用类型约束
const typedSchema = createFormSchema<UserForm>({
    field: 'name', // 只能是 UserForm 中定义的字段
    label: '姓名',
    component: 'Input',
    componentProps: {
        placeholder: '请输入姓名',
    },
});

// 嵌套字段支持
const nestedSchema = createFormSchema<UserForm>({
    field: 'profile.bio', // 支持嵌套字段
    label: '个人简介',
    component: 'InputTextArea',
    componentProps: {
        placeholder: '请输入个人简介',
        rows: 4,
    },
});
```

## 在 useForm 中使用

```typescript
import { useForm } from '@vue3-antd/q-form';
import { computed } from 'vue';

const [registerForm, formMethods] = useForm({
    schemas: computed(() => formSchemas),
    // 其他配置...
});

// 在组件中使用
export default defineComponent({
    setup() {
        return {
            registerForm,
            ...formMethods,
        };
    },
});
```

## 向后兼容

如果您已经在使用旧版本的 FormSchema 类型，不用担心，我们保持了完全的向后兼容：

```typescript
// 旧版本用法仍然有效
const oldSchema: FormSchema<Record<string, any>, object, 'Input'> = {
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: {
        placeholder: '请输入姓名',
    },
};
```

## 类型提示和错误检查

新的类型系统提供了以下优势：

1. **精确类型推断**：根据具体的 `component` 值推断对应的 `componentProps` 类型，不是联合类型
2. **智能提示**：当您输入 `componentProps` 时，IDE 会自动提示该组件的所有可用属性
3. **类型检查**：使用不存在的属性或其他组件的属性时会得到 TypeScript 错误提示
4. **跳转定义**：可以直接跳转到组件属性的类型定义
5. **重构安全**：当组件属性发生变化时，相关代码会自动标记需要更新

## 常见问题

### Q: 为什么我的自定义组件 componentProps 类型不正确？

A: 确保您正确定义了自定义组件类型，并在使用时传入了类型参数：

```typescript
// ✅ 正确的定义方式
type MyComponents = DefineCustomComponents<{
    MyInput: { customProp: string };
    MySelect: { options: any[] };
}>;

// ✅ 正确的使用方式
const schema = createFormSchema<Record<string, any>, MyComponents>({
    // ...
});
```

### Q: 如何确保类型推断的准确性？

A: 使用我们提供的测试方法：

```typescript
// 测试类型推断是否正确
const testSchema = createFormSchema<Record<string, any>, MyComponents>({
    field: 'test',
    label: '测试',
    component: 'MyInput',
    componentProps: {
        customProp: 'test',
        // wrongProp: 'error', // 这里应该报错
    },
});
```

## 支持的内置组件

目前支持自动类型推断的内置组件包括：

-   `Input` - 输入框
-   `InputPassword` - 密码输入框
-   `InputSearch` - 搜索输入框
-   `InputTextArea` - 文本域
-   `InputNumber` - 数字输入框
-   `Select` - 选择器
-   `TreeSelect` - 树选择
-   `DatePicker` - 日期选择器
-   `TimePicker` - 时间选择器
-   `Checkbox` - 复选框
-   `Radio` - 单选框
-   `Switch` - 开关
-   `Slider` - 滑动输入条
-   `Rate` - 评分
-   `Cascader` - 级联选择
-   `Transfer` - 穿梭框
-   `Upload` - 上传
-   等等...

每个组件都会提供完整的类型提示和检查，确保类型安全。
