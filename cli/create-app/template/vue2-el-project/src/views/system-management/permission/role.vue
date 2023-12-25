<template>
    <div>

        <div>
            <div class="row" v-if="this.pageType == '' || this.pageType == 'list'">
                <el-form :inline="true" :size="$store.state.elementUi.modelSize">
                    <el-form-item>
                        <el-button type="primary" @click="add_role">添加角色</el-button>
                    </el-form-item>
                </el-form>
                
                <el-table ref="ref-table-data" v-loading="$store.state.global.dataLoading" height="calc(100vh - 120px)" v-show="tableDataList.length > 0" stripe :data="tableDataList" border :size="$store.state.elementUi.tableSize">
                    <el-table-column :label="value" :prop="key" v-for="(value, key) in tableHeader" :key="key" :width="set_table_column_width(key)"></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="100">
                        <template slot-scope="scope">
                            <p class="p-btn-list">
                                <a href="javascript:void(0);" @click="edit_role(scope.row)">修改</a>
                                <a href="javascript:void(0);" @click="delete_role(scope.row, scope.$index)">删除</a>
                            </p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <div class="row" v-else-if="this.pageType == 'add' || this.pageType == 'edit'">
                <h1 v-if="addEditRoleType == 'add'">添加角色</h1>
                <h1 v-else-if="addEditRoleType == 'edit'">修改</h1>
                <el-form ref="ref-form-data" :rules="roleRules" :model="roleSelectedData" label-width="120px" size="small">
                    <el-form-item label="角色名称：" prop="name">
                        <el-input v-model="roleSelectedData.role_name"></el-input>
                    </el-form-item>
                </el-form>
                <el-form ref="ref-form-data" :rules="roleRules" :inline="true" :model="roleSelectedData" label-width="120px" size="small">
                    <el-form-item label="选择权限：">
                        <div class="tree-limit-height">
                            <el-tree :data="roleTreeData" :default-expand-all="true" ref="ref-tree-data" :default-checked-keys="roleTreeCheckedData" show-checkbox node-key="id" :props="defaultRoleTreeProps" @check="tree_check">
                                <div slot-scope="{ node, data }">
                                    <span :title="data.auth_name">{{ data.auth_name }} <em style="color: red" v-if="data.path_type == '2'">(接口)</em></span>
                                </div>
                            </el-tree>
                        </div>
                    </el-form-item>
                    <el-form-item label="初始页面：" prop="init_menu">
                        <div class="tree-limit-height">
                            <el-tree :data="roleTreeStartData" :default-expand-all="true" :default-checked-keys="roleTreeStartCheckedData" show-checkbox node-key="id"  :props="defaultRoleTreeStartProps" ref="ref-start-tree-data"  @check="start_tree_check"></el-tree>
                        </div>
                    </el-form-item>
                </el-form>
                <el-form ref="ref-form-data" :rules="roleRules" :model="roleSelectedData" label-width="120px" size="small">
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="roleSelectedData.remark" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save_role" >保存</el-button>
                        <el-button @click="cancel_role" >取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
        <qm-confirm-pop :title="confirmPop.title" :visible.sync="confirmPop.visible" :data="confirmPop.data" @submit="delete_role_submit"></qm-confirm-pop>

    </div>
