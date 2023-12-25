<template>
    <a-layout-sider class="qm-aside" ref="ref-aside-menu" :class="{'qm-aside-hide': !isShow}">
        <a-menu mode="inline" :defaultOpenKeys="defaultOpenKeys" class="qm-aside-tabs" :openKeys.sync="openKeys"  v-model="selectedKeys" :inlineIndent="0">
            <template v-for="second_level in asideMenuData">
                <a-menu-item :key="second_level.id" v-if="second_level.children == undefined">
                    <a :href="second_level.path" target="_blank" class="qm-aside-title"  @click.stop="jump_page(second_level, $event)"><a-icon :type="second_level.icon" v-if="second_level.icon != undefined && second_level.icon != ''" /><i class="i-icon-block" v-else></i>{{ second_level.auth_name }}</a>
                </a-menu-item>
                <a-sub-menu :key="second_level.id" v-else>
                    <span slot="title" class="qm-aside-title"><a-icon :type="second_level.icon" v-if="second_level.icon != undefined && second_level.icon != ''" /><i class="i-icon-block" v-else></i>{{ second_level.auth_name }}</span>
                    <a-menu-item :key="third_level.id" v-for="third_level in second_level.children">
                        <a :href="third_level.path" target="_blank" class="qm-aside-link"  @click.stop="jump_page(third_level, $event)">{{ third_level.auth_name }}</a>
                    </a-menu-item>
                </a-sub-menu>
            </template>
        </a-menu>
        <div class="qm-aside-arrow-btn" @click="show_hide_aside"><a-icon type="caret-left" v-if="isShow" /><a-icon type="caret-right" v-else /></div>
    </a-layout-sider>
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
            openKeys: [],
            selectedKeys: [],
            init: true, //  初始化
            isShow: true
        };
    },
    computed: {
        defaultOpenKeys(){ // 默认侧边栏展开id数组
            const _defaultOpenKeys = [];
            this.menuData.forEach((n, i) => {
                if (n.children != undefined){
                    _defaultOpenKeys.push(n.id);
                }
            });
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.openKeys = _defaultOpenKeys;
            return _defaultOpenKeys;
        },
        asideMenuData(){ // 侧边栏数据
            if (this.menuData.length == 0){
                return false;
            }
            const _routePath = this.$route.path;
            const _selectedKey = [];
            this.menuData.some((n, i) => {
                if (n.children == undefined){
                    if (_routePath.includes(n.path)){
                        _selectedKey.push(n.id);
                        return true;
                    }
                } else {
                    n.children.some((m, j) => {
                        if (_routePath.includes(m.path)){
                            _selectedKey.push(m.id);
                            return true;
                        }
                    });
                }
            });
            this.selectedKeys = _selectedKey;
            setTimeout(() => { // 选中导航超出自动滚动到中间位置
                const $refAsideMenu = this.$refs['ref-aside-menu'].$el.querySelectorAll('.ant-layout-sider-children')[0];
                const _height = $refAsideMenu.offsetHeight;
                const $selectedMenu = $refAsideMenu.querySelectorAll('.ant-menu-item-selected');
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
        // 'a-layout-sider': Layout.Sider,
        // 'a-menu': Menu,
        // 'a-menu-item': Menu.Item,
        // 'a-sub-menu': Menu.SubMenu,
        // 'a-icon': Icon
    },
    created() {
    },
    methods: {
        jump_page(item, event) { // 外链可以直接跳转
            if (!(item.path.includes('http://') || item.path.includes('https://') || item.path.match(/^\/\//) != null)){
                event.preventDefault();
                this.selectedKeys = [item.id];
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
                &:before {
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
            .anticon{
                position: absolute;
                top: 50%;
                right: -1px;
                margin-top: -3px;
                font-size: 11px;
                color: $text-color-secondary;
            }
            // &:before {
            //     content: '';
                
            //     border-top: 4px solid transparent;
            //     border-right: 4px solid #bbb;
            //     border-bottom: 4px solid transparent;
            //     width: 0;
            //     height: 0;
                
            //     /*transition: transform 0.3s linear;*/
            // }
            // &:hover {
            //     &:before {
            //         border-right: 4px solid #333;
            //     }
            // }
        }
        &-title{
            font-weight: bold;
            display: block;
            color: $aside-tabs-color;
            padding-left: $aside-padding;
            line-height: $aside-height;
            height: $aside-height;
            font-size: $aside-tabs-size;
            .i-icon-block{
                display: inline-block;
                vertical-align: top;
                width: 14px;
                padding-right: $space;
                height: 100%;
            }
        }
        &-link{
            display: block;
            padding-left: $aside-padding + 24;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .ant-menu{
            background: none;
            &-submenu{
                &-title{
                    margin: 0;
                }
                &-selected{
                    .qm-aside-title{
                        color: $primary-color;
                    }
                }
            }
            .ant-menu-item{
                line-height: $aside-height;
                height: $aside-height;
                margin: 0;
                font-size: $aside-tabs-size;
                color: $aside-tabs-color;
                box-sizing: border-box;
                &:after{
                    display: none;
                }
                a{
                    color: $aside-tabs-color;
                }
                &:hover,&.ant-menu-item-active,&.ant-menu-item-selected{
                    border: 0 none;
                }
                &:hover,&.ant-menu-item-active{
                    background: $aside-tabs-hover-bg;
                    a{
                        color: $aside-tabs-hover-color;
                    }
                }
                &.ant-menu-item-selected{
                    background: $aside-tabs-cur-bg;
                    font-weight: bold;
                    a{
                        color: $aside-tabs-cur-color;
                    }
                    .qm-aside-title{
                        color: $aside-tabs-cur-color;
                    }
                }
            }
        }
        .ant-layout-sider-children{
            overflow-y: auto;
            overflow-x: hidden;
        }
        
    }
</style>
