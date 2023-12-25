<template>
    <div class="row">
        <template v-if="this.pageType == '' || this.pageType == 'list'">
            <div class="qm-form">
                <a-form-model layout="inline" :size="$store.state.antd.modelSize">
                    <a-form-model-item>
                        <a-button type="primary" @click="role_add">添加</a-button>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <a-table :pagination="false" ref="ref-table-data" :size="$store.state.antd.tableSize" rowKey="id" :scroll="{y: 'calc(100vh - 160px)', x: '1000px'}" :columns="columns" bordered class="even-bg" :dataSource="tableData" >
                <template slot-scope="text, record, index" slot="action">
                    <p class="p-btn-list">
                        <a href="javascript:void(0);" @click="role_edit(record)">修改</a>
                        <a-popconfirm :title="'确认删除 ' + record.role_name + ' 角色'" @confirm="role_del(record, index)" okText="确认" cancelText="取消">
                            <a href="javascript:void(0);">删除</a>
                        </a-popconfirm>
                    </p>
                </template>
            </a-table>
        </template>
        <template v-else-if="this.pageType == 'add' || this.pageType == 'edit'">
            <h1 class="title">添加角色</h1>
            <a-form-model :model="roleFormData" class="qm-form t-120">
                <a-form-model-item label="角色名称">
                    <a-input v-model="roleFormData.role_name"></a-input>
                </a-form-model-item>
                <a-row class="mb">
                    <a-col :span="12">
                        <a-form-model-item label="选择权限">
                            <a-tree v-if="authTreeData.length > 0" class="role-tree" v-model="roleFormData.show_auth_id_arr" :replaceFields="replaceFields" checkable :defaultExpandAll="true"  :tree-data="authTreeData" @check="handle_auth_tree_check">
                                <template slot="title" slot-scope="data">{{data.auth_name}}<span class="red" v-if="data.path_type == '2'">（接口）</span></template>
                            </a-tree>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="初始页面">
                           <a-tree v-if="pageTreeData.length > 0" class="role-tree" v-model="roleFormData.init_auth_id" :replaceFields="replaceFields" checkable :checkStrictly = "true" :defaultExpandAll="true" :tree-data="pageTreeData" @check="handle_page_tree_check"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-form-model-item label="备注">
                    <a-textarea :rows="4" v-model="roleFormData.remark" />
                </a-form-model-item>
                <a-form-model-item class="ant-form-item-btn">
                    <a-button type="primary" @click="role_save">保存</a-button>
                    <a-button @click="role_cancel">取消</a-button>
                </a-form-model-item>
            </a-form-model>
        </template>
    </div>
</template>

<script>

import { api_manage_auth_data } from '@/http/system-management/permission/menu-config';
import { api_manage_role_list, api_manage_role_data, api_manage_role_create, api_manage_role_delete, api_manage_role_update } from '@/http/system-management/permission/role';
import { deep_copy } from '@/assets/js/tools';

