<!--  -->
<template>
    <q-antd-drawer v-bind="$attrs" @register="register" @ok="role_save" @close="role_cancel">
        <a-form :model="data.roleFormData" class="qm-form t-120">
            <a-form-item label="角色名称">
                <a-input v-model:value="data.roleFormData.role_name"></a-input>
            </a-form-item>
            <a-row class="mb">
                <a-col :span="12">
                    <a-form-item label="选择权限">
                        <a-tree v-if="data.authTreeData.length > 0" class="role-tree" v-model:checkedKeys="data.roleFormData.show_auth_id_arr" :fieldNames="unRefData.replaceFields" checkable :defaultExpandAll="true"  :tree-data="data.authTreeData" @check="handle_auth_tree_check">
                            <template #title="{dataRef}">{{dataRef.auth_name}}<span class="red" v-if="dataRef.path_type == '2'">（接口）</span></template>
                        </a-tree>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="初始页面">
                    <a-tree v-if="data.pageTreeData.length > 0" class="role-tree" v-model:checkedKeys="data.roleFormData.init_auth_id" :fieldNames="unRefData.replaceFields" checkable :checkStrictly = "true" :defaultExpandAll="true" :tree-data="data.pageTreeData" @check="handle_page_tree_check"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item label="备注">
                <a-textarea :rows="4" v-model:value="data.roleFormData.remark" />
            </a-form-item>
        </a-form>
    </q-antd-drawer>
</template>

<script lang='ts' setup>
import { reactive, onMounted, watch} from 'vue';
import {useDrawerInner} from '@quantum-design/vue3-antd-pc-ui';
import { api_manage_role_edit, api_manage_role_data, IRoleData } from '@/http/api/system-management/permission/role';
import { api_manage_auth_list } from '@/http/api/system-management/permission/menu-config';
import { useMessage } from '@quantum-design/hooks/vue';
import { js_utils_deep_copy } from '@quantum-design/utils';
import { IMenuData } from '@quantum-design/types/vue/router';
interface DataProps {
    pageType: string
    roleFormData: Omit<IRoleData, 'init_auth_id'> & Record<'init_auth_id', number[]>,
    authTreeData: IMenuData[],
    pageTreeData: IMenuData[],
    pagePidArr: number[],
    leafIdArr: never[]
}
interface IAuthListEx extends IMenuData {
    scopedSlots?: {
        title: string
    }
}
const {createMessage} = useMessage();
const emit = defineEmits(['ok', 'register']);
const unRefData = {
    replaceFields: { children: 'children', key: 'id', title: 'auth_name' }

};
const data: DataProps = reactive({
    pageType: 'add',
    roleFormData: {
        role_name: '', // 角色名称
        init_auth_id: [], // 初始页id
        remark: '', // 备注
        auth_id_arr: [] as number[], // 选中的权限
        show_auth_id_arr: [] as number[] // 显示的选中权限
    },
    authTreeData: [], // 权限树结构
    pageTreeData: [], // 页面树结构
    pagePidArr: [], // 页面数据pid数据
    leafIdArr: []
});
const [register, {setDrawerProps, closeDrawer, changeLoading, changeOkLoading }] = useDrawerInner(async(obj:Recordable<'id'>) => {
    const _res = await api_manage_role_data({id: obj.id});
    data.pageType = 'edit';
    if (_res.code === 200){
        data.roleFormData.id = _res.data.id;
        data.roleFormData.auth_id_arr = _res.data.auth_id_arr; // 选中的权限
        data.roleFormData.init_auth_id = [_res.data.init_auth_id] as number[]; // 选中的页面
        data.roleFormData.role_name = _res.data.role_name;
        data.roleFormData.remark = _res.data.remark;
        data.roleFormData.show_auth_id_arr = _res.data.show_auth_id_arr;
        data.pagePidArr.forEach((n: any) => { // 过滤父id（显示id数据用）
            if (data.roleFormData.show_auth_id_arr && data.roleFormData.show_auth_id_arr.indexOf(n) > -1){
                data.roleFormData.show_auth_id_arr.splice(data.roleFormData.show_auth_id_arr.indexOf(n), 1);
            }
        });
    }
});

watch(() => data.pageType, (val) => {
    if (val === 'edit') {
        setDrawerProps({
            title: '编辑角色'
        });
    } else {
        setDrawerProps({
            title: '添加角色'
        });
    }
});

