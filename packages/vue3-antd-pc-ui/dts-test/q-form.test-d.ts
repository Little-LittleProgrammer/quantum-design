import { computed } from 'vue';
import { useForm } from '../src/q-form/index';
import type { FormSchema, LegacyFormSchema } from '../src/q-form/src/types/form';
import type { BuiltInFormComponentPropsMap } from '../src/q-form/src/types/index';
import { type DefineCustomComponents } from '../src/q-form/src/types/index';
import { createFormSchema, createFormSchemas } from '../src/q-form/src/hooks/use-schemas';

/**
 * 新版本：自动类型推断测试（推荐使用）
 */

// 1. 基础用法 - Input组件自动推断
const autoInferSchema1 = createFormSchema({
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: {
        placeholder: '请输入姓名',
        maxLength: 100,
        // @ts-expect-error 不存在的属性应该报错
        invalidProp: 'error',
    },
});

// 2. InputNumber组件自动推断
const autoInferSchema2 = createFormSchema({
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
    componentProps: {
        'addonAfter': '岁',
    },
});
// 3. Select组件自动推断
const autoInferSchema3 = createFormSchema({
    field: 'gender',
    label: '性别',
    component: 'Select',
    componentProps: {
        options: [
            { label: '男', value: 'male', },
            { label: '女', value: 'female', }
        ],
        placeholder: '请选择性别',
        // @ts-expect-error 不存在的属性应该报错
        invalidProp: 'error',
    },
});

// 4. 多个自定义组件类型定义
type MyCustomComponents = DefineCustomComponents<{
    MyInput: {
        customProp: string;
        onChange: (value: string) => void;
        disabled?: boolean;
    };
    MySelect: {
        options: Array<{ label: string; value: any }>;
        multiple?: boolean;
        onSelect?: (value: any) => void;
    };
    MyDatePicker: {
        format: string;
        showTime?: boolean;
        onDateChange?: (date: string) => void;
    };
}>;

// 5. 测试自定义组件 MyInput - 应该只有 MyInput 的属性，不是联合类型
const customInputSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'custom1',
    label: '自定义输入',
    component: 'MyInput',
    componentProps: {
        customProp: 'test',
        onChange: (value: string) => console.log(value),
        disabled: false,
        // 下面的属性应该报错，因为它们属于其他自定义组件
        // @ts-expect-error 这是 MySelect 的属性，不应该在 MyInput 中
        options: [],
        // @ts-expect-error 这是 MyDatePicker 的属性，不应该在 MyInput 中
        format: 'YYYY-MM-DD',
    },
});

// 6. 测试自定义组件 MySelect - 应该只有 MySelect 的属性，不是联合类型
const customSelectSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'custom2',
    label: '自定义选择',
    component: 'MySelect',
    componentProps: {
        options: [{ label: 'test', value: 1, }],
        multiple: true,
        onSelect: (value) => console.log('selected:', value),
        // 下面的属性应该报错，因为它们属于其他自定义组件
        // @ts-expect-error 这是 MyInput 的属性，不应该在 MySelect 中
        customProp: 'test',
        // @ts-expect-error 这是 MyDatePicker 的属性，不应该在 MySelect 中
        showTime: true,
    },
});

// 7. 测试自定义组件 MyDatePicker - 应该只有 MyDatePicker 的属性，不是联合类型
const customDateSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'custom3',
    label: '自定义日期',
    component: 'MyDatePicker',
    componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        onDateChange: (date) => console.log('date:', date),
        // 下面的属性应该报错，因为它们属于其他自定义组件
        // @ts-expect-error 这是 MyInput 的属性，不应该在 MyDatePicker 中
        customProp: 'test',
        // @ts-expect-error 这是 MySelect 的属性，不应该在 MyDatePicker 中
        multiple: true,
    },
});

