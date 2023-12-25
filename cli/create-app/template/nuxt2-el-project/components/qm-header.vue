<template>
    <header class="qm-header">
        <a :href="initMenu" class="qm-header-logo"><img src="@/assets/images/logo.png" alt /><span class="s-name" v-if="systemName != ''">{{ systemName }}</span></a>
        <span class="qm-header-environment" v-if="environmentData.env == '0' ">&bull;<em>测试</em></span>
        <div class="qm-header-tabs">
            <el-menu mode="horizontal" :default-active="selectedKey">
                <el-menu-item v-for="item in menuData" :index="item.id" :key="item.id">
                    <a :href="item.path" target="_blank" @click.stop="jump_page(item, $event)">{{ item.auth_name }}</a>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="qm-header-function">
            <slot name="header-function"></slot>
        </div>
    </header>
</template>
<script>

export default {
    props: {
        menuData: { // 导航数据
            type: Array,
            required: true,
            default: () => {
                return [];
            }
        },
        environmentData: { // 环境
            type: Object,
            default: () => {
                return {
                    env: '', // 0:测试环境 1:正式环境
                    title: ''
                };
            }
        },
        systemName: { // 系统名称
            type: String,
            default: ''
        },
        initMenu: { // 初始页面
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedKey: ''
        };
    },
    watch: {
        '$route.path'(){
            this.init_data();
        }
    },
    components: {
    },
    computed: {},
    mounted() {
        this.init_data();
    },
    methods: {
        init_data(){
            const _routePath = this.$route.path;
            this.menuData.some((n, i) => {
                if (_routePath.includes(n.path)){
                    this.selectedKey = n.id;
                }
            });
            const _findMenu = this.menuData.find(_item => _routePath.includes(_item.path));
            if (_findMenu){
                if (_findMenu.children != undefined) {
                    this.$store.commit('SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA', _findMenu.children);
                } else { // 无二级导航时 清空二级导航数据
                    this.$store.commit('SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA', []);
                }
            }
        },
        // 选择父导航，筛选除对应左侧菜单
        jump_page(item, event) {
            if (!(item.path.includes('http://') || item.path.includes('https://') || item.path.match(/^\/\//) != null)){
                // if (item.children != undefined) {
                //     this.$store.commit('SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA', item.children);
                // } else { // 无二级导航时 清空二级导航数据
                //     this.$store.commit('SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA', []);
                // }
                event.preventDefault();
                this.selectedKey = item.id;
                if (item.children != undefined && item.children.length > 0){
                    if ((item.children[0].path.includes('http://') || item.children[0].path.includes('https://') || item.children[0].path.match(/^\/\//) != null)){
                        this.$router.push({
                            path: item.path,
                            query: {
                                t: Date.now()
                            }
                        });
                    } else {
                        if (item.children[0].children != undefined && item.children[0].children.length > 0){
                            this.$router.push({
                                path: item.children[0].children[0].path,
                                query: {
                                    t: Date.now()
                                }
                            });
                        } else {
                            this.$router.push({
                                path: item.children[0].path,
                                query: {
                                    t: Date.now()
                                }
                            });
                        }
                    }
                } else {
                    this.$router.push({
                        path: item.path,
                        query: {
                            t: Date.now()
                        }
                    });
                }
            }
        }
    }
};
</script>
<style lang="scss">
    .qm-header {
        padding: 0 $space;
        display: flex;
        background: $header-bg;
        &-logo {
            padding: $space 0;
            height: $header-height;
            box-sizing: border-box;
            // vertical-align: top;
            display: block;
            img {
                display: inline-block;
                height: 100%;
                vertical-align: top;
            }
            .s-name{
                font-size: $header-system-size;
                color: $header-system-color;
                padding-left: 8px;
                display: inline-block;
                font-weight: bold;
                line-height: $header-height - $space * 2;
                height: $header-height - $space * 2;
            }
        }
        &-environment{
            font-size: $header-environment-size;
            color: $header-environment-color;
            display: block;
            font-weight: bold;
            // vertical-align: top;
            line-height: $header-height;
            white-space: nowrap;
            padding-left: $space / 2;
            em{
                padding-left: $space / 2;
            }
        }
        &-tabs{
            flex: 1;
            width: 100%;
            display: block;
            text-align: left;
            overflow: hidden;
            padding-left: $space * 2;
            // overflow-x: scroll;
            .el-menu{
                background: none;
                border: 0 none;
            }
            .el-menu-item,.el-menu-submenu{
                border: 0 none;
                color: $header-tabs-color;
                vertical-align: top;
                line-height: $header-height;
                height: $header-height;
                overflow: hidden;
                a {
                    display: block;
                    color: $header-tabs-color;
                }
                &:hover,&:focus,&.is-active,&.is-selected,&.is-submenu-active,&.is-submenu-selected{
                    border: 0 none;
                    background: $header-tabs-hover-bg !important;
                    a{
                        color: $header-tabs-hover-color !important;
                    }
                }
                &:hover,&.is-active,&.is-submenu-active{
                    background: $header-tabs-hover-bg !important;
                    a{
                        color: $header-tabs-hover-color !important;
                    }
                }
                &.is-selected,&.is-submenu-selected{
                    background: $header-tabs-cur-bg;
                    font-weight: bold;
                    a{
                        color: $header-tabs-cur-color;
                    }
                }
            }
        }
        &-function{
            padding-left: $space * 2;
            display: block;
            @include flex-center();
            .el-btn,a{
                margin-left: $space;
                display: inline-block;
                &:first-child{
                    margin-left: 0;
                }
            }
            a{
                line-height: 32px;
            }
        }
    }
</style>
