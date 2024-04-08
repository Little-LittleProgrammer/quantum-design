<!--  -->
<template>
    <div>
        <a-card>
            <q-antd-form @register="registerForm"></q-antd-form>
        </a-card>
        <a-card class="g-mt">
            <q-antd-form @register="registerForm2" @blur="formChange" @change="formChange">
                <template #extra="{model, field}">
                    <p>aaaa{{ model[field] }}</p>
                </template>
            </q-antd-form>
        </a-card>
    </div>
</template>

<script lang='ts' setup>
import {computed, onMounted} from 'vue';
import { useForm, FormSchema, QAntdForm } from '@quantum-design/vue3-antd-pc-ui';
defineOptions({
    name: 'UseForm',
});

interface Test{
    name: string;
    sub: {
        name: string;
        sub: {
            name: string;
            date: string;
        }
    }
}

const schemas = computed<FormSchema<Test>[]>(() => [{
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
                formModel['sub.sub.name'] = '11111';
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
}]);

const [registerForm, {getFieldsValue, setFieldsValue, }] = useForm({
    schemas,
    layout: 'inline',
    submitFunc: async() => {
        console.log(getFieldsValue());
    },
});
const [registerForm2, {getFieldsValue: getFieldsValue1, setFieldsValue: setFieldsValue1, validateFields, }] = useForm({
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
        console.log(getFieldsValue1());
    },
});

onMounted(async() => {
    await setFieldsValue({
        name: '张三',
        sub: {
            name: '李四',
        },
    });
    await setFieldsValue1({
        name: '张三',
        sub: {
            name: '李四',
        },
    });
    console.log(getFieldsValue());
});

function formChange(e) {
    console.log('formValue', e);
}

</script>
<style lang='scss' scoped>
</style>