// 8. 混合使用内置组件和多个自定义组件
const mixedSchemas = createFormSchemas<Record<string, any>, MyCustomComponents>([
    {
        field: 'name',
        label: '姓名',
        component: 'Input',
        componentProps: {
            placeholder: '请输入姓名',
            // @ts-expect-error 不应该有自定义组件的属性
            customProp: 'error',
        },
    },
    {
        field: 'myInput',
        label: '自定义输入',
        component: 'MyInput',
        componentProps: {
            customProp: 'test',
            onChange: (value: string) => console.log(value),
            // @ts-expect-error 不应该有其他自定义组件的属性
            options: [],
        },
    },
    {
        field: 'mySelect',
        label: '自定义选择',
        component: 'MySelect',
        componentProps: {
            options: [{ label: 'test', value: 1, }],
            // @ts-expect-error 不应该有其他自定义组件的属性
            format: 'YYYY-MM-DD',
        },
    }
]);

// 9. 函数形式的componentProps - 应该根据具体组件推断返回类型
const funcPropsInputSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'dynamic1',
    label: '动态输入',
    component: 'Input',
    componentProps: (opt) => {
        return {
            placeholder: `请输入${opt.schema.label}`,
            disabled: opt.formModel.disabled,
            // @ts-expect-error 不应该返回自定义组件的属性
            customProp: 'error',
        };
    },
});

const funcPropsCustomSchema = createFormSchema<Record<string, any>, MyCustomComponents>({
    field: 'dynamic2',
    label: '动态自定义',
    component: 'MyInput',
    componentProps: (opt) => {
        return {
            customProp: `custom-${opt.schema.label}`,
            onChange: (value: string) => console.log(value),
            // @ts-expect-error 不应该返回其他组件的属性
            options: [],
        };
    },
});

/**
 * 原版本测试（向后兼容）
 */

/**
 * 基本用法
 */
const formSchema1: LegacyFormSchema<Record<string, any>> = {
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: {
        placeholder: '请输入姓名',
    },
    // @ts-expect-error 使用未定义的字段会报错
    error: 1,
};
fnForm(formSchema1);
useForm({
    schemas: computed(() => [formSchema1]),
});

/**
 * 指定字段，限制字段类型
 */
const formSchema2: LegacyFormSchema<{ name: string, obj: {a: {b:string}} }, object, 'Input'> = {
    // @ts-expect-error 使用未定义的字段会报错
    field: 'obj.a.b',
    label: '年龄',
    component: 'Input',
    componentProps: {
        placeholder: '请输入年龄',
    },
};
fnFormName(formSchema2);
// 这里写范型会很麻烦，手动断言避免错误
useForm({
    schemas: computed(() => [formSchema2] as LegacyFormSchema<Record<string, any>, object, 'Input'>[]),
});

/**
 * 指定组件名，自动推导类型，获得更智能的类型提示，点击 props 可以直接跳转到类型定义
 */
const formSchema3: LegacyFormSchema<Record<string, any>> = {
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: {

    },
};
fnForm(formSchema3);
useForm({
    schemas: computed(() => [formSchema3]),
});

/**
 * componentProps 为函数
 */
const formSchemaFn: LegacyFormSchema<Record<string, any>, object, 'Input'> = {
    field: 'name',
    label: '姓名',
    component: 'Input',
    componentProps: () => {
        return {
            placeholder: '请输入姓名',
        };
    },
};
fnForm(formSchemaFn);
useForm({
    schemas: computed(() => [formSchemaFn]),
});

/**
 * 自定义组件基本用法
 */
type CustomComponentPropsMap = {
    MyInput: {
        placeholder: string;
    };
};
type FormComponentNames = keyof (CustomComponentPropsMap & BuiltInFormComponentPropsMap);
type FormCustomSchema<
    ComponentName extends FormComponentNames = FormComponentNames,
    Fields extends Record<string, any> = Record<string, any>,
> = LegacyFormSchema<Fields, CustomComponentPropsMap, ComponentName>;
const formCustomSchema: FormCustomSchema = {
    field: 'name',
    label: '姓名',
    component: 'MyInput',
    componentProps: {
        placeholder: '请输入姓名',
    },
};
fnForm(formCustomSchema);
useForm({
    schemas: computed(() => [formCustomSchema]),
});

/**
 * 使用表单
 */
function fnForm(formSchema: FormSchema): FormSchema {
    return formSchema;
}
function fnFormName(formSchema: FormSchema<{ name: string, obj: {a: {b:string}} }>): FormSchema<{ name: string, obj: {a: {b:string}} }> {
    return formSchema;
}