</template>
<script>
    import { Tree } from 'element-ui';
    import { deep_copy } from '@/assets/js/tools';
    import { api_manage_auth_data } from '@/http/system-management/permission/menu-config';
    import { api_manage_role_data, api_manage_role_list, api_manage_role_create, api_manage_role_delete, api_manage_role_update } from '@/http/system-management/permission/role';
    import qmConfirmPop from '@/component/qm-confirm-pop';

    export default {
        props: {},
        data() {
            return {
                tableDataList: [],
                tableHeader: {
                    role_name: '角色名称',
                    init_auth_name: '初始页面',
                    remark: '备注'
                },
                confirmPop: {
                    visible: false,
                    title: '',
                    data: {},
                    index: '',
                },
                addEditRoleType: 'add',      //  类型 add添加  edit修改
                roleSelectedData: {         //  选中角色
                    role_name: '', // 角色名称
                    init_auth_id: [], // 初始页id
                    remark: '', // 备注
                    id: '',
                    auth_id_arr: [], // 选中的权限
                    show_auth_id_arr: [] // 显示的选中权限
                },
                defaultRoleData: {          //  默认角色数据
                    role_name: '', // 角色名称
                    init_auth_id: [], // 初始页id
                    remark: '', // 备注
                    id: '',
                    auth_id_arr: [], // 选中的权限
                    show_auth_id_arr: [] // 显示的选中权限
                },
                roleRules: {
                    role_name: [
                        { required: true, message: '角色名称必填', trigger: 'change' }
                    ],
                    init_auth_id: [
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                },
                roleTreeData: [], // 权限树数据
                roleTreeStartData: [], // 初始页面树数据
                roleTreeCheckedData: [], // 权限树选中数据
                roleTreeStartCheckedData: [], // 初始页面树选中数据
                defaultRoleTreeProps: {
                    children: 'children',
                    label: 'auth_name',
                },
                defaultRoleTreeStartProps: {
                    children: 'children',
                    label: 'auth_name',
                    disabled: (data,node) => {
                        setTimeout( () => {
                            if(data.path_type == '2'){
                                this.$refs['ref-start-tree-data'].remove(data);
                            }
                        }, 100)
                    }
                }, 
                pageType: 'list',            //  网页类型list列表 edit或add编辑或者修改
            }
        },
        mounted() {
            this.init_data();
            this.get_auth_data();
        },
        computed: {
            
        },
        watch: {
            
        },
        components: {
            qmConfirmPop,
            'el-tree': Tree
        },
        methods: {
            set_table_column_width(key){
                if(key == 'remark'){
                    return '';
                }else if( key == 'init_auth_name'){
                    return '250';
                }else if(key == 'role_name'){
                    return '150';
                }else{
                    return '100';
                }
            },
            get_auth_data(){ // 所有权限数据
                api_manage_auth_data().then( res => {
                    if(res.code == 200){
                        this.roleTreeData  = res.data.auth_list;
                        this.roleTreeStartData = deep_copy(res.data.auth_list);
                    }
                })
            },
            init_data(){
                this.$store.commit('SET_DATA_LOADING_STATUS', true);
                api_manage_role_list().then( res => {
                    if(res.code == 200){
                        this.tableDataList = res.data.table_list;
                        this.$nextTick( () => {
                            this.$refs['ref-table-data'].resizeState.width = this.$refs['ref-table-data'].resizeState.width + 1;
                            this.$refs['ref-table-data'].resizeListener();
                        })
                    }
                    this.$store.commit('SET_DATA_LOADING_STATUS', false);
                })
            },
            add_role(){ // 添加角色
                this.roleTreeCheckedData = [];
                this.roleSelectedData = deep_copy(this.defaultRoleData);
                this.pageType = 'add';
            },
            edit_role(data){ //  编辑角色
                api_manage_role_data({
                    id: data.id,
                }).then( res => {
                    if(res.code == 200){
                        this.roleTreeStartCheckedData = [res.data.init_auth_id];
                        this.roleTreeCheckedData = res.data.show_auth_id_arr;
                        this.roleSelectedData = res.data;
                        this.pageType = 'edit';
                    }
                })
            },
            save_role(){ // 保存角色
                if(this.roleSelectedData.init_auth_id == ''){
                    this.$elMessage.error('初始页面不能为空');
                    return false;
                }
                if(this.roleSelectedData.role_name.trim() == ''){
                    this.$elMessage.error('角色名称不能为空');
                    return false;
                }

                let _formData = deep_copy(this.roleSelectedData);
                _formData.auth_id_arr = [];
                this.$refs['ref-tree-data'].getCheckedNodes(false,true).forEach( (n,i) => {
                    _formData.auth_id_arr.push(n.id);
                })
                _formData.auth_id_str = _formData.auth_id_arr.join(',');
                _formData.show_auth_id_str = this.$refs['ref-tree-data'].getCheckedKeys(true).join(',');
                delete _formData.show_auth_id_arr;
                delete _formData.auth_id_arr;
                if(this.roleSelectedData.id && this.roleSelectedData.id != ''){
                    api_manage_role_update(_formData).then( res => {
                        if(res.code == 200){
                            this.$elMessage.success('角色修改成功');
                            this.init_data();
                        }
                        this.pageType = 'list';
                    }).catch( err => {
                        this.pageType = 'list';
                    })
                }else{
                    api_manage_role_create(_formData).then( res => {
                        if(res.code == 200){
                            this.$elMessage.success('角色添加成功');
                            this.roleSelectedData.id = res.data.id;
                            this.init_data();
                        }
                        this.pageType = 'list';
                    }).catch( err => {
                        this.pageType = 'list';
                    })
                }
            },
            delete_role(data,index){
                this.confirmPop.title = '确认删除<em class="important">' + data.role_name + '</em>角色';
                this.confirmPop.data = data;
                this.confirmPop.index = index;
                this.confirmPop.visible = true;
            },
            delete_role_submit(){
                api_manage_role_delete({
                    id: this.confirmPop.data.id,
                }).then( res => {
                    if(res.code == 200){
                        this.tableDataList.splice(this.confirmPop.index,1);
                        this.$elMessage.success('角色删除成功');
                    }
                    this.confirmPop.visible = false;
                }).catch( err => {
                    this.confirmPop.visible = false;
                })
            },
            cancel_role(){
                this.pageType = 'list';
            },
            tree_check(data,status){
                let _checkArr = '';
                this.$refs['ref-start-tree-data'].setCheckedNodes([]);
                _checkArr = deep_copy(this.$refs['ref-tree-data'].getCheckedNodes(false,true));
                _checkArr.forEach( (n,i) => {
                    this.roleSelectedData.show_auth_id_arr.push(n.id);
                })
            },
            start_tree_check(data,status){
                if(data.children && data.children.length > 0){
                    this.$elMessage.error('不能选择父级为初始页');
                    this.$refs['ref-start-tree-data'].setCheckedNodes([]);
                }else{
                    let _arr = [];
                    this.$refs['ref-tree-data'].getCheckedNodes(false,true).forEach( (n,i) => {
                        _arr.push(n.id);
                    })
                    if(_arr.includes(data.id)){
                        this.roleSelectedData.init_auth_id = data.id;
                        this.$refs['ref-start-tree-data'].setCheckedNodes([data]);
                    }else{
                        this.$elMessage.error('权限不足，不能设置为初始页');
                        this.$refs['ref-start-tree-data'].setCheckedNodes([]);
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    h1{
        line-height: 50px;
        font-size: 24px;
        display: block;
        text-align: center;
        padding-bottom: 10px;
    }

    .tree-limit-height{
        max-height: calc(100vh - 270px);
        overflow: hidden;
        overflow-y: scroll;
        min-width: 360px;
    }

    .el-form--inline{
        .el-form-item{
            padding-right: 30px;
            width: 45%;
            box-sizing: border-box;
            &:last-child{
                padding-right: 0;
            }
        }
    }

</style>