<!--  -->
<template>
    <q-drawer v-bind="$attrs" @register="registerDrawer" @ok="edit_save" @close="edit_cancel">
        <q-form @register="registerForm"></q-form>
    </q-drawer>
</template>

<script lang='ts' setup>
import { computed, reactive } from 'vue';
import { QDrawer, useDrawerInner, QForm, useForm, FormSchema } from '@wuefront/vue3-antd-pc-ui';
import { IExampleData } from '../interface';
import { useMessage } from '@wuefront/hooks/vue';

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
    validate().then((values) => {
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
