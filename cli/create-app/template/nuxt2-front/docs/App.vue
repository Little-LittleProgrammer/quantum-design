<template>
    <div class="docs-body">
        <ul class="docs-menu">
            <li class="project-name">
                <img src="https://cdn-front.wtzw.com/global/static/images/logo.png" alt="">
                <span>{{projectName}}</span>
            </li>
            <li class="docs-menu-search">
                <input class="docs-menu-search-input" type="text" placeholder="组件名称" v-model="keySearch"/>
            </li>
            <li>
                <navSide :navArray="menuList" :activeKey="activeComponent" :search="keySearch"></navSide>
            </li>
        </ul>
        <div class="md-content">
            <component :is="activeComponent" class="markdown-body"/>
        </div>
        <div class="top" @click="go_top" v-if="showUp"></div>
    </div>
</template>
<script>
import navSide from '~/docs/public/nav.vue';
import { query_to_bind_url } from './public/tools' 
export default {
    components: {
        navSide
    },
    layout: function () {
    // 自定义layout
        return 'docs-layout';
    },
    data() {
        return {
            menuList: this.$menuList,
            activeComponent: '',
            keySearch: '',
            projectName: this.$projectName,
            showUp: false
        };
    },
    mounted() {
        const _comp = this.$route.query.type || this.find_vue(this.menuList) || '';
        this.$bus.$on('setKey', (key) => {
            this.activeComponent = key;
        });
        this.select(_comp);
        this.set_keyword();
        this.$nextTick(() => {
            const _el = document.querySelector('.md-content');
            _el.addEventListener('scroll', this.scroll);
            this.$once('hook:beforeDestroy', () => {
                _el.removeEventListener('scroll', this.scroll);
            });
        });
    },
    methods: {
        select(key, goTop){
            if (!key) return;
            query_to_bind_url({type: key});
            this.$bus.$emit('setKey', key);
        },
        scroll() {
            const _el = document.querySelector('.md-content');
            this.showUp = _el.scrollTop > 500;
        },
        go_top() {
            const _el = document.querySelector('.md-content');
            _el.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        // 查找第一个组件
        find_vue(arr) {
            let _str = '';
            const fn = (arr) => {
                return arr.some(_a => {
                    // 文件夹向下搜索
                    if (_a.children && _a.children.length > 0) {
                        return fn(_a.children);
                    }
                    // 非文件夹选中
                    if (_a.type == 'vue') {
                        _str = _a.component;
                        return true;
                    }
                });
            };
            fn(arr || []);
            return _str || '';
        },
        // 设置列表搜索字段
        set_keyword() {
            const fn = (arr, parent) => {
                arr.forEach(_a => {
                    parent ? _a.parent = parent : '';
                    if (_a.children && _a.children.length > 0) {
                        fn(_a.children, _a);
                    }
                    if (_a.type == 'vue') {
                        _a.searchKeyword = `${_a.label}~${_a.value}`;
                        _a?.parent?.label ? fnParent(_a.parent, _a.searchKeyword) : '';
                    }
                });
            };
            const fnParent = (obj, str) => {
                obj.searchKeyword = obj.searchKeyword ? `${obj.searchKeyword}~${str || ''}` : `${obj.label}~${obj.value}~${str || ''}`;
                obj?.parent?.label ? fnParent(obj.parent, obj.searchKeyword) : '';
            };
            fn(this.menuList);
        }
    }
};
</script>
<style lang="scss">
.markdown-body {
    background: #fff!important;
    color: #333!important;
    padding: 20px 0;
    max-width: 100%;
    // 修复样式差异
    .demo {
        ul {
            margin-bottom: 0;
            padding-left: 0;
        }
    }
    table {
        background: #fff!important;
        tr {
            background-color: #fff!important;
        }
        th, td {
            border-color: #bbb!important;
            color: #333;
        }
        td {
            color: #666!important;
        }
    }
    h1, h2 {
        border-bottom: none!important;
    }
}
.docs-body {
    display: flex;
    height: calc(100vh - 20px);
    overflow: hidden;
    font-size: 14px;
    .docs-menu {
        margin: 0;
        padding: 0;
        list-style: none;
        height: 100%;
        width: 230px;
        min-width: 230px;
        border-right: 1px solid #eee;
        overflow-y: auto;
        &-search {
            background: #fff;
            position: sticky;
            top: 0;
            padding: 20px 10px;
            display: flex;
            &-input {
                flex: 1;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 8px 5px;
                font-size: 12px;
                
            }
            input::-webkit-input-placeholder {
                font-size: 12px!important;
            }
            input:focus {
                border: 1px solid $brand_color;
            }
            input:focus-visible {
                outline: none!important;
            }

        }
    }
    .md-content {
        display: flex;
        // justify-content: space-around;
        overflow: auto;
        height: 100%;
        width: 100%;
        padding: 0 20px;
    }
    .project-name {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        background: #fff;
        img {
            width: 30px;
        }
        span {
            font-size: 18px;
            margin-left: 10px;
        }
    }
}
.demo {
    // @import '~/assets/style/global';
}
</style>
<style lang="scss" scoped>
.top {
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid transparent;
    box-shadow: 0 0 3px 1px #ccc;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all .3s;
    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 8px solid $brand_color;
        border-bottom-color: transparent;
        border-left-color: transparent;
        transform: rotate(-45deg);
        top: 20px;
        right: 17px;
    }
    &:hover {
        background: $brand_color;
        box-shadow: 0 0 1px 2px $brand_color;
        &::after {
            border-top-color: #fff;
            border-right-color: #fff
        }
    }
}
</style>
