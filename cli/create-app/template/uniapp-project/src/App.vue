<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useGlobalData } from './store/global-data';
import { statisticsInit } from './api/qm-statistics';

const gobalData = useGlobalData();

onLaunch(async () => {
    const systemInfo = uni.getSystemInfoSync();
    gobalData.set_system_info(systemInfo);
    gobalData.set_header_info();

    const openId = '';
    statisticsInit(openId);
});
onShow(() => {
    const { scene, query } = uni.getEnterOptionsSync();
    console.log('App Show', scene, query);
});
onHide(() => {
    console.log('App Hide');
});
</script>

<style lang="scss">
@import './assets/style/common.scss';
@import './assets/style/animate.scss';
</style>
