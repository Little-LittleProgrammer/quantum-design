<!--  -->
<template>
    <div>
        <template v-if="pageType == '' || pageType == 'list'">
            <a-card class="qm-card" >
                <div class="qm-form">
                    <a-form layout="inline" :size="antdStore.modelSize">
                        <a-form-item>
                            <a-button type="primary" @click="role_add">添加</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <a-table :pagination="false" :size="antdStore.tableSize" rowKey="id" :columns="columns" :scroll="{y: tableHeight, x: '1000px'}" bordered class="even-bg" :dataSource="tableData" >
                    <template #bodyCell="{column, record, index}">
                        <p class="p-btn-list" v-if="column.dataIndex === 'action'">
                            <a href="javascript:void(0);" @click="role_edit(record)">修改</a>
                            <a-popconfirm :title="'确认删除 ' + record.role_name + ' 角色'" @confirm="role_del(record, index)" >
                                <a href="javascript:void(0);">删除</a>
                            </a-popconfirm>
                        </p>
                    </template>
                </a-table>
            </a-card>
        </template>
        <template v-else-if="pageType == 'add' || pageType == 'edit'">
            <a-card class="qm-card" title="添加角色">
                <a-form :model="roleFormData" class="qm-form t-120">
                    <a-form-item label="角色名称">
                        <a-input v-model:value="roleFormData.role_name"></a-input>
                    </a-form-item>
                    <a-row class="mb">
                        <a-col :span="12">
                            <a-form-item label="选择权限">
                                <a-tree v-if="authTreeData.length > 0" class="role-tree" v-model:checkedKeys="roleFormData.show_auth_id_arr" :replaceFields="replaceFields" checkable :defaultExpandAll="true"  :tree-data="authTreeData" @check="handle_auth_tree_check">
                                    <template #title="{dataRef}">{{dataRef.auth_name}}<span class="red" v-if="dataRef.path_type == '2'">（接口）</span></template>
                                </a-tree>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="初始页面">
                            <a-tree v-if="pageTreeData.length > 0" class="role-tree" v-model:checkedKeys="roleFormData.init_auth_id" :replaceFields="replaceFields" checkable :checkStrictly = "true" :defaultExpandAll="true" :tree-data="pageTreeData" @check="handle_page_tree_check"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-form-item label="备注">
                        <a-textarea :rows="4" v-model:value="roleFormData.remark" />
                    </a-form-item>
                    <a-form-item class="ant-form-item-btn">
                        <a-button type="primary" @click="role_save">保存</a-button>
                        <a-button @click="role_cancel">取消</a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </template>
    </div>
</template>

