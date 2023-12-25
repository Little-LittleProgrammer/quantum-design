<template>
    <div>
        <qm-header :environmentData="$store.state.global.environmentData" :systemName="$store.state.global.systemName" :initMenu="$store.state.systemManagement.initMenuData" :menuData="$store.state.systemManagement.mainMenuData"></qm-header>
        <div class="wrapper">
            <qm-aside :menuData="$store.state.systemManagement.asideMenuData"></qm-aside>
            <div class="main js-layout-main">
                <Nuxt />
            </div>
            <!-- 异步导出文件提示窗 -->
            <qm-async-export-notice-pop :data="$store.state.global.asyncExportNoticePop" @submit="close_async_export_notice_pop"></qm-async-export-notice-pop>
            <!-- 异步导出文件提示窗 -->
        </div>
    </div>
</template>
<script>
import qmHeader from '@/components/qm-header';
import qmAside from '@/components/qm-aside';
import { api_global_env } from '@/http/global';
export default {
    head(){
        return {
            title: this.routeName
        };
    },
    data() {
        return {
            routeName: '',
            routeRefresh: 1
        };
    },
    watch: {
        $route(to, from) {
            if (
                to.path == from.path &&
                (to.query.no_refresh == undefined || to.query.no_refresh == 0)
            ) {
                this.routeRefresh = 0;
                this.$nextTick(() => {
                    this.routeRefresh = 1;
                });
            }
            this.get_all_permission(this.$store.state.systemManagement.asideMenuData);
        }
    },
    components: {
        'qm-header': qmHeader,
        'qm-aside': qmAside
    },
    computed: {},
    mounted() {
        this.get_menus_data();
        this.get_global_env();
        this.get_all_permission(this.$store.state.systemManagement.asideMenuData);
    },
    methods: {
        get_menus_data() {
            const init_path = this.$store.state.systemManagement.initMenuData;
            if (!window.location.href.includes('/backend/')) {
                if (init_path == '') {
                    this.$router.replace({
                        path: '/backend'
                    });
                    this.$elMessage.error('请通知管理员设置初始页面');
                } else {
                    this.$router.replace({
                        path: init_path
                    });
                }
            }
        },
        // 递归获取所有菜单权限
        get_all_permission(arr){
            arr.forEach(item => {
                if (!item.children){
                    if (this.$route.path === item.path){
                        this.routeName = item.auth_name;
                        return true;
                    }
                } else if (item.children && item.children.length > 0){
                    this.get_all_permission(item.children.filter(n => n.url_type != 2));
                }
            });
        },
        async get_global_env() {
            // 环境检测
            const _envData = await api_global_env();
            if (_envData && _envData.code == 200) {
                this.$store.commit('SET_ENVIRONMENT_DATA', _envData.data);
            }
            setTimeout(() => {
                this.get_global_env();
            }, 3 * 60 * 1000);
        },
        close_async_export_notice_pop(data) {
            this.$store.commit('SET_ASYNC_POP_STATUS', data);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
