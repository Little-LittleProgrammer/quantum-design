<template>
    <div>
        <div>
            <div class="row">
                <el-form :inline="true" :size="$store.state.elementUi.modelSize">
                    <el-form-item>
                        <el-button type="primary" @click="add_first_level_menu">添加一级菜单</el-button>
                    </el-form-item>
                </el-form>

                <div class="qm-premission-tree-table">
                    <div class="qm-premission-tree-table-th">
                        <span class="s-name">菜单名称</span>
                        <span class="s-url">页面地址</span>
                        <span class="s-des">备注</span>
                        <span class="s-fun">操作</span>
                    </div>
                </div>

                <el-tree
:data="tableDataList"
ref="ref-tree-data"
v-loading="$store.state.global.dataLoading"
:props="defaultProps"
node-key="id"
:default-expanded-keys="expandedKeys"
:default-expand-all="true"
:expand-on-click-node="false"
class="qm-premission-tree-table"
draggable
@node-drop="handle_drop"
:allow-drop="allow_drop"
:allow-drag="allow_drag"
:size="$store.state.elementUi.modelSize">
                    <div class="qm-premission-tree-table-tb" slot-scope="{ node, data }">
                        <template v-if="data.edit && data.edit == 1">
                            <span class="s-name"><el-input v-model="data.auth_name" :ref="'ref-input-' + data.id" size="mini" placeholder="请输入菜单名称"></el-input></span>
                            <span class="s-url"><el-input v-model="data.path" size="mini" placeholder="请输入页面地址"></el-input></span>
                            <span class="s-des"></span>
                        </template>
                        <template v-else>
                            <span class="s-name" :title="data.auth_name">{{ data.auth_name }} <em v-if="data.path_type == '2'">(接口)</em></span>
                            <span class="s-url" :title="data.path">{{ data.path }}</span>
                            <span class="s-des"></span>
                        </template>

                        <span class="s-fun">
                            <template v-if="data.edit && data.edit == 1">
                                <el-button type="text" size="mini" @click="() => save_menu(node, data)">保存</el-button>
                                <template v-if="data.id.includes('default-')">
                                    <el-button type="text" size="mini" @click="() => delete_menu(node, data)">删除</el-button>
                                </template>
                                <template v-else>
                                    <el-button type="text" size="mini" @click="() => cancel_menu(node, data)">取消</el-button>
                                </template>
                            </template>
                            <template v-else>
                                <template v-if="data.path_type == '1'">
                                    <el-button type="text" size="mini" @click="() => add_submenu(node, data)">添加子菜单</el-button>
                                    <el-button type="text" size="mini" @click="() => add_interface(node, data)">添加接口</el-button>
                                </template>
                                <el-button type="text" size="mini" @click="() => edit_menu(node, data)">修改</el-button>
                                <el-button type="text" size="mini" @click="() => delete_menu(node, data)">删除</el-button>
                            </template>
                        </span>
                    </div>
                </el-tree>

            </div>
        </div>

        <div>
            <!-- 确认删除弹窗 -->
            <el-dialog :visible.sync="deleteConfirmPop.visible" center class="qm-confirm-pop w500" :modal-append-to-body="false" :show-close="false" top="0">
                <i class="el-icon-close close-pop-btn" @click="deleteConfirmPop.visible = false"></i>
                <span class="s-tit">确认删除{{deleteConfirmPop.data.auth_name}}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="delete_submit">确认</el-button>
                    <el-button type="primary" @click="deleteConfirmPop.visible = false;">取消</el-button>
                </span>
            </el-dialog>
            <!-- 确认删除弹窗 -->
        </div>
    </div>
</template>
<script>
import { Tree } from 'element-ui';
import { deep_copy } from '@/assets/js/tools';
import { api_manage_auth_list, api_manage_auth_create, api_manage_auth_delete, api_manage_auth_update, api_manage_auth_sort } from '@/http/system-management/permission/menu-config';

