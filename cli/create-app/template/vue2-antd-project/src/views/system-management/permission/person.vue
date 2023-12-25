<template>
    <div class="row">
        <div class="qm-form auto">
            <a-form-model layout="inline" :size="$store.state.antd.modelSize">
                <a-form-model-item label="角色">
                    <a-select v-model="filterData.role" class="w-200" :dropdown-match-select-width="false" :dropdown-style="{ width: 'auto' }" placeholder="角色">
                        <a-select-option key="" >全部</a-select-option>
                        <a-select-option v-for="option in roleOptions" :key="option.value" >{{option.label}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="show_add_edit_pop('add')">添加</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <a-table :columns="columns" :size="$store.state.antd.tableSize" bordered class="even-bg" rowKey="id" :dataSource="tableFilterData" :scroll="{y: 'calc(100vh - 160px)', x: '1000px'}" :pagination="false" >
            <template slot="role_name_str" slot-scope="text">
                <a-tag v-for="item in text.split(',')" :key="item">{{ item }}</a-tag>
            </template>
            <template slot-scope="text, record, index" slot="action">
                <p class="p-btn-list">
                    <a href="javascript:void(0);" @click="show_add_edit_pop('edit',record)">编辑</a>
                    <a-popconfirm :title="'确认删除 ' + record.username + ' 人员?'" @confirm="user_del(record, index)" okText="确认" cancelText="取消" placement="topRight">
                        <a href="javascript:void(0);">删除</a>
                    </a-popconfirm>
                </p>
            </template>
        </a-table>
        <a-modal :width="500" :size="$store.state.antd.modelSize" :title="addEditUserDataPop.title" v-model="addEditUserDataPop.visible" :centered="true" @cancel="addEditUserDataPop.visible = false" @ok="user_submit">
            <a-form-model :model="formData" class="qm-form t-120">
                <a-form-model-item label="人员姓名">
                    <a-input v-model="formData.username" placeholder="人员姓名"/>
                </a-form-model-item>
                <a-form-model-item label="企业邮箱">
                    <a-input v-model="formData.email" type="text" name="email" placeholder="zhansan@km.com"/>
                </a-form-model-item>
                <a-form-model-item label="角色设置">
                    <a-select v-model="formData.role_id_arr" mode="multiple" placeholder="请选择">
                        <a-select-option :value="option.value" v-for="option in roleOptions" :key="option.value">{{ option.label }}</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import { api_manage_role_options } from '@/http/system-management/permission/role';
import { api_manage_user_list, api_manage_user_create, api_manage_user_delete, api_manage_user_update } from '@/http/system-management/permission/person';

export default {
    name: 'User',
    data() {
        return {
            columns: [
                {
                    title: '人员姓名',
                    width: 120,
                    dataIndex: 'username',
                    scopedSlots: { customRender: 'username' }
                },
                {
                    title: '企业邮箱',
                    width: 220,
                    dataIndex: 'email',
                    scopedSlots: { customRender: 'email' }
                },
                {
                    title: '所属角色',
                    width: 'role_name_str',
                    dataIndex: 'role_name_str',
                    scopedSlots: { customRender: 'role_name_str' }
                },
                {
                    title: '最后登录时间',
                    width: 160,
                    dataIndex: 'latest_login_time',
                    scopedSlots: { customRender: 'latest_login_time' }
                },
                {
                    title: '最后登录ip',
                    width: 130,
                    dataIndex: 'latest_login_ip',
                    scopedSlots: { customRender: 'latest_login_ip' }
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    fixed: 'right',
                    width: 120,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            tableData: [],
            addEditUserDataPop: {
                visible: false,
                type: '', // add添加人员 edit编辑人员
                title: ''
            },
            roleOptions: [],
            formData: {
                username: '', // 人员姓名
                email: '', // 企业邮箱
                role_id_arr: [], //  角色id
                id: ''
            },
            filterData: { // 筛选
                role: ''
            }
        };
    },
    components: {
    },
    computed: {
        tableFilterData(){
            return this.filterData.role != '' ? this.tableData.filter(item => item.role_id_arr.includes(this.filterData.role)) : this.tableData;
        }
    },
    mounted() {
        this.$store.commit('SET_PAGE_LOADING_STATUS', true);
        this.init_data();
        this.get_user_options();
    },
    methods: {
        async init_data(){ // 获取用户列表
            this.$store.commit('SET_DATA_LOADING_STATUS', true);
            const _res = await api_manage_user_list();
            if (_res.code == 200) {
                this.tableData = _res.data.table_list.reverse();
            }
        },
        async get_user_options(){
            const _res = await api_manage_role_options();
            if (_res.code == 200) {
                this.roleOptions = _res.data.role_data;
            }
        },
        user_del(data, index){ // 删除用户
            api_manage_user_delete({id: data.id}).then(res => {
                if (res.code == 200){
                    this.tableData.splice(index, 1);
                    this.$antdMessage.success('删除成功');
                }
            });
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
        user_add(){ // 添加用户
            if (!this.filter_form_data()){
                return false;
            }
            api_manage_user_create({
                role_id_str: this.formData.role_id_arr.join(','),
                username: this.formData.username,
                email: this.formData.email
            }).then(res => {
                if (res.code == 200){
                    this.$antdMessage.success('新用户添加成功');
                    this.init_data();
                    this.addEditUserDataPop.visible = false;
                }
            });
        },
        user_edit(){ // 编辑用户
            if (!this.filter_form_data()){
                return false;
            }
            api_manage_user_update({
                id: this.formData.id,
                role_id_str: this.formData.role_id_arr.join(','),
                email: this.formData.email,
                username: this.formData.username
            }).then(res => {
                if (res.code == 200){
                    this.$antdMessage.success('用户信息编辑成功');
                    this.init_data();
                    this.addEditUserDataPop.visible = false;
                }
            });
        },
        user_submit(){ // 提交用户
            if (this.addEditUserDataPop.type == 'add'){
                this.user_add();
            } else if (this.addEditUserDataPop.type == 'edit'){
                this.user_edit();
            }
        },
        filter_form_data(){ // 检测表单数据
            if (this.formData.role_id_arr.length == 0){
                this.$antdMessage.error('角色不能为空');
                return false;
            }
            if (this.formData.username == ''){
                this.$antdMessage.error('人员姓名不能为空');
                return false;
            }
            if (this.formData.email == ''){
                this.$antdMessage.error('邮箱不能为空');
                return false;
            }
            if (!this.formData.email.includes('@')){
                this.$antdMessage.error('请填写正确的邮箱格式');
                return false;
            }
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
