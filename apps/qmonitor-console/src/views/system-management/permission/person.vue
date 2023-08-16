<!--  -->
<template>
    <div>
        <a-card class="g-card" :size="antdStore.cardSize">
            <q-form @register="register">
                <template #formFooter>
                    <a-button type="primary" @click="show_add_edit_pop('add')">添加</a-button>
                </template>
            </q-form>
        </a-card>
        <a-card class="g-card mt" :size="antdStore.cardSize">
            <a-table
                :columns="unRefData.columns"
                :size="antdStore.tableSize"
                bordered
                class="even-bg"
                rowKey="id"
                :dataSource="tableFilterData"
                :scroll="{ x: '1000px'}"
                :pagination="false"
            >
                <template #bodyCell="{column, record, text}">
                    <template v-if="column.dataIndex === 'role_name_arr'">
                        <a-tag v-for="item in text" :key="item">{{ item }}</a-tag>
                    </template>
                    <template  v-if="column.dataIndex === 'action'">
                        <span class="p-btn-list">
                            <a href="javascript:void(0);" @click="show_add_edit_pop('edit',record)">编辑</a>
                            <a-popconfirm :title="'确认删除 ' + record.username + ' 人员?'" @confirm="user_del(record)" okText="确认" cancelText="取消" placement="topRight">
                                <a href="javascript:void(0);">删除</a>
                            </a-popconfirm>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-modal :width="500" :size="antdStore.modelSize" :title="data.addEditUserDataPop.title" v-model:visible="data.addEditUserDataPop.visible" :centered="true" @cancel="user_cancel" @ok="user_submit">
            <q-form @register="registerEdit"></q-form>
        </a-modal>
    </div>
    </template>

<script lang='ts' setup>
import {gRegEnum} from '@wuefront/shared/enums';
import { useMessage } from '@wuefront/hooks/vue';
import { IPersonEditData, ITableList } from '@/http/api/system-management/permission/person';
import { api_manage_user_list, api_manage_user_delete, api_manage_user_edit} from '@/http/api/system-management/permission/person';
import { api_manage_role_options } from '@/http/api/system-management/permission/role';
import { RuleObject } from 'ant-design-vue/lib/form/interface';
import { reactive, onMounted, computed, nextTick} from 'vue';
import { FormSchema, QForm, useForm } from '@wuefront/vue3-antd-pc-ui';
import { useGlobalStore } from '@/store/modules/global';
import { useAntdStore } from '@/store/modules/antd';

defineOptions({
    name: 'Person'
});

interface DataProps {
    tableData: ITableList[];
    filterData: Record<'role', number>;
    roleOptions: ISelectOption[];
    formData: IPersonEditData;
    addEditUserDataPop: { visible: boolean; type: string; title:string }
}

