<!--  -->
<template>
    <a-button :loading="loading" v-bind="props.componentProps" @click="export_file">导出</a-button>
</template>

<script lang='ts' setup>
import { useGlobalStore } from '@/store/modules/global';
import { isFunction } from '@wuefront/utils';
import type { ButtonProps } from 'ant-design-vue';
import { onMounted, PropType, ref} from 'vue';
import { IExportOptions } from './types/interface';
const props = defineProps({
    options: {
        type: Object as PropType<IExportOptions>,
        default: () => {}
    },
    componentProps: {
        type: Object as PropType<ButtonProps>,
        default: () => {}
    }
});
const globalStore = useGlobalStore();
const loading = ref(false);

async function export_file() {
    if (!isFunction(props.options.apiFunc)) {
        console.error('请传入上传方法');
    }
    loading.value = true;
    const _res = await props.options.apiFunc(props.options.params);
    loading.value = false;
    if (_res.code === 200) {
        globalStore.set_async_export_data(_res.data);
    }
}
onMounted(() => {
});

</script>
<style lang='scss' scoped>
</style>
