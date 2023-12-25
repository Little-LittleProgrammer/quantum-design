<template>
    <div id="app">
        <router-view v-if="$store.state.systemManagement.menuDataLoadingEnd"></router-view>

        <!-- 异步导出文件提示窗 -->
        <qm-async-export-notice-pop :data="$store.state.global.asyncExportNoticePop" @submit="close_async_export_notice_pop"></qm-async-export-notice-pop>
        <!-- 异步导出文件提示窗 -->

    </div>
</template>
<script>
import { api_manage_user_auths } from '@/http/system-management/permission/person';
import { api_global_env } from '@/http/global';
import qmAsyncExportNoticePop from '@/component/qm-async-export-notice-pop';

export default {
    data() {
        return {
            
        };
    },
    components: {
        qmAsyncExportNoticePop
    },
    watch: {
        
    },
    computed: {
    },
    created() {
        this.get_menus_data();
        this.get_global_env();
    },
    methods: {
        get_menus_data(){ // 导航权限数据
            if (this.$store.state.global.authorityMannage){
                api_manage_user_auths().then(res => {
                    if (res.code == 200){
                        this.$store.commit('SET_SYSTEM_MANAGEMENT_MAIN_MENU_DATA', res.data.auth_list);
                        this.$store.commit('SET_SYSTEM_MANAGEMENT_INIT_MENU_DATA', res.data.init_path);
                        this.$store.commit('SET_SYSTEM_MANAGEMENT_MENU_LOADING_END_STATUS', true);
                        if (!window.location.href.includes('/backend/')){
                            if (res.data.init_path == ''){
                                this.$router.replace({
                                    path: '/backend'
                                });
                                this.$elMessage.error('请通知管理员设置初始页面');
                            } else {
                                this.$router.replace({
                                    path: res.data.init_path
                                });
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                const _menuData = require('@/menus/index');
                this.$store.commit('SET_SYSTEM_MANAGEMENT_MAIN_MENU_DATA', _menuData.default);
                this.$store.commit('SET_SYSTEM_MANAGEMENT_INIT_MENU_DATA', '');
                this.$store.commit('SET_SYSTEM_MANAGEMENT_MENU_LOADING_END_STATUS', true);
            }
        },
        get_global_env(){ // 环境检测
            api_global_env().then(res => {
                if (res.code == 200){
                    this.$store.commit('SET_ENVIRONMENT_DATA', res.data);
                }
            });
            setTimeout(() => {
                this.get_global_env();
            }, 3 * 60 * 1000);
        },
        close_async_export_notice_pop(data){
            this.$store.commit('SET_ASYNC_POP_STATUS', data);
        }
    }
};
</script>
<style lang="scss" scoped>

</style>