export default {
    name: 'Role',
    data() {
        return {
            columns: [
                {
                    title: '角色名称',
                    width: 160,
                    dataIndex: 'role_name',
                    scopedSlots: { customRender: 'role_name' }
                },
                {
                    title: '初始页面',
                    width: 200,
                    dataIndex: 'init_auth_name',
                    scopedSlots: { customRender: 'init_auth_name' }
                },
                {
                    title: '备注',
                    // width: 160,
                    dataIndex: 'remark',
                    scopedSlots: { customRender: 'remark' }
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    fixed: 'right',
                    width: 120,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            replaceFields: { children: 'children', key: 'id', title: 'auth_name' },
            pageType: 'list', //  网页类型list列表 edit或add编辑或者修改
            tableData: [],
            roleFormData: {
                role_name: '', // 角色名称
                init_auth_id: [], // 初始页id
                remark: '', // 备注
                id: '',
                auth_id_arr: [], // 选中的权限
                show_auth_id_arr: [] // 显示的选中权限
            },
            authTreeData: [], // 权限树结构
            pageTreeData: [], // 页面树结构
            pagePidArr: [], // 页面数据pid数据

            leafIdArr: []
        };
    },
    components: {
    },
    computed: {},
    mounted() {
        this.$store.commit('SET_PAGE_LOADING_STATUS', true);
        this.init_data();
        this.get_tree_data();
    },
    watch: {
    },
    methods: {
        async init_data(){
            const _res = await api_manage_role_list();
            if (_res.code == 200){
                this.tableData = _res.data.table_list;
            }
        },
        role_add(){ //   添加角色
            this.pageType = 'add';
        },
        async role_edit(data) { // 编辑角色
            this.pageType = 'edit';
            const _res = await api_manage_role_data({id: data.id});
            if (_res.code == 200){
                this.roleFormData.id = _res.data.id;
                this.roleFormData.auth_id_arr = _res.data.auth_id_arr; // 选中的权限
                this.roleFormData.init_auth_id = [_res.data.init_auth_id]; // 选中的页面
                this.roleFormData.role_name = _res.data.role_name;
                this.roleFormData.remark = _res.data.remark;
                this.roleFormData.show_auth_id_arr = _res.data.show_auth_id_arr;
                this.pagePidArr.forEach((n, i) => { // 过滤父id（显示id数据用）
                    if (this.roleFormData.show_auth_id_arr.indexOf(n) > -1){
                        this.roleFormData.show_auth_id_arr.splice(this.roleFormData.show_auth_id_arr.indexOf(n), 1);
                    }
                });
            }
        },
        // 获取树结构
        async get_tree_data(){
            const _treeData = await api_manage_auth_data();
            this.update_tree_scope(_treeData.data.auth_list); // 权限树结构添加 scope-slot 属性
            this.authTreeData = deep_copy(_treeData.data.auth_list); // 权限树结构
            this.pageTreeData = deep_copy(_treeData.data.auth_list); // 页面树结构
            this.filter_tree_remove_api(this.pageTreeData); // 页面树结构过滤接口节点
            this.get_pid_arr(this.pageTreeData);
        },
        // 删除
        role_del(data, index) {
            api_manage_role_delete({id: data.id}).then(res => {
                if (res.code == 200){
                    this.tableData.splice(index, 1);
                    this.$antdMessage.success('角色删除成功');
                }
            });
        },
        // 保存
        role_save(){
            const _formData = deep_copy(this.roleFormData);
            if (_formData.role_name == ''){
                this.$antdMessage.error('角色名称不能为空');
                return false;
            }
            if (_formData.auth_id_arr.length == 0){
                this.$antdMessage.error('请选择权限');
                return false;
            }
            if (_formData.init_auth_id.length == 0){
                this.$antdMessage.error('请选择初始页面');
                return false;
            }
            this.pagePidArr.forEach((n, i) => { // 过滤父id（显示id数据用）
                if (_formData.show_auth_id_arr.indexOf(n) > -1){
                    _formData.show_auth_id_arr.splice(_formData.show_auth_id_arr.indexOf(n), 1);
                }
            });
            _formData.show_auth_id_str = _formData.show_auth_id_arr.join(',');
            _formData.auth_id_str = _formData.auth_id_arr.join(',');
            _formData.init_auth_id = _formData.init_auth_id.join(',');
            delete _formData.show_auth_id_arr;
            delete _formData.auth_id_arr;
            if (this.pageType == 'add'){
                delete _formData.id;
                api_manage_role_create(_formData).then(res => {
                    if (res.code == 200){
                        this.$antdMessage.success('保存成功');
                        this.init_data();
                        this.role_cancel();
                    }
                });
            } else if (this.pageType == 'edit') {
                api_manage_role_update(_formData).then(res => {
                    if (res.code == 200){
                        this.$antdMessage.success('修改成功');
                        this.init_data();
                        this.role_cancel();
                    }
                });
            }
        },
        // 取消
        role_cancel(){
            this.handle_clear_form();
            this.pageType = 'list';
        },
        // 权限 check回调
        handle_auth_tree_check(checkedKeys, data) {
            const _show_auth_id_arr = deep_copy(checkedKeys);
            this.roleFormData.show_auth_id_arr = _show_auth_id_arr;
            // // 获取所有选中节点
            this.roleFormData.auth_id_arr = [...checkedKeys, ...data.halfCheckedKeys];

            if (!this.roleFormData.auth_id_arr.includes(this.roleFormData.init_auth_id[0])){
                this.roleFormData.init_auth_id = [];
            }
        },
        // 页面 check回调
        handle_page_tree_check(checkedKeys, data){
            if (this.roleFormData.auth_id_arr.includes(data.node.eventKey)) {
                this.roleFormData.init_auth_id = [data.node.eventKey];
            } else {
                this.$antdMessage.error('该页面没有访问权限');
                this.roleFormData.init_auth_id = [];
            }
        },
        // 递归 获取页面的pid数据
        get_pid_arr(data){
            data.forEach(item => {
                if (item.children && item.children.length > 0){
                    this.pagePidArr.push(item.id);
                    this.get_pid_arr(item.children);
                } else {
                    return;
                }
            });
        },
        // 递归 去掉接口
        filter_tree_remove_api(arr){
            const _arr = arr;
            _arr.forEach(item => {
                if (!item.children) return;
                const res = item.children.filter(n => n.path_type == 1);
                item.children = this.filter_tree_remove_api(res);
            });
            return _arr;
        },
        // 递归 获取子节点 （点击编辑默认选中权限，服务端返回的权限）
        filter_tree_return_leaf(arr, idArr){
            for (let i = 0; i < idArr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (idArr[i] == arr[j].id){
                        if (!arr[j].children && !this.leafIdArr.includes(idArr[i])){
                            this.leafIdArr.push(idArr[i]);
                        }
                        break;
                    } else if (arr[j].children && arr[j].children.length > 0){
                        this.filter_tree_return_leaf(arr[j].children, idArr);
                    } else {
                        continue;
                    }
                }
            }
        },
        // 清除表单值
        handle_clear_form(){
            this.roleFormData = {
                role_name: '', // 角色名称
                init_auth_id: [], // 初始页id
                remark: '', // 备注
                id: '',
                auth_id_arr: [], // 选中的权限
                show_auth_id_arr: [] // 显示的选中权限
            };
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
        }
    }
};
</script>

<style lang="scss" scoped>
    .title {
        font-size: 24px;
        line-height: 40px;
        font-weight: bold;
        text-align: center;
    }
    .role-tree {
        height: calc(100vh - 330px);
        overflow-y: auto;
        margin-bottom: $space;
    }
</style>
