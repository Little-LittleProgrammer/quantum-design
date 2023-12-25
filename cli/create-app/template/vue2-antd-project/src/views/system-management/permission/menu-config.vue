<template>
    <div class="row">
        <div class="qm-form">
            <a-form-model layout="inline" :size="$store.state.antd.modelSize">
                <a-form-model-item>
                    <a-button type="primary" @click="add_first_level_menu">添加一级菜单</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <div class="qm-menu-tree">
            <div class="qm-menu-tree-th">
                <span class="s-name">菜单名称</span>
                <span class="s-url">页面地址</span>
                <span class="s-icon">图标</span>
                <span class="s-fun">操作</span>
            </div>
            <a-tree
                    v-if="isTreeShow"
                    class="draggable-tree"
                    ref="ref-menu-tree"
                    :replaceFields="replaceFields"
                    :block-node="true"
                    :selectable="false"
                    :defaultExpandedKeys="expandedKeys"
                    :expandedKeys.sync="expandedKeys"
                    draggable
                    @drop="handel_tree_drop"
                    :treeData="tableData"
            >
                <template slot="title" slot-scope="data">
                    <div class="qm-menu-tree-tb">
                        <template v-if="data.edit && data.edit == 1">
                            <span class="s-name"><a-input v-model.trim="data.auth_name" :ref="'input_' + data.id" :placeholder="data.path_type == '1' ? '请输入菜单名称' : '请输入接口名称'"/></span>
                            <span class="s-url"><a-input v-model.trim="data.path" :placeholder="data.path_type == '1' ? '请输入页面地址' : '请输入接口地址'"/></span>
                            <span class="s-icon"><a-input v-model="data.icon" placeholder="填写图标类名"/></span>
                        </template>
                        <template v-else>
                            <span class="s-name">{{data.auth_name}}<em v-if="data.path_type == '2'">(接口)</em></span>
                            <span class="s-url">{{data.path}}</span>
                            <span class="s-icon">{{data.icon}}</span>
                        </template>
                        <span class="s-fun">
                            <template v-if="data.edit && data.edit == 1">
                                <a href="javascript:void(0);" @click="() => save_menu(data)">保存</a>
                                <template v-if="data.id != '' && !data.id.includes('default-')">
                                    <a href="javascript:void(0);" @click="() => cancel_menu(data)">取消</a>
                                </template>
                            </template>
                            <template v-else>
                                <template v-if="data.path_type == '1'">
                                    <a href="javascript:void(0);" @click="() => add_sub_menu(data)">添加子菜单</a>
                                    <a href="javascript:void(0);" @click="() => add_interface(data)">添加接口</a>
                                </template>
                                <a href="javascript:void(0);" @click="() => edit_menu(data)">修改</a>
                            </template>
                            <template v-if="data.id != '' && !data.id.includes('default-')">
                                <a-popconfirm :title="'确认删除 ' + data.auth_name + (data.path_type == '1' ? ' 菜单' : '') + (data.path_type == '2' ? ' 接口' : '') + '?'" @confirm="() => delete_menu(data)" okText="确认" cancelText="取消" placement="topRight" >
                                    <a href="javascript:void(0);">删除</a>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <a href="javascript:void(0);" @click="() => delete_menu(data)">删除</a>
                            </template>
                        </span>
                    </div>
                </template>
            </a-tree>
        </div>
    </div>
</template>

<script>
import { api_manage_auth_list, api_manage_auth_create, api_manage_auth_delete, api_manage_auth_update, api_manage_auth_sort } from '@/http/system-management/permission/menu-config';
import { deep_copy } from '@/assets/js/tools';

