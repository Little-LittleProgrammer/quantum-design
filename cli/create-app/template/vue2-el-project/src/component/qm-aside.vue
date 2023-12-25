<template>
    <div class="qm-aside" :class="{'qm-aside-hide': !isShow}">
        <el-menu class="qm-aside-tabs" ref="ref-aside-menu" :default-openeds="openKeys" :default-active="selectedKey">
            <template v-for="second_level in asideMenuData">
                <el-menu-item :key="second_level.id" :index="second_level.id" v-if="second_level.children == undefined">
                    <a :href="second_level.path" target="_blank" class="qm-aside-title" @click.stop="jump_page(second_level, $event)" slot="title">
                        <i class="el-icon" :class="second_level.icon"></i>{{ second_level.auth_name }}
                    </a>
                </el-menu-item>
                <el-submenu :key="second_level.id" :index="second_level.id" v-else>
                    <template slot="title">
                        <span slot="title" class="qm-aside-title">
                            <i class="el-icon" :class="second_level.icon"></i>{{ second_level.auth_name }}
                        </span>
                    </template>
                    <el-menu-item :key="third_level.id" :index="third_level.id" v-for="third_level in second_level.children">
                        <a :href="third_level.path" target="_blank" class="qm-aside-link" @click.stop="jump_page(third_level, $event)">{{ third_level.auth_name }}</a>
                    </el-menu-item>
                    
                </el-submenu>
            </template>
        </el-menu>
        <div class="qm-aside-arrow-btn" @click="show_hide_aside">
            <i class="el-icon el-icon-arrow-left" v-if="isShow"></i><i class="el-icon el-icon-arrow-right" v-else></i>
            <!-- <a-icon type="caret-left" v-if="isShow" /><a-icon type="caret-right" v-else /> -->
        </div>
    </div>
</template>
<script>
// import { Layout, Menu, Icon } from 'ant-design-vue';
export default {
    props: {
        menuData: {
            type: Array,
            required: true,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            selectedKeys: [],
            selectedKey: '',
            init: true, //  初始化
            isShow: true
        };
    },
    computed: {
        openKeys(){ // 默认侧边栏展开id数组
            const _openKeys = [];
            this.menuData.forEach((n, i) => {
                if (n.children != undefined){
                    _openKeys.push(n.id);
                }
            });
            return _openKeys;
        },
        asideMenuData(){ // 侧边栏数据
            if (this.menuData.length == 0){
                return false;
            }
            const _routePath = this.$route.path;
            let _selectedKey = '';
            this.menuData.some((n, i) => {
                if (n.children == undefined){
                    if (_routePath.includes(n.path)){
                        _selectedKey = n.id;
                        return true;
                    }
                } else {
                    n.children.some((m, j) => {
                        if (_routePath.includes(m.path)){
                            _selectedKey = m.id
                            return true;
                        }
                    });
                }
            });
            this.selectedKey = _selectedKey;
            setTimeout(() => { // 选中导航超出自动滚动到中间位置
                const $refAsideMenu = this.$refs['ref-aside-menu'].$el;
                const _height = $refAsideMenu.offsetHeight;
                const $selectedMenu = $refAsideMenu.querySelector('.is-active');
                if ($selectedMenu.length > 0){
                    const _topNum = $selectedMenu[0].offsetTop;
                    const _scrollTopNum = $refAsideMenu.scrollTop;
                    if (_topNum >= _height + _scrollTopNum - 60){
                        $refAsideMenu.scrollTo(0, _topNum - 200);
                    }
                }
            }, 500);
            
            return this.menuData;
        }
    },
    components: {

    },
    created() {
        
    },
    methods: {
        jump_page(item, event) { // 外链可以直接跳转
            if (!(item.path.includes('http://') || item.path.includes('https://') || item.path.match(/^\/\//) != null)){
                event.preventDefault();
                this.selectedKey = item.id;
                this.$router.push({
                    path: item.path,
                    query:{
                        t: Date.now()
                    }
                });
            }
        },
        show_hide_aside(){
            this.isShow = !this.isShow
        }
    }
};
</script>
<style lang="scss">
    .qm-aside{
        background: $aside-bg;
        position: relative;
        width: $aside-width !important;
        min-width: $aside-width !important;
        max-width: $aside-width !important;
        &:before{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 100%;
            z-index: 5;
            overflow: hidden;
            border-right: 1px solid $aside-right-border-color;
        }
        &-tabs{
            position: relative;
            z-index: 10;
            background: none;
            border: 0 none;
        }
        &-hide {
            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            .qm-aside-tabs {
                display: none;
            }
            &-arrow-btn {
                .el-icon {
                    transform: rotateZ(180deg) translate(-50%, -50%);
                }
            }
        }
        &-arrow-btn {
            right: -10px;
            width: 11px;
            height: 100px;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
            background: $aside-bg;
            cursor: pointer;
            position: absolute;
            transform: translate(0, -50%);
            top: 50%;
            border: 1px solid $aside-right-border-color;
            border-left: 0 none;
            z-index: 5;
            .el-icon {
                position: absolute;
                top: 50%;
                right: -1px;
                margin-top: -3px;
                font-size: 11px;
                color: $text-color-secondary;
            }
        }
        &-title{
            font-weight: bold;
            display: block;
            color: $aside-tabs-color;
            padding-left: $aside-padding;
            line-height: $aside-height;
            height: $aside-height;
            font-size: $aside-tabs-size;
            .el-icon{
                display: inline-block;
                vertical-align: top;
                width: 14px;
                padding-right: $space;
                height: 100%;
                overflow: hidden;
                line-height: $aside-height;
                height: $aside-height;
            }
        }
        &-link{
            display: block;
            padding-left: $aside-padding + $space + 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: $aside-tabs-color;
            &:hover{
                color: $aside-tabs-hover-color;
                background: $aside-tabs-hover-bg;
            }
        }
        .el-menu{
            background: none;
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;
            .el-icon{
                &-arrow-down{
                    right: 10px;
                }
            }
            .el-submenu {
                min-width: $aside-width;
                &__title{
                    padding: 0 !important;
                    line-height: $aside-height;
                    height: $aside-height;
                    background: none;
                }
                &.is-active{
                    .qm-aside-title{
                        color: $primary-color;
                    }
                }
            }
            &-item{
                background: none;
                padding: 0 !important;
                line-height: $aside-height;
                height: $aside-height;
                min-width: $aside-width;
                &.is-active{
                    .qm-aside-link,.qm-aside-title{
                        background: $aside-tabs-cur-bg;
                        color: $aside-tabs-cur-color;
                    }
                }
            }
        }
    }
</style>
