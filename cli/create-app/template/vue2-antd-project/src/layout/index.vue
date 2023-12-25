<!--
 * @Author: your name
 * @Date: 2020-07-31 13:56:34
 * @LastEditTime: 2020-08-24 17:52:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-project/cli3-antd-single-project/src/layout/index.vue
-->
<template>
    <div>
        <qm-header :environmentData="$store.state.global.environmentData" :systemName="$store.state.global.systemName" :initMenu="$store.state.systemManagement.initMenuData" :menuData="$store.state.systemManagement.mainMenuData"></qm-header>
        <div class="wrapper">
            <qm-aside :menuData="$store.state.systemManagement.asideMenuData"></qm-aside>
            <div class="main js-layout-main">
                <a-spin :spinning="$store.state.global.pageLoading" size="large" class="page-loading">
                    <router-view v-if="routeRefresh"></router-view>
                </a-spin>
            </div>
        </div>
    </div>
</template>
<script>
import qmHeader from '@/component/qm-header';
import qmAside from '@/component/qm-aside';
import { Spin } from 'ant-design-vue';
export default {
    data() {
        return {
            routeRefresh: 1
        };
    },
    watch: {
        '$route'(to, from) {
            if (to.path == from.path && (to.query.no_refresh == undefined || to.query.no_refresh == 0)) {
                this.routeRefresh = 0;
                this.$nextTick(() => {
                    this.routeRefresh = 1;
                });
            }
        }
    },
    components: {
        'qm-header': qmHeader,
        'qm-aside': qmAside,
        'a-spin': Spin
    },
    computed: {
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
</style>