export default {
    name: 'Menu',
    data() {
        return {
            replaceFields: { children: 'children', key: 'id', title: 'auth_name' },
            expandedKeys: [],
            defaultData: {
                auth_name: '', // 名称
                path: '', // 路径
                path_type: '1', //  菜单就是1  功能接口2
                pid: '0', //  上级菜单id，默认顶级为0
                icon: '', // 图标
                children: [], // 子菜单
                edit: 1,
                id: '',
                scopedSlots: { title: 'title' }
            },
            tableData: [],
            tempMenu: { auth_name: '', path: '', icon: '' },
            isTreeShow: true,
            sonIds: [],
            selectedMenuData: '' // 操作menu对象
        };
    },
    components: {
    },
    computed: {},
    mounted() {
        this.$store.commit('SET_PAGE_LOADING_STATUS', true);
        this.init_data();
    },
    methods: {
        async init_data(){
            const _res = await api_manage_auth_list();
            if (_res.code == '200'){
                this.update_tree_scope(_res.data.table_list);
                this.tableData = _res.data.table_list;
            }
        },
        add_first_level_menu(){ //  添加一级菜单
            const _data = deep_copy(this.defaultData);
            _data.id = 'default-' + Date.now();
            this.tableData.push(_data);
            this.scroll_to_input(_data);
        },
        add_sub_menu(data) { // 添加子集菜单
            const _data = deep_copy(this.defaultData);
            _data.id = 'default-' + Date.now();
            _data.pid = data.id;
            if (!data.dataRef.children){
                this.$set(data.dataRef, 'children', [_data]);
            } else {
                data.dataRef.children.push(_data);
            }
            if (!this.expandedKeys.includes(data.id)) {
                this.expandedKeys.push(data.id);
            }
            this.scroll_to_input(_data);
        },
        add_interface(data) { // 添加接口
            const _data = deep_copy(this.defaultData);
            _data.id = 'default-' + Date.now();
            _data.pid = data.id;
            _data.path_type = '2';
            if (!data.dataRef.children){
                this.$set(data.dataRef, 'children', [_data]);
            } else {
                data.dataRef.children.push(_data);
            }
            if (!this.expandedKeys.includes(data.id)) {
                this.expandedKeys.push(data.id);
            }
            this.scroll_to_input(_data);
        },
        save_menu(data){ //  保存菜单
            if (data.auth_name.trim() == ''){
                this.$antdMessage.error('标题不能为空');
                return false;
            }
            if (data.path.trim() == ''){
                this.$antdMessage.error('页面地址不能为空');
                return false;
            }
            const _data = {
                auth_name: data.auth_name,
                path: data.path,
                pid: data.pid,
                path_type: data.path_type,
                icon: data.icon,
                id: data.id
            };
            if (_data.id.includes('default-')){
                delete _data.id;
                api_manage_auth_create(_data).then(res => {
                    if (res.code == 200){
                        data.dataRef.edit = 0;
                        data.dataRef.id = res.data.id;
                        data.dataRef.auth_name = _data.auth_name;
                        data.dataRef.path = _data.path;
                        data.dataRef.pid = _data.pid;
                        data.dataRef.icon = _data.icon;
                        if (_data.path_type == '2'){
                            this.$antdMessage.success('接口新增成功');
                        } else {
                            this.$antdMessage.success('菜单新增成功');
                        }
                    } else {
                        this.front_remove_menu(data, this.tableData);
                    }
                });
            } else {
                api_manage_auth_update(_data).then(res => {
                    if (res.code == 200){
                        data.dataRef.edit = 0;
                        data.dataRef.auth_name = _data.auth_name;
                        data.dataRef.path = _data.path;
                        data.dataRef.icon = _data.icon;
                        if (_data.path_type == '2'){
                            this.$antdMessage.success('接口修改成功');
                        } else {
                            this.$antdMessage.success('菜单修改成功');
                        }
                    } else {
                        this.front_remove_menu(data, this.tableData);
                    }
                });
            }
        },
        // 删除菜单
        delete_menu(data) {
            if (data.id.includes('default-')){
                this.front_remove_menu(data, this.tableData);
                if (data.path_type == '2'){
                    this.$antdMessage.success('接口删除成功');
                } else {
                    this.$antdMessage.success('菜单删除成功');
                }
            } else {
                api_manage_auth_delete({id: data.id}).then(res => {
                    if (res.code == 200){
                        this.front_remove_menu(data, this.tableData);
                        if (data.path_type == '2'){
                            this.$antdMessage.success('接口删除成功');
                        } else {
                            this.$antdMessage.success('菜单删除成功');
                        }
                    }
                });
            }
        },
        // 编辑菜单
        edit_menu(data) {
            this.tempMenu = deep_copy(data);
            if (data.dataRef.edit == undefined){
                this.$set(data.dataRef, 'edit', 1);
            } else {
                data.dataRef.edit = 1;
            }
        },
        // 取消添加、编辑菜单或接口
        cancel_menu(data) {
            data.dataRef.edit = 0;
            data.dataRef.auth_name = this.tempMenu.auth_name;
            data.dataRef.path = this.tempMenu.path;
            data.dataRef.icon = this.tempMenu.icon;
        },
        // 排序
        handel_tree_drop(info){
            const _dropKey = info.node.eventKey;
            const _dragKey = info.dragNode.eventKey;
            const _dropPos = info.node.pos.split('-');
            const _dropPosition = info._dropPosition - Number(_dropPos[_dropPos.length - 1]);
            const loop = (data, key, callback) => {
                data.forEach((item, index, arr) => {
                    if (item.id === key) {
                        return callback(item, index, arr);
                    }
                    if (item.children) {
                        return loop(item.children, key, callback);
                    }
                });
            };

            const _data = [...this.tableData];
            let _dragObj;
            loop(_data, _dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                _dragObj = item;
            });
            if (!info.dropToGap) {
                loop(_data, _dropKey, item => {
                    item.children = item.children || [];
                    // 示例添加到尾部，可以是随意位置
                    item.children.push(_dragObj);
                });
            } else if ((info.node.child || []).length > 0 && info.node.expanded && _dropPosition === 1) {
                loop(_data, _dropKey, item => {
                    item.children = item.children || [];
                    // 示例添加到尾部，可以是随意位置
                    item.children.unshift(_dragObj);
                });
            } else {
                let ar;
                let i;
                loop(_data, _dropKey, (item, index, arr) => {
                    ar = arr;
                    i = index;
                });
                if (_dropPosition === -1) {
                    ar.splice(i, 0, _dragObj);
                } else {
                    ar.splice(i + 1, 0, _dragObj);
                }
            }
            this.tableData = _data;
            let _parentId;
            if (info.dropToGap){
                _parentId = info.node.dataRef.pid;
            } else {
                _parentId = info.node.eventKey;
            }
            if (_parentId == 0){
                this.sonIds = this.tableData.map(item => item.id);
            } else {
                this.get_node_by_id(_parentId, this.tableData);
            }
            api_manage_auth_sort({pid: _parentId, first_auth_id_str: this.sonIds.join(',')}).then(res => {
                if (res.code == 200){
                    this.$antdMessage.success('排序成功');
                } else {
                    this.init_data();
                }
            }).catch(err => {
                console.log(err);
                this.init_data();
            });
        },
        front_remove_menu(data, arr){
            arr.some((n, i) => {
                if (arr[i].id === data.id) {
                    arr.splice(i, 1);
                    return true;
                } else if (arr[i].children && arr[i].children.length > 0) {
                    this.front_remove_menu(data, arr[i].children);
                }
            });
        },
        // 递归修改源数据添加scopedSlots属性，开启自定义插槽
        update_tree_scope(arr){
            for (let i = 0; i < arr.length; i++) {
                this.$set(arr[i], 'scopedSlots', {title: 'title'});
                if (arr[i].children && arr[i].children.length > 0) {
                    this.update_tree_scope(arr[i].children);
                } else {
                    continue;
                }
            }
        },
        // 递归获取指定id节点下的所有一级子节点
        get_node_by_id(id, arr){
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id){
                    this.sonIds = arr[i].children.map(item => item.id);
                    break;
                } else if (arr[i].children && arr[i].children.length > 0){
                    this.get_node_by_id(id, arr[i].children);
                } else {
                    continue;
                }
            }
        },
        scroll_to_input(data){
            setTimeout(() => {
                const $input = this.$refs['input_' + data.id].$el;
                if ($input.offsetTop > (document.querySelectorAll('.js-layout-main')[0].scrollTop + document.documentElement.clientHeight - 100)){
                    document.querySelectorAll('.js-layout-main')[0].scrollTo(0, $input.offsetTop - 300);
                }
                this.$refs['input_' + data.id].focus();
            }, 50);
        }
    }
};
</script>

