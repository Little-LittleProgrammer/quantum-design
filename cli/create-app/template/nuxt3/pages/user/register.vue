<!--  -->
<template>
    <div>
        <q-antd-form @register="register"></q-antd-form>
    </div>
</template>

<script lang='ts' setup>
import { useForm } from '@q-front-npm/vue3-antd-pc-ui';

const schemas = computed(() => {
    return [{
        label: '你好',
        field: 'abc',
        component: 'Input'
    }];
});

const [register] = useForm({
    schemas: schemas
});

</script>
<style lang='scss' scoped>
</style>