const antdStore = useAntdStore();
const {createMessage} = useMessage();
const globalStore = useGlobalStore();
const unRefData = {
    columns: [
        {
            title: '人员姓名',
            width: 120,
            dataIndex: 'username'
        },
        {
            title: '企业邮箱',
            width: 220,
            dataIndex: 'email'
        },
        {
            title: '所属角色',
            width: 'role_name_arr',
            dataIndex: 'role_name_arr'
        },
        {
            title: '最后登录时间',
            width: 160,
            dataIndex: 'latest_login_at'
        },
        {
            title: '最后登录ip',
            width: 130,
            dataIndex: 'latest_login_ip'
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 120
        }
    ]
};
const data: DataProps = reactive({
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
        id: -1
    },
    filterData: { // 筛选
        role: -1
    }
});
const tableFilterData = computed(() => {
    console.log(data.filterData.role);
    return data.filterData.role != -1 ? data.tableData.filter(item => item.role_id_arr && item.role_id_arr.includes(data.filterData.role)) : data.tableData;
});
const getFormSchemas = computed(():FormSchema[] => {
    return [
        {
            label: '角色',
            field: 'role',
            component: 'Select',
            defaultValue: -1,
            componentProps: {
                options: [
                    {label: '全部', value: -1},
                    ...data.roleOptions
                ],
                onChange: (e: number) => {
                    data.filterData.role = e;
                }
            }
        }
    ];
});
const [register] = useForm({
    layout: 'inline',
    size: antdStore.modelSize,
    schemas: getFormSchemas,
    showActionButtonGroup: false,
    baseColProps: {
        span: 6
    }
});
const getEditSchemas = computed(():FormSchema[] => {
    return [{
        label: '人员姓名',
        field: 'username',
        component: 'Input',
        required: true
    }, {
        label: '企业邮箱',
        field: 'email',
        component: 'Input',
        rules: [
            {
                required: true,
                message: '请输入企业邮箱'
            },
            {
                trigger: 'blur',
                validator: async(_rule: RuleObject, value: string) => {
                    const _reg = gRegEnum.emailReg;
                    if (!_reg.test(value)) {
                        return Promise.reject('请输入正确格式的邮箱');
                    } else {
                        return Promise.resolve();
                    }
                }
            }
        ]
    }, {
        label: '角色设置',
        field: 'role_id_arr',
        component: 'Select',
        required: true,
        componentProps: {
            options: data.roleOptions,
            mode: 'multiple'
        }
    }];
});
const [registerEdit, {resetFields, getFieldsValue, validate, setFieldsValue}] = useForm({
    showActionButtonGroup: false,
    schemas: getEditSchemas,
    baseColProps: {
        span: 24
    },
    labelCol: {
        span: 6
    }
});
const init_data = async() => { // 获取用户列表
    const _res = await api_manage_user_list();
    if (_res.code == 200) {
        data.tableData = _res.data.list.reverse();
    }
};
const get_user_options = async() => {
    const _res = await api_manage_role_options();
    if (_res.code == 200) {
        data.roleOptions = _res.data.role_list;
    }
};

const user_del = (obj: Record<'id', number>) => { // 删除用户
    api_manage_user_delete({id: obj.id}).then(res => {
        if (res.code == 200){
            const _idx = data.tableData.findIndex(item => item.id === obj.id);
            (_idx || _idx === 0) && data.tableData.splice(_idx, 1);
            createMessage.success('删除成功');
        }
    });
};
const user_add = () => { // 添加用户
    validate().then(() => {
        globalStore.pageLoading = true;
        api_manage_user_edit({
            role_id_arr: data.formData.role_id_arr,
            username: data.formData.username,
            email: data.formData.email
        }).then(res => {
            if (res.code == 200){
                createMessage.success('新用户添加成功');
                init_data();
                user_cancel();
            }
        });
    });
};
const user_edit = () => { // 编辑用户
    validate().then(() => {
        console.log(data.formData);
        globalStore.pageLoading = true;
        api_manage_user_edit({
            id: data.formData.id,
            role_id_arr: data.formData.role_id_arr,
            email: data.formData.email,
            username: data.formData.username
        }).then(res => {
            if (res.code == 200){
                createMessage.success('用户信息编辑成功');
                init_data();
                user_cancel();
            }
        });
    });
};
const user_submit = () => { // 提交用户
    const values = getFieldsValue();
    data.formData = {...values, id: data.formData.id};
    if (data.addEditUserDataPop.type == 'add'){
        user_add();
    } else if (data.addEditUserDataPop.type == 'edit'){
        user_edit();
    }
};
const user_cancel = () => {
    data.addEditUserDataPop.visible = false;
    resetFields();
};

const show_add_edit_pop = async(type: string, obj?: ITableList) => { // 添加用户
    data.addEditUserDataPop.type = type;
    data.addEditUserDataPop.visible = true;
    if (type == 'edit'){
        if (obj) {
            data.addEditUserDataPop.title = '编辑人员';
            data.formData.id = obj.id;
            data.formData.email = obj.email;
            data.formData.role_id_arr = obj.role_id_arr;
            data.formData.username = obj.username;
        }
        await nextTick();
        setFieldsValue({
            ...data.formData
        });
    } else if (type == 'add'){
        data.addEditUserDataPop.title = '添加人员';
    }
};

onMounted(() => {
    globalStore.pageLoading = true;
    init_data();
    get_user_options();
});
</script>
<style lang='scss' scoped>
</style>

