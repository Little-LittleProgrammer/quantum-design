<!--  -->
<template>
    <div>
        <a-card class="qm-card" :size="antdStore.cardSize">
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
        <edit-role @register="register" @ok="handle_ok"></edit-role>
    </div>
</template>

<script lang='ts'>
import { api_manage_role_list, api_manage_role_delete} from '@/http/api/system-management/permission/role';
import { IRoleAuths } from '@/http/api/system-management/permission/role'; // 接口
import { js_utils_set_table_height } from '@q-front-npm/utils';
import { defineComponent, reactive, toRefs, onMounted} from 'vue';
import { useMessage } from '@q-front-npm/hooks/vue';
import { useAntdStore } from '@/store/modules/antd';
import { useGlobalStore } from '@/store/modules/global';
import EditRole from './components/edit-role.vue';
import {useDrawer} from '@q-front-npm/vue3-antd-pc-ui';
interface DataProps {
    tableData: IRoleAuths[]
    tableHeight: unknown
}
export default defineComponent({
    name: 'Role',
    components: {EditRole},
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
                // {
                //     title: '初始页面',
                //     width: 200,
                //     dataIndex: 'init_auth_name'
                // },
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
            ]

        };
        const data: DataProps = reactive({
            tableData: [],
            tableHeight: '0'
        });
        const [register, {openDrawer}] = useDrawer();
        const init_data = async() => {
            const _res = await api_manage_role_list();

            if (_res.code == 200){
                data.tableData = _res.data.list;
            }
        };

        const role_add = () => { // 添加角色
            openDrawer();
        };
        const role_edit = async(obj: IRoleAuths) => { // 编辑角色
            openDrawer(true, {id: obj.id});
        };
        // 删除
        const role_del = (obj: IRoleAuths, index: number) => {
            api_manage_role_delete({id: obj.id!}).then(res => {
                if (res.code == 200){
                    createMessage.success('删除成功');
                    data.tableData.splice(index, 1);
                }
            });
        };
        function handle_ok() {
            init_data();
        }
        onMounted(() => {
            globalStore.pageLoading = true;
            init_data();
            js_utils_set_table_height('even-bg').then(height => {
                data.tableHeight = height;
            });
        });
        const refData = toRefs(data);
        return {
            ...refData,
            ...unRefData,
            register,
            handle_ok,
            antdStore,
            role_add,
            role_edit,
            role_del
        };
    }
});
</script>
<style lang='scss' scoped>
</style>
