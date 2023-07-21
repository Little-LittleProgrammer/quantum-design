<!--  -->
<template>
    <div class="q-project-setting-footer">
        <a-button @click="reset">重置</a-button>
        <a-button type="primary" danger @click="log_out">退出登录</a-button>
    </div>
</template>

<script lang='ts' setup>
import { js_create_local_storage } from '@wuefront/utils';
import { onMounted, PropType} from 'vue';
import { IProjectConfig } from '../type';
import { useProjectSetting } from '../hooks/use-project-setting';
const props = defineProps({
    defaultSetting: {
        type: Object as PropType<IProjectConfig>,
        default: () => {}
    }
});
const projectStore = useProjectSetting();
const ls = js_create_local_storage();
function reset() {
    projectStore.setRootSetting(props.defaultSetting);
}
function log_out() {
    ls.clear();
    location.reload();
}
onMounted(() => {
});

</script>