<script lang='ts'>
import { api_manage_auth_data } from '@/http/api/system-management/permission/menu-config';
import { IAuthList } from '@/http/api/system-management/permission/menu-config';// 接口
import { api_manage_role_list, api_manage_role_data, api_manage_role_create, api_manage_role_delete, api_manage_role_update} from '@/http/api/system-management/permission/role';
import { IRoleData, IRoleAuths } from '@/http/api/system-management/permission/role'; // 接口
import { set_table_height } from '@/assets/ts/tools';
import { defineComponent, reactive, toRefs, onMounted} from 'vue';
import { useMessage } from '@qmfront/hooks/vue';
import { useAntdStore } from '@/store/modules/antd';
import { useGlobalStore } from '@/store/modules/global';
import { deep_copy } from '@qmfront/shared/utils';
interface DataProps {
    pageType: string;
    tableData: IRoleAuths[]
    roleFormData: IRoleData,
    authTreeData: IAuthList[],
    pageTreeData: IAuthList[],
    pagePidArr: string[],
    leafIdArr: never[],
    tableHeight: unknown
}
interface IAuthListEx extends IAuthList {
    scopedSlots?: {
        title: string
    }
}
export default defineComponent({
    name: 'Role',
    setup() {
        const antdStore = useAntdStore();
        const globalStore = useGlobalStore();
        const {createMessage} = useMessage();
        const unRefData = {
            columns: [
                {
                    title: '角色名称',
                    width: 160,
                    dataIndex: 'role_name'
                },
                {
                    title: '初始页面',
                    width: 200,
                    dataIndex: 'init_auth_name'
                },
                {
                    title: '备注',
                    // width: 160,
                    dataIndex: 'remark'
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    fixed: 'right',
                    width: 120
                }
            ],
            replaceFields: { children: 'children', key: 'id', title: 'auth_name' }

        };
        const data: DataProps = reactive({
            pageType: 'list', //  网页类型list列表 edit或add编辑或者修改
            tableData: [],
            roleFormData: {
                role_name: '', // 角色名称
                init_auth_id: [], // 初始页id
                remark: '', // 备注
                id: '',
                auth_id_arr: [] as string[], // 选中的权限
                show_auth_id_arr: [] as string[] // 显示的选中权限
            },
            authTreeData: [], // 权限树结构
            pageTreeData: [], // 页面树结构
            pagePidArr: [], // 页面数据pid数据
            leafIdArr: [],
            tableHeight: '0'
        });
        const init_data = async() => {
            const _res = await api_manage_role_list();

            if (_res.code == 200){
                data.tableData = _res.data.table_list;
            }
        };
        // 获取树结构
        const get_tree_data = async() => {
            const _treeData = await api_manage_auth_data();
            update_tree_scope(_treeData.data.auth_list); // 权限树结构添加 scope-slot 属性
            data.authTreeData = deep_copy(_treeData.data.auth_list); // 权限树结构
            data.pageTreeData = deep_copy(_treeData.data.auth_list); // 页面树结构
            filter_tree_remove_api(data.pageTreeData); // 页面树结构过滤接口节点
            get_pid_arr(data.pageTreeData);
        };
        // 递归修改源数据添加scopedSlots属性，开启自定义插槽
        const update_tree_scope = (arr: IAuthListEx[]) => {
            for (let i = 0; i < arr.length; i++) {
                arr[i].scopedSlots = {title: 'title'};
                if (arr[i].children && arr[i].children.length > 0) {
                    update_tree_scope(arr[i].children);
                } else {
                    continue;
                }
            }
        };
        // 递归 去掉接口
        const filter_tree_remove_api = (arr:IAuthList[]) => {
            const _arr = arr;
            _arr.forEach(item => {
                if (!item.children) return;
                const res = item.children.filter(n => n.path_type == '1');
                item.children = filter_tree_remove_api(res);
            });
            return _arr;
        };
        // 递归 获取页面的pid数据
        const get_pid_arr = (list: IAuthList[]) => {
            list.forEach(item => {
                if (item.children && item.children.length > 0){
                    data.pagePidArr.push(item.id);
                    get_pid_arr(item.children);
                } else {
                    return;
                }
            });
        };

        // 权限 check回调
        function handle_auth_tree_check(checkedKeys: string[], obj: any) {
            const _show_auth_id_arr = deep_copy(checkedKeys);
            data.roleFormData.show_auth_id_arr = _show_auth_id_arr;
            // // 获取所有选中节点
            data.roleFormData.auth_id_arr = [...checkedKeys, ...obj.halfCheckedKeys];

            if (!data.roleFormData.auth_id_arr.includes(data.roleFormData.init_auth_id[0])){
                data.roleFormData.init_auth_id = [];
            }
        }

        // 页面 check回调
        function handle_page_tree_check(__checkedKeys: string[], obj: any){
            if (data.roleFormData.auth_id_arr && data.roleFormData.auth_id_arr.includes(obj.node.eventKey)) {
                data.roleFormData.init_auth_id = [obj.node.eventKey];
            } else {
                createMessage.error('该页面没有访问权限');
                data.roleFormData.init_auth_id = [];
            }
        }

        const role_add = () => { // 添加角色
            data.pageType = 'add';
        };
        const role_edit = async(obj: IRoleAuths) => { // 编辑角色
            data.pageType = 'edit';
            const _res = await api_manage_role_data({id: obj.id});
            if (_res.code == 200){
                data.roleFormData.id = _res.data.id;
                data.roleFormData.auth_id_arr = _res.data.auth_id_arr; // 选中的权限
                data.roleFormData.init_auth_id = [_res.data.init_auth_id] as string[]; // 选中的页面
                data.roleFormData.role_name = _res.data.role_name;
                data.roleFormData.remark = _res.data.remark;
                data.roleFormData.show_auth_id_arr = _res.data.show_auth_id_arr;
                data.pagePidArr.forEach((n) => { // 过滤父id（显示id数据用）
                    if (data.roleFormData.show_auth_id_arr && data.roleFormData.show_auth_id_arr.indexOf(n) > -1){
                        data.roleFormData.show_auth_id_arr.splice(data.roleFormData.show_auth_id_arr.indexOf(n), 1);
                    }
                });
            }
        };
        // 删除
        const role_del = (obj: IRoleAuths, index: number) => {
            api_manage_role_delete({id: obj.id}).then(res => {
                if (res.code == 200){
                    createMessage.success('删除成功');
                    data.tableData.splice(index, 1);
                }
            });
        };
        // 取消
        const role_cancel = () => {
            handle_clear_form();
            data.pageType = 'list';
        };
        // 保存
        const role_save = () => {
            const _formData = deep_copy(data.roleFormData);
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
            _formData.show_auth_id_str = _formData.show_auth_id_arr!.join(',');
            _formData.auth_id_str = _formData.auth_id_arr!.join(',');
            _formData.init_auth_id = (_formData.init_auth_id as string[]).join(',');
            delete _formData.show_auth_id_arr;
            delete _formData.auth_id_arr;
            if (data.pageType == 'add'){
                delete _formData.id;
                api_manage_role_create(_formData).then(res => {
                    if (res.code == 200){
                        createMessage.success('保存成功');
                        init_data();
                        role_cancel();
                    }
                });
            } else if (data.pageType == 'edit') {
                api_manage_role_update(_formData).then(res => {
                    if (res.code == 200){
                        createMessage.success('修改成功');
                        init_data();
                        role_cancel();
                    }
                });
            }
        };
        // 清除表单值
        const handle_clear_form = () => {
            data.roleFormData = {
                role_name: '', // 角色名称
                init_auth_id: [], // 初始页id
                remark: '', // 备注
                id: '',
                auth_id_arr: [], // 选中的权限
                show_auth_id_arr: [] // 显示的选中权限
            };
        };
        onMounted(() => {
            globalStore.pageLoading = true;
            init_data();
            get_tree_data();
            set_table_height('even-bg').then(height => {
                console.log(height);
                data.tableHeight = height;
            });
        });
        const refData = toRefs(data);
        return {
            ...refData,
            ...unRefData,
            antdStore,
            role_add,
            role_edit,
            role_del,
            role_save,
            role_cancel,
            handle_auth_tree_check,
            handle_page_tree_check
        };
    }
});
</script>
<style lang='scss' scoped>
</style>
