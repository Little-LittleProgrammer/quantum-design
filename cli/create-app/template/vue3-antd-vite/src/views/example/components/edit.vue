<!--  -->
<template>
    <q-antd-drawer v-bind="$attrs" @register="registerDrawer" @ok="edit_save" @close="edit_cancel">
        <q-antd-form @register="registerForm"></q-antd-form>
    </q-antd-drawer>
</template>

<script lang='ts' setup>
import { computed, reactive } from 'vue';
import { useDrawerInner, useForm, type FormSchema } from '@quantum-design/vue3-antd-pc-ui';
import type { IExampleData } from '../interface';
import { useMessage } from '@quantum-design/hooks/vue/use-message';

const emits = defineEmits(['ok', 'register']);
const {createMessage} = useMessage();
const [registerDrawer, {closeDrawer, changeOkLoading, changeLoading, setDrawerProps}] = useDrawerInner((obj: IExampleData) => {
    setFieldsValue({
        ...obj
    });
});
const schemas = computed<FormSchema<IExampleData>[]>(() => [{
    label: '名字',
    field: 'name',
    required: true,
    component: 'Input'
}, {
    label: '年龄',
    field: 'age',
    required: true,
    component: 'InputNumber'
}]);
const [registerForm, {setFieldsValue, validate, resetFields}] = useForm({
    schemas,
    labelWidth: 110,
    baseColProps: { span: 20 },
    showActionButtonGroup: false
});

function edit_save() {
    validate().then((values: any) => {
        createMessage.success('编辑成功');
        resetFields();
        emits('ok', values);
        closeDrawer();
    });
}
function edit_cancel() {
    resetFields();
}
</script>
<style lang='scss' scoped>
</style>
