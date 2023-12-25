<template>
    <a-config-provider :locale="zh_CN">
        <div id="app">
            <router-view v-if="$store.state.systemManagement.menuDataLoadingEnd"></router-view>
            <!-- 异步导出文件提示窗 -->
            <a-modal :visible.sync="$store.state.global.asyncExportNoticePop.visible" class="async-export-notice-pop"  :centered="true" :show-close="false" title="导出">
                <div class="async-download-tips">
                    <span class="s-tit">文件名：<em>{{$store.state.global.asyncExportNoticePop.file}}</em></span>
                    <span v-if="$store.state.global.asyncExportNoticePop.title && $store.state.global.asyncExportNoticePop.title != ''" v-html="$store.state.global.asyncExportNoticePop.title"></span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <a-button type="primary" @click="$store.commit('SET_ASYNC_POP_CLOSE')">确定</a-button>
                </span>
            </a-modal>
            <!-- 异步导出文件提示窗 -->
        </div>
    </a-config-provider>
</template>
<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

import { api_manage_user_auths } from '@/http/system-management/permission/person';
import { api_global_env } from '@/http/global';
export default {
    data() {
        return {
            zh_CN
        };
    },
    components: {
        
    },
    watch: {
        '$store.state.global.date'(){ 
            const _time = this.$store.state.global.date.getTime();
            const _rangePicker = { // 设置日期快捷键
                yesterday: {
                    '昨日': [this.$antdMoment(_time - 3600 * 1000 * 24), this.$antdMoment(_time - 3600 * 1000 * 24)],
                    '近一周': [this.$antdMoment(_time - 3600 * 1000 * 24 * 7), this.$antdMoment(_time - 3600 * 1000 * 24)],
                    '近一个月': [this.$antdMoment(_time - 3600 * 1000 * 24 * 30), this.$antdMoment(_time - 3600 * 1000 * 24)],
                    '近三个月': [this.$antdMoment(_time - 3600 * 1000 * 24 * 90), this.$antdMoment(_time - 3600 * 1000 * 24)]
                },
                today: {
                    '今日': [this.$antdMoment(_time), this.$antdMoment(_time)],
                    '近一周': [this.$antdMoment(_time - 3600 * 1000 * 24 * 7), this.$antdMoment(_time)],
                    '近一个月': [this.$antdMoment(_time - 3600 * 1000 * 24 * 30), this.$antdMoment(_time)],
                    '近三个月': [this.$antdMoment(_time - 3600 * 1000 * 24 * 90), this.$antdMoment(_time)]
                }
            };
            this.$store.commit('SET_ANTD_RANGE_PICKER_DATA', _rangePicker);

            const _defaultPicker = { // 设置默认展示月份区间
                prev: [this.$antdMoment(_time).month(this.$antdMoment(_time).month() - 1), this.$antdMoment(_time)]
            };
            this.$store.commit('SET_ANTD_DEFAULT_PICKER_DATA', _defaultPicker);
        }
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
                                this.$antdMessage.error('请通知管理员设置初始页面');
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
        }
    }
};
</script>
<style lang="scss" scoped>

// 异步提示弹窗
.async-export-notice-pop{
    .async-download-tips{
        span{
            display: block;
            line-height: 30px;
            font-size: 16px;
            &.s-tit{
                em{
                    font-weight: bold;
                    font-size: 18px;
                }
            }
            a{
                color: $primary-color;
            }
        }
    }
}

</style>
