<template>
    <div class="row">
        <div class="qm-form auto">
            <el-form :inline="true" :size="$store.state.elementUi.modelSize">
                <el-form-item label="角色">
                    <el-select v-model="filterData.role" class="w-200" placeholder="角色">
                        <el-option value="" >全部</el-option>
                        <el-option v-for="option in roleOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="show_add_edit_pop('add')">添加</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table ref="ref-table-data" v-loading="$store.state.global.dataLoading" height="calc(100vh - 122px)" stripe :data="tableFilterData" border :size="$store.state.elementUi.tableSize">
            <el-table-column :label="value" :prop="key" v-for="(value, key) in tableHeader" :key="key" :width="set_table_column_width(key)">
                <template slot-scope="scope">
                    <template v-if="key == 'role_name_str'" >
                        <el-tag v-for="item in scope.row[key].split(',')" type="info" :size="$store.state.elementUi.modelSize" :key="item">{{ item }}</el-tag>
                    </template>
                    <template v-else>
                        {{ scope.row[key] }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="120">
                <template slot-scope="scope">
                    <p class="p-btn-list">
                        <a href="javascript:void(0);" @click="show_add_edit_pop('edit', scope.row)">编辑</a>
                        <a href="javascript:void(0);" @click="show_delete_user_pop(scope.row, scope.$index)">删除</a>
                    </p>
                </template>
            </el-table-column>
        </el-table>

        <qm-confirm-pop :title="confirmPop.title" :visible.sync="confirmPop.visible" :data="confirmPop.data" @submit="delete_user_submit"></qm-confirm-pop>

        <qm-form-pop :visible.sync="addEditUserDataPop.visible" :title="addEditUserDataPop.title"  @submit="add_update_user_submit">
            <div slot="slot-form-data">
                <el-form ref="ref-form" :model="formData" label-width="80px" :size="$store.state.elementUi.modelSize">
                    <el-form-item label="人员姓名">
                        <el-input v-model="formData.username" placeholder="人员姓名"/>
                    </el-form-item>
                    <el-form-item label="企业邮箱">
                        <el-input v-model="formData.email" type="text" name="email" placeholder="zhansan@km.com"/>
                    </el-form-item>
                    <el-form-item label="角色设置">
                        <el-select v-model="formData.role_id_arr" class="w-auto" :multiple="true" placeholder="请选择">
                            <el-option :value="option.value" v-for="option in roleOptions" :label="option.label" :key="option.value" ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </qm-form-pop>

    </div>
</template>

<script>
import { Tag } from 'element-ui';
import { API_MANAGE_ROLE_OPTIONS, API_MANAGE_USER_LIST } from '@/constant/api';
import { api_manage_user_create, api_manage_user_delete, api_manage_user_update } from '@/http/system-management/permission/person';
import qmConfirmPop from '@/components/qm-confirm-pop';
import qmFormPop from '@/components/qm-form-pop';

export default {
    meta: {
        title: '人员管理'
    },
    name: 'User',
    async asyncData({ $axios }){
        const [_authData, _roleOptions] = await Promise.all([$axios.$get(API_MANAGE_USER_LIST), $axios.$get(API_MANAGE_ROLE_OPTIONS)]);
        return {
            tableData: _authData.code == 200 ? _authData.data.table_list.reverse() : [],
            roleOptions: _roleOptions.code == 200 ? _roleOptions.data.role_data : []
        };
    },
    data() {
        return {
            tableData: [],
            tableHeader: {
                username: '人员姓名',
                email: '企业邮箱',
                role_name_str: '所属角色',
                latest_login_ip: '最后登录ip',
                latest_login_time: '最后登录时间'
            },
            addEditUserDataPop: {
                visible: false,
                type: '', // add添加人员 edit编辑人员
                title: ''
            },
            roleOptions: [], // 角色下拉数据
            formData: {
                username: '', // 人员姓名
                email: '', // 企业邮箱
                role_id_arr: [], //  角色id
                id: ''
            },
            filterData: { // 筛选
                role: ''
            },
            confirmPop: { // 删除确认弹窗
                visible: false,
                title: '',
                data: {},
                index: ''
            }
        };
    },
    components: {
        qmConfirmPop,
        qmFormPop,
        'el-tag': Tag
    },
    computed: {
        tableFilterData(){
            return this.filterData.role != '' ? this.tableData.filter(item => item.role_id_arr.includes(this.filterData.role)) : this.tableData;
        }
    },
    mounted() {},
    methods: {
        set_table_column_width(key){
            if (key == 'role_name_str'){
                return '';
            } else if (key == 'email'){
                return '220';
            } else if (key == 'latest_login_time'){
                return '160';
            } else if (key == 'latest_login_ip'){
                return '130';
            } else if (key == 'username'){
                return '120';
            } else {
                return '150';
            }
        },
        async init_data(){ // 获取用户列表
            this.$store.commit('SET_DATA_LOADING_STATUS', true);
            const _res = await this.$axios.$get(API_MANAGE_USER_LIST);
            if (_res.code == 200) {
                this.tableData = _res.data.table_list.reverse();
            }
        },
        show_delete_user_pop(data, index){ // 显示删除用户弹窗
            this.confirmPop.data = data;
            this.confirmPop.index = index;
            this.confirmPop.title = '确认删除人员<em class="important">' + data.username + '</em>?';
            this.confirmPop.visible = true;
        },
        async delete_user_submit(){ // 删除用户
            const _resData = await api_manage_user_delete({id: this.confirmPop.data.id});
            if (_resData.code == 200){
                this.tableData.splice(this.confirmPop.index, 1);
                this.$message.success('人员删除成功');
            }
            this.confirmPop.visible = false;
        },
        show_add_edit_pop(type, data){ // 添加用户
            this.addEditUserDataPop.type = type;
            if (type == 'edit'){
                this.addEditUserDataPop.title = '编辑人员';
                this.formData.username = data.username;
                this.formData.role_id_arr = data.role_id_arr;
                this.formData.email = data.email;
                this.formData.id = data.id;
            } else if (type == 'add'){
                this.addEditUserDataPop.title = '添加人员';
                this.formData.username = '';
                this.formData.email = '';
                this.formData.role_id_arr = [];
                this.formData.id = '';
            }
            this.addEditUserDataPop.visible = true;
        },
        async add_user_submit(){ // 添加用户
            if (!this.filter_form_data()){
                return false;
            }
            const _resData = await api_manage_user_create({
                role_id_str: this.formData.role_id_arr.join(','),
                username: this.formData.username,
                email: this.formData.email
            });
            if (_resData.code == 200){
                this.$message.success('新用户添加成功');
                this.init_data();
                this.addEditUserDataPop.visible = false;
            }
        },
        async update_user_submit(){ // 编辑用户
            if (!this.filter_form_data()){
                return false;
            }
            const _resData = await api_manage_user_update({
                id: this.formData.id,
                role_id_str: this.formData.role_id_arr.join(','),
                email: this.formData.email,
                username: this.formData.username
            });
            if (_resData.code == 200){
                this.$message.success('用户信息编辑成功');
                this.init_data();
                this.addEditUserDataPop.visible = false;
            }
        },
        add_update_user_submit(){ // 提交用户
            if (this.addEditUserDataPop.type == 'add'){
                this.add_user_submit();
            } else if (this.addEditUserDataPop.type == 'edit'){
                this.update_user_submit();
            }
        },
        filter_form_data(){ // 检测表单数据
            if (this.formData.role_id_arr.length == 0){
                this.$message.error('角色不能为空');
                return false;
            }
            if (this.formData.username == ''){
                this.$message.error('人员姓名不能为空');
                return false;
            }
            if (this.formData.email == ''){
                this.$message.error('邮箱不能为空');
                return false;
            }
            if (!this.formData.email.includes('@')){
                this.$message.error('请填写正确的邮箱格式');
                return false;
            }
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
