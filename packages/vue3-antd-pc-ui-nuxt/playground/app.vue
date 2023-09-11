<!--  -->
<template>
    <div>
        <q-antd-form @register="register">

        </q-antd-form>
    </div>
</template>

<script lang='ts' setup>
import {useForm} from '@quantum-design/vue3-antd-pc-ui';
interface IDataProps {}
const data: IDataProps = reactive({

});

const schemas = computed(() => {
    return [{field: 'a', label: 'a', component: 'Input'}];
});

const [register] = useForm({
    schemas: schemas
});

</script>
<style lang='scss' scoped>
</style>
