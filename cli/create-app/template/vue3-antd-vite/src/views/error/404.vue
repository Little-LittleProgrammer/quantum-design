<template>
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
        <template #extra>
            <a-button type="primary" @click="back_home">回到首页</a-button>
        </template>
    </a-result>
</template>
<script lang="ts">
import { useGo } from '@q-front-npm/hooks/vue/use-page';
import { defineComponent } from 'vue';
export default defineComponent({
    setup() {
        const go = useGo();
        const back_home = () => {
            go({
                path: '/'
            });
        };
        return {
            back_home
        };
    }
});

</script>

<style lang="scss" scoped>

</style>