// 获取树结构
const get_tree_data = async() => {
    const _treeData = await api_manage_auth_list();
    update_tree_scope(_treeData.data.list); // 权限树结构添加 scope-slot 属性
    data.authTreeData = js_utils_deep_copy(_treeData.data.list); // 权限树结构
    data.pageTreeData = js_utils_deep_copy(_treeData.data.list); // 页面树结构
    filter_tree_remove_api(data.pageTreeData); // 页面树结构过滤接口节点
    get_pid_arr(data.pageTreeData);
};
// 递归修改源数据添加scopedSlots属性，开启自定义插槽
const update_tree_scope = (arr: IAuthListEx[]) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].scopedSlots = {title: 'title'};
        if (arr[i].children && arr[i].children!.length > 0) {
            update_tree_scope(arr[i].children!);
        } else {
            continue;
        }
    }
};
// 递归 去掉接口
const filter_tree_remove_api = (arr:IMenuData[]) => {
    const _arr = arr;
    _arr.forEach(item => {
        if (!item.children) return;
        const res = item.children.filter(n => n.path_type == 1);
        item.children = filter_tree_remove_api(res);
    });
    return _arr;
};
// 递归 获取页面的pid数据
const get_pid_arr = (list: IMenuData[]) => {
    list.forEach(item => {
        if (item.children && item.children.length > 0){
            data.pagePidArr.push(item.id!);
            get_pid_arr(item.children);
        } else {
            return;
        }
    });
};

// 权限 check回调
function handle_auth_tree_check(checkedKeys: number[], obj: any) {
    const _show_auth_id_arr = js_utils_deep_copy(checkedKeys);
    data.roleFormData.show_auth_id_arr = _show_auth_id_arr;
    // // 获取所有选中节点
    data.roleFormData.auth_id_arr = [...checkedKeys, ...obj.halfCheckedKeys];

    if (!data.roleFormData.auth_id_arr.includes(data.roleFormData.init_auth_id[0])){
        data.roleFormData.init_auth_id = [];
    }
}

// 页面 check回调
function handle_page_tree_check(_checkedKeys: string[], obj: any){
    if (data.roleFormData.auth_id_arr && data.roleFormData.auth_id_arr.includes(obj.node.eventKey)) {
        data.roleFormData.init_auth_id = [obj.node.eventKey];
    } else {
        createMessage.error('该页面没有访问权限');
        data.roleFormData.init_auth_id = [];
    }
}
// 取消
const role_cancel = () => {
    handle_clear_form();
};
// 保存
const role_save = () => {
    const _formData = js_utils_deep_copy(data.roleFormData);
    console.log(_formData);
    if (_formData.role_name == ''){
        createMessage.error('角色名称不能为空');
        return false;
    }
    if (_formData.auth_id_arr && _formData.auth_id_arr.length == 0){
        createMessage.error('请选择权限');
        return false;
    }
    if (_formData.init_auth_id.length == 0){
        createMessage.error('请选择初始页面');
        return false;
    }
    data.pagePidArr.forEach((n) => { // 过滤父id（显示id数据用）
        if (_formData.show_auth_id_arr && _formData.show_auth_id_arr.indexOf(n) > -1){
            _formData.show_auth_id_arr.splice(_formData.show_auth_id_arr.indexOf(n), 1);
        }
    });
    changeLoading(true);
    changeOkLoading(true);
    api_manage_role_edit({
        ..._formData,
        init_auth_id: _formData.init_auth_id[0]
    }).then(res => {
        changeLoading(false);
        changeOkLoading(false);
        if (res.code == 200){
            createMessage.success('保存成功');
            emit('ok');
            role_cancel();
            closeDrawer();
        }
    });
};
// 清除表单值
const handle_clear_form = () => {
    data.pageType = 'add';
    data.roleFormData = {
        role_name: '', // 角色名称
        init_auth_id: [], // 初始页id
        remark: '', // 备注
        auth_id_arr: [], // 选中的权限
        show_auth_id_arr: [] // 显示的选中权限
    };
};
onMounted(() => {
    get_tree_data();
    setDrawerProps({
        isDetail: true,
        title: '添加角色'
    });
});

</script>
<style lang='scss' scoped>
</style>