export default {
    meta: {
        title: '菜单配置'
    },
    props: {},
    data() {
        return {
            tableDataList: [],
            defaultData: {
                auth_name: '', // 名称
                path: '', // 路径
                path_type: '1', //  菜单就是1  功能接口2
                pid: '0', //  上级菜单id，默认顶级为0
                icon: '', // 图标
                children: [], // 子菜单
                edit: 1,
                id: ''
            },
            defaultProps: {
                children: 'children',
                label: 'auth_name'
            },
            deleteConfirmPop: { //  删除确认弹窗
                visible: false,
                data: '',
                node: ''
            },
            formData: {
                project: []
            },
            tempMenu: {},
            expandedKeys: []
        };
    },
    mounted() {
        this.init_data();
    },
    computed: {

    },
    components: {
        'el-tree': Tree
    },
    methods: {
        init_data(){
            this.$store.commit('SET_DATA_LOADING_STATUS', true);
            api_manage_auth_list().then(res => {
                if (res.code == 200){
                    this.tableDataList = res.data.table_list;
                }
                this.$store.commit('SET_DATA_LOADING_STATUS', false);
            });
        },
        add_first_level_menu(){ //  添加一级菜单
            const _data = deep_copy(this.defaultData);
            _data.id = 'default-' + Date.now();
            this.tableDataList.push(_data);
            this.scroll_to_input(_data);
        },
        add_submenu(node, data){ //  添加子集菜单
            const _data = deep_copy(this.defaultData);
            _data.id = 'default-' + Date.now();
            _data.pid = data.id;
            if (!data.children){
                this.$set(data, 'children', [_data]);
            } else {
                data.children.push(_data);
            }
            this.scroll_to_input(_data);
            this.expandedKeys[0] = _data.id;
        },
        add_interface(node, data){
            const _data = deep_copy(this.defaultData);
            _data.id = 'default-' + Date.now();
            _data.pid = data.id;
            _data.path_type = '2';
            if (!data.children){
                this.$set(data, 'children', [_data]);
            } else {
                data.children.push(_data);
            }
            this.scroll_to_input(_data);
            this.expandedKeys[0] = _data.id;
        },
        edit_menu(node, data){ //  编辑菜单
            this.tempMenu = deep_copy(data);
            this.$set(data, 'edit', 1);
        },
        cancel_menu(node, data){ //  取消编辑菜单
            data.edit = 0;
            data.auth_name = this.tempMenu.auth_name;
            data.path = this.tempMenu.path;
        },
        delete_menu(node, data){ //  删除菜单
            this.deleteConfirmPop.data = data;
            this.deleteConfirmPop.node = node;
            this.deleteConfirmPop.visible = true;
        },
        delete_submit(){ //  确认删除菜单
            if (this.deleteConfirmPop.data.id.includes('default-')){
                this.$refs['ref-tree-data'].remove(this.deleteConfirmPop.node);
                if (this.deleteConfirmPop.data.path_type == '2'){
                    this.$message.success('接口删除成功');
                } else {
                    this.$message.success('菜单删除成功');
                }
                this.deleteConfirmPop.visible = false;
            } else {
                api_manage_auth_delete({ 'id': this.deleteConfirmPop.data.id}).then(res => {
                    if (res.code == 200){
                        if (this.deleteConfirmPop.data.path_type == '2'){
                            this.$message.success('接口删除成功');
                        } else {
                            this.$message.success('菜单删除成功');
                        }
                        this.$refs['ref-tree-data'].remove(this.deleteConfirmPop.node);
                    }
                    this.deleteConfirmPop.visible = false;
                }).catch(err => {
                    console.log(err);
                    this.deleteConfirmPop.visible = false;
                });
            }
        },
        save_menu(node, data){ //  保存菜单
            if (data.auth_name.trim() == ''){
                this.$message.error('标题不能为空');
                return false;
            }
            if (data.path.trim() == ''){
                this.$message.error('url地址不能为空');
                return false;
            }

            data.edit = 0;
            const _data = deep_copy(data);
            delete _data.edit;
            if (data.id.includes('default-')){
                delete _data.id;
                api_manage_auth_create(_data).then(res => {
                    if (res.code == 200){
                        data.id = res.data.id;
                        if (_data.path_type == '2'){
                            this.$message.success('接口新增成功');
                        } else {
                            this.$message.success('菜单新增成功');
                        }
                    } else {
                        this.$refs['ref-tree-data'].remove(data);
                    }
                });
            } else {
                api_manage_auth_update(_data).then(res => {
                    if (res.code == 200){
                        if (_data.path_type == '2'){
                            this.$message.success('接口修改成功');
                        } else {
                            this.$message.success('菜单修改成功');
                        }
                    } else {
                        this.$refs['ref-tree-data'].remove(data);
                    }
                });
            }
        },
        scroll_to_input(data){
            setTimeout(() => {
                const $input = this.$refs['ref-input-' + data.id].$el;
                if ($input.offsetTop > (document.querySelectorAll('.js-layout-main')[0].scrollTop + document.documentElement.clientHeight - 100)){
                    document.querySelectorAll('.js-layout-main')[0].scrollTo(0, $input.offsetTop - 300);
                }
                this.$refs['ref-input-' + data.id].focus();
            }, 50);
        },

        handle_drop(draggingNode, dropNode, dropType, ev) {
            let _ids = []; let _pid = '';
            if (dropType == 'inner'){
                _pid = dropNode.data.id;
                dropNode.data.children.forEach((n, i) => {
                    _ids.push(n.id);
                });
            } else {
                if (dropNode.parent.data.id){
                    _pid = dropNode.parent.data.id;
                    dropNode.parent.data.children.forEach((n, i) => {
                        _ids.push(n.id);
                    });
                } else {
                    _pid = 0;
                    dropNode.parent.data.forEach((n, i) => {
                        _ids.push(n.id);
                    });
                }
            }
            if (_ids.length > 0){
                _ids = _ids.join(',');
            } else {
                _ids = '';
            }
            api_manage_auth_sort({
                first_auth_id_str: _ids,
                pid: _pid
            }).then(res => {
                if (res.code == 200){
                    this.$message.success('顺序调整成功');
                }
            });
        },
        allow_drag(node){
            if (node.data.edit && node.data.edit == 1){
                return false;
            } else {
                return true;
            }
        },
        allow_drop(draggingNode, dropNode, type){
            // console.log(draggingNode);
            // console.log(dropNode);
            // if(draggingNode.data.edit == 1){
            //     return false;
            // }
            if (draggingNode.data.edit && draggingNode.data.edit == 1){
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>
<style lang="scss">
.qm-premission-tree-table{
    // background:linear-gradient(#ffffff 50%, #FAFAFA 50%);
    // background-size: 100% 78px;
    border-top: 1px solid #EBEEF5;
    &-tb,&-th{
        display: flex;
        width: 100%;
        span{
            line-height: 24px;
            white-space: normal;
            display: flex;
            align-items: center;
            &.s-name{
                width: 180px;
                font-size: 12px;
                em{
                    color: red;
                }
            }
            &.s-url{
                flex: 1;
                width: 100%;
                font-size: 12px;
                word-break: break-all;
            }
            &.s-des{
                width: 200px;
                font-size: 12px;
            }
            &.s-fun{
                width: 280px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                .el-button{
                    padding: 3px 5px;
                    line-height: 24px;
                    display: inline-block;
                }
            }
        }
    }
    &-th{
        background: #f0f0f0;
        span{
            font-weight: bold;
            line-height: 36px;
            font-size: 14px;
            &.s-name{
                font-size: 14px;
                width: 266px;
                padding-left: 10px;
                border-left: 1px solid #EBEEF5;
                border-right: 1px solid #EBEEF5;
            }
            &.s-url{
                padding-left: 10px;
                font-size: 14px;
            }
            &.s-des{
                font-size: 14px;
                border-left: 1px solid #EBEEF5;
                border-right: 1px solid #EBEEF5;
                padding: 0 10px;
            }
            &.s-fun{
                font-size: 14px;
                border-right: 1px solid #EBEEF5;
            }
        }
    }
    .el-tree-node__content{
        border-right: 1px solid #EBEEF5;
        border-left: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
        line-height: 20px;
        height: auto;
        // padding: 10px 0;
    }
    .el-tree-node{
        .s-url{
            margin-left: 72px;
            border-left: 1px solid #EBEEF5;
            border-right: 1px solid #EBEEF5;
            padding: 0 10px;
        }
        .s-des{
            border-right: 1px solid #EBEEF5;
            padding: 0 10px;
        }
        .el-tree-node{
            .s-url{
                margin-left: 54px;
            }
            .el-tree-node{
                .s-url{
                    margin-left: 36px;
                }
                .el-tree-node{
                    .s-url{
                        margin-left: 18px;
                    }
                    .el-tree-node{
                        .s-url{
                            margin-left: 0;
                        }
                    }
                }
            }
        }
    }

}
</style>

