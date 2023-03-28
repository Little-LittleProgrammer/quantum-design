<!--  -->
<template>
<div>
    <a-card class="qm-card">
        <q-form @register="register">
            <template #formFooter>
                <a-button type="primary" @click="show_add_edit_pop('add')">添加</a-button>
            </template>
        </q-form>
    </a-card>
    <a-card class="qm-card mt">
        <a-table
            :columns="unRefData.columns"
            :size="antdStore.tableSize"
            bordered
            class="even-bg"
            rowKey="id"
            :dataSource="tableFilterData"
            :scroll="{y: data.tableHeight, x: '1000px'}"
            :pagination="false"
        >
            <template #bodyCell="{column, record, text, index}">
                <template v-if="column.dataIndex === 'role_name_str'">
                    <a-tag v-for="item in text.split(',')" :key="item">{{ item }}</a-tag>
                </template>
                <template  v-if="column.dataIndex === 'action'">
                    <span class="p-btn-list">
                        <a href="javascript:void(0);" @click="show_add_edit_pop('edit',record)">编辑</a>
                        <a-popconfirm :title="'确认删除 ' + record.username + ' 人员?'" @confirm="user_del(record, index)" okText="确认" cancelText="取消" placement="topRight">
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
import {regEnum} from '@wuefront/shared/enums';
import { set_table_height } from '@/assets/ts/tools';
import { useMessage } from '@wuefront/hooks/vue';
import { ITableList, IUpdateData } from '@/http/api/system-management/permission/person';
import { api_manage_user_list, api_manage_user_delete, api_manage_user_create, api_manage_user_update} from '@/http/api/system-management/permission/person';
import { api_manage_role_options } from '@/http/api/system-management/permission/role';
import { RuleObject } from 'ant-design-vue/lib/form/interface';
import { reactive, onMounted, computed, nextTick} from 'vue';
import { FormSchema, QForm, useForm } from '@wuefront/vue3-antd-ui';
import { useGlobalStore } from '@/store/modules/global';
import { useAntdStore } from '@/store/modules/antd';

defineOptions({
    name: 'Person'
});

interface DataProps {
    tableData: ITableList[];
    filterData: Record<'role', string>;
    roleOptions: ISelectOption[];
    tableHeight: unknown;
    formData: Omit<IUpdateData, 'role_id_str'> & Record<'role_id_arr', string[]>;
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
            width: 'role_name_str',
            dataIndex: 'role_name_str'
        },
        {
            title: '最后登录时间',
            width: 160,
            dataIndex: 'latest_login_time'
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
        id: ''
    },
    filterData: { // 筛选
        role: ''
    },
    tableHeight: '0'
});
const tableFilterData = computed(() => {
    return data.filterData.role != '' ? data.tableData.filter(item => item.role_id_arr.includes(data.filterData.role)) : data.tableData;
});
const getFormSchemas = computed(():FormSchema[] => {
    return [
        {
            label: '角色',
            field: 'role',
            component: 'Select',
            defaultValue: '',
            componentProps: {
                options: [
                    {label: '全部', value: ''},
                    ...data.roleOptions
                ],
                onChange: (e: string) => {
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
                    const _reg = regEnum.emailReg;
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
        data.tableData = _res.data.table_list.reverse();
    }
};
const get_user_options = async() => {
    const _res = await api_manage_role_options();
    if (_res.code == 200) {
        data.roleOptions = _res.data.role_data;
    }
};

const user_del = (obj: Record<'id', string>, index: number) => { // 删除用户
    api_manage_user_delete({id: obj.id}).then(res => {
        if (res.code == 200){
            data.tableData.splice(index, 1);
            createMessage.success('删除成功');
        }
    });
};
const user_add = () => { // 添加用户
    validate().then(() => {
        globalStore.pageLoading = true;
        api_manage_user_create({
            role_id_str: data.formData.role_id_arr.join(','),
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
        api_manage_user_update({
            id: data.formData.id,
            role_id_str: data.formData.role_id_arr.join(','),
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
    data.formData = {id: data.formData.id, ...values} as Omit<IUpdateData, 'role_id_str'> & Record<'role_id_arr', string[]>;
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
    set_table_height('even-bg').then(height => {
        data.tableHeight = height;
    });
});
</script>
<style lang='scss' scoped>
</style>
