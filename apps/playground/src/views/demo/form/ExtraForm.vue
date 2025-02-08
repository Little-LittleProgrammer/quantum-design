<!--  -->
<template>
    <div>
        <a-card class="g-mt">
            <q-antd-form @register="registerForm2">
                <template #extra="{model, field}">
                    <p>aaaa{{ model[field] }}</p>
                </template>
            </q-antd-form>
        </a-card>
    </div>
</template>

<script lang='ts' setup>
import {computed, onMounted, onUnmounted} from 'vue';
import {QCodeEditor, QRichText} from '@quantum-design/vue3-pc-ui';
import { useForm, type FormSchema, QAntdForm, useComponentRegister, delComponentRegister } from '@quantum-design/vue3-antd-pc-ui';
defineOptions({
    name: 'UseForm',
});

useComponentRegister('CodeEditor', QCodeEditor);
useComponentRegister('RichText', QRichText);

interface Test{
    name: string;
    sub: {
        name: string;
        sub: {
            name: string;
            date: string;
            code: string;
            rich: string
        }
    }
}

const schemas = computed<FormSchema<Test, 'CodeEditor' | 'RichText'>[]>(() => [{
    label: '姓名',
    field: 'name',
    component: 'Input',
    required: true,
}, {
    label: 'sub姓名',
    field: 'sub.name',
    component: 'Input',
    required: true,
    componentProps: ({formModel, }) => {
        return {
            onChange: () => {
                console.log(formModel);
                formModel.sub.sub.name = '11111';
            },
        };
    },
}, {
    label: 'sub下的sub姓名',
    field: 'sub.sub.name',
    component: 'Input',
    required: true,
}, {
    label: '日期',
    field: 'sub.sub.date',
    component: 'DatePicker',
}, {
    label: '代码',
    field: 'sub.sub.code',
    component: 'CodeEditor',
    colProps: {
        span: 24,
    },
    componentProps: {
        style: {height: '800px', },
    },
}, {
    label: '富文本',
    field: 'sub.sub.rich',
    component: 'RichText',
    colProps: {
        span: 24,
    },
    componentProps: {
        style: {height: '800px', },
    },
}]);

const [registerForm2, {getFieldsValue, setFieldsValue, validateFields, }] = useForm({
    schemas,
    labelWidth: 130,
    baseColProps: {
        span: 13,
    },
    actionColOptions: {
        span: 24,
    },
    submitButtonOptions: {
        title: '提交',
    },
    resetButtonOptions: {
        title: '取消',
    },
    submitFunc: async() => {
        await validateFields();
        console.log(getFieldsValue());
    },
});

onMounted(async() => {
    await setFieldsValue({
        name: '张三',
        sub: {
            name: '李四',
            sub: {
                code: "({app, dataSource,}, params) => {console.log(app, dataSource);dataSource.setData('我改变了', 'a1'); }",
            },
        },
    });
});

onUnmounted(() => {
    delComponentRegister('CodeEditor');
});

</script>
<style lang='scss' scoped>
</style>
