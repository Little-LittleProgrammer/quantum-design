<template>
    <div>
        <qm-header :environmentData="$store.state.global.environmentData" :systemName="$store.state.global.systemName" :initMenu="$store.state.systemManagement.initMenuData" :menuData="$store.state.systemManagement.mainMenuData"></qm-header>
        <div class="wrapper">
            <qm-aside :menuData="$store.state.systemManagement.asideMenuData"></qm-aside>
            <div class="main js-layout-main">
                <router-view v-if="routeRefresh"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import qmHeader from '@/component/qm-header';
import qmAside from '@/component/qm-aside';
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
        'qm-aside': qmAside
    },
    computed: {
    },
    created() {
    }
};
</script>
<style lang="scss" scoped>
</style>