<style lang="scss">
$nameWidth: 360px;

.qm-menu-tree{
    border-bottom: 1px solid $border-color-base;
    border-right: 1px solid $border-color-base;
    border-left: 1px solid $border-color-base;
    width: 100%;
    @include hack(box-sizing, border-box);
    &-th,&-tb{
        @include flexbox();
        @include hack(box-sizing, border-box);
        span{
            display: block;
            line-height: 36px;
            height: 36px;
            @include hack(box-sizing, border-box);
            padding: 0 $space;
            border-left: 1px solid $border-color-base;
            overflow: hidden;
            &.s-name{
                width: $nameWidth;
                padding-left: 0;
                border-left: 0 none;
                em{
                    color: $important-color;
                }
            }
            &.s-url{
                @include flexboxChild();
                width: 300px;
            }
            &.s-select{
                width: 200px;
                .ant-select{
                    display: block;
                }
            }
            &.s-icon{
                width: 150px;
            }
            &.s-fun{
                width: 300px;
                text-align: center;
                a{
                    margin-left: $space;
                    line-height: 24px;
                    display: inline-block;
                    &:first-child{
                        margin-left: 0;
                    }
                }
                .ant-btn{
                    margin-left: $space;
                    display: inline-block;
                    text-align: center;
                    padding: 0 5px;
                    line-height: 28px;
                    height: 28px;
                    vertical-align: top;
                    &:first-child{
                        margin-left: 0;
                    }
                    span{
                        padding: 0;
                        border: 0 none;
                        line-height: 24px;
                    }
                }
            }
        }
    }
    &-th{
        padding-left: 24px;
        border-top: 1px solid $border-color-base;
        span{
            font-weight: bold;
            font-size: 16px;
        }
    }
    .ant-tree{
        .ant-tree-switcher{
            margin-top: 6px;
            position: absolute;
            top: 0;
            left: 0;
        }
        &.ant-tree-block-node{
            padding: 0;
            li{
                .ant-tree-node-content-wrapper{
                    width: 100%;
                    @include hack(box-sizing, border-box);
                    border: 0 none;
                    height: 100%;
                    padding-left: 24px;
                    padding-right: 0;
                }
                li{
                    .ant-tree-node-content-wrapper{
                        padding-left: 44px;
                    }
                    li{
                        .ant-tree-node-content-wrapper{
                            padding-left: 64px;
                        }
                        li{
                            .ant-tree-node-content-wrapper{
                                padding-left: 84px;
                            }
                            li{
                                .ant-tree-node-content-wrapper{
                                    padding-left: 104px;
                                }
                                li{
                                    .ant-tree-node-content-wrapper{
                                        padding-left: 124px;
                                    }
                                    li{
                                        .ant-tree-node-content-wrapper{
                                            padding-left: 144px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        li{
            border-top: 1px solid $border-color-base;
            line-height: 36px;
            padding: 0;
            position: relative;
            &:first-child,&:last-child{
                padding: 0;
            }
            .ant-tree-child-tree{
                padding-left: 0;
                & > li{
                    padding: 0;
                }
                .ant-tree-switcher{
                    margin-left: 20px;
                }
                .ant-tree-node-content-wrapper{
                    .qm-menu-tree-tb{
                        span{
                            &.s-name{
                                width: $nameWidth - 20px;
                            }
                        }
                    }
                }
                .ant-tree-child-tree{
                    .ant-tree-switcher{
                        margin-left: 40px;
                    }
                    .ant-tree-node-content-wrapper{
                        .qm-menu-tree-tb{
                            span{
                                &.s-name{
                                    width: $nameWidth - 40px;
                                }
                            }
                        }
                    }
                    .ant-tree-child-tree{
                        .ant-tree-switcher{
                            margin-left: 60px;
                        }
                        .ant-tree-node-content-wrapper{
                            .qm-menu-tree-tb{
                                span{
                                    &.s-name{
                                        width: $nameWidth - 60px;
                                    }
                                }
                            }
                        }
                        .ant-tree-child-tree{
                            .ant-tree-switcher{
                                margin-left: 80px;
                            }
                            .ant-tree-node-content-wrapper{
                                .qm-menu-tree-tb{
                                    span{
                                        &.s-name{
                                            width: $nameWidth - 80px;
                                        }
                                    }
                                }
                            }
                            .ant-tree-child-tree{
                                .ant-tree-switcher{
                                    margin-left: 100px;
                                }
                                .ant-tree-node-content-wrapper{
                                    .qm-menu-tree-tb{
                                        span{
                                            &.s-name{
                                                width: $nameWidth - 100px;
                                            }
                                        }
                                    }
                                }
                                .ant-tree-child-tree{
                                    .ant-tree-switcher{
                                        margin-left: 120px;
                                    }
                                    .ant-tree-node-content-wrapper{
                                        .qm-menu-tree-tb{
                                            span{
                                                &.s-name{
                                                    width: $nameWidth - 120px;
                                                }
                                            }
                                        }
                                    }.ant-tree-child-tree{
                                        .ant-tree-switcher{
                                            margin-left: 140px;
                                        }
                                        .ant-tree-node-content-wrapper{
                                            .qm-menu-tree-tb{
                                                span{
                                                    &.s-name{
                                                        width: $nameWidth - 140px;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
