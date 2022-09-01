<!--  -->
<template>
    <div class="menu-config-container">
        <a-card class="qm-card">
            <a-form layout="inline" >
                <a-form-item>
                    <a-button type="primary" @click="add_first_level_menu">添加一级菜单</a-button>
                </a-form-item>
            </a-form>
            <q-table-tree-drag v-model:expandedRowKeys="expandedKeys" :table-options="tableOption" @refreshTable="handel_table_drag">
                <template #bodyCell="{ text, record, column }">
                    <template v-if="column.key === 'auth_name'">
                        <template v-if="record.edit && record.edit == 1">
                            <a-input
                                class="flex"
                                v-model:value.trim="record.auth_name"
                                :ref="el => set_input_ref(el, record.id)"
                                :style="dynamic_width(record.id)"
                                :placeholder="record.path_type == '1' ? '请输入菜单名称' : '请输入接口名称'"
                            />
                        </template>
                        <template v-else>
                            <a-tooltip placement="topLeft">
                                <template #title>
                                    <span>{{record.auth_name}}</span>
                                    <em v-if="record.path_type == '2'">(接口)</em>
                                </template>
                                <div >
                                    <span>{{record.auth_name}}</span>
                                    <em v-if="record.path_type == '2'">(接口)</em>
                                </div>
                            </a-tooltip>
                        </template>
                    </template>
                    <template v-if="column.key === 'path'">
                        <template v-if="record.edit && record.edit == 1">
                            <a-input  v-model:value.trim="record.path" :placeholder="record.path_type == '1' ? '请输入页面地址' : '请输入接口地址'"></a-input>
                        </template>
                        <template v-else>
                            <span>{{text}}</span>
                        </template>
                    </template>
                    <template v-if="column.key === 'icon'">
                        <template v-if="record.edit && record.edit == 1 && !(record.path_type == '2')">
                            <q-icon-picker v-model:value="record.icon"></q-icon-picker>
                        </template>
                        <template v-else-if="record.icon">
                            <QIcon :type="record.icon"></QIcon>
                            <span class="ml">{{text}}</span>
                        </template>
                    </template>
                    <template v-if="column.key === 'action'">
                        <template v-if="record.edit && record.edit == 1">
                            <a-button type="link" size="small" @click="() => save_menu(record)">保存</a-button>
                            <template v-if="record.id != '' && !record.id.includes('default-')" >
                                <a-button type="link" size="small" @click="() => cancel_menu(record)" >取消</a-button>
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="record.path_type == '1'">
                                <a-button type="link" size="small" @click="() => add_sub_menu(record)">添加子菜单</a-button>
                                <a-button type="link" size="small" @click="() => add_interface(record)">添加接口</a-button>
                            </template>
                            <a-button type="link" size="small" @click="() => edit_menu(record)">修改</a-button>
                        </template>
                        <template v-if="record.id != '' && !record.id.includes('default-')">
                            <a-popconfirm
                                :title="'确认删除 ' + record.auth_name + (record.path_type == '1' ? ' 菜单' : '') + (record.path_type == '2' ? ' 接口' : '') + '?'"
                                @confirm="() => delete_menu(record)"
                                okText="确认"
                                cancelText="取消"
                                placement="topRight"
                            >
                                <a-button type="link" size="small" >删除</a-button>
                            </a-popconfirm>
                        </template>
                        <template v-else>
                            <a-button type="link" size="small" @click="() => delete_menu(record)">删除</a-button>
                        </template>
                    </template>
                </template>
            </q-table-tree-drag>
        </a-card>
    </div>
</template>

<script lang='ts'>
import { deep_copy } from '@qmfront/shared/utils';
import { useMessage } from '@qmfront/hooks/vue';
import { QIconPicker, QIcon } from '@qmfront/vue3-antd-ui';
import {QTableTreeDrag, TableProps} from '@qmfront/vue3-antd-ui';
import { api_manage_auth_create, api_manage_auth_delete, api_manage_auth_list, api_manage_auth_sort, api_manage_auth_update } from '@/http/api/system-management/permission/menu-config';
import { defineComponent, reactive, toRefs, onMounted, ref, computed, unref } from 'vue';
import { useGlobalStore } from '@/store/modules/global';
import { get_table_header_columns } from '@/assets/ts/tools';
import { Result } from '@qmfront/shared/types/http';
interface IDefaultData {
    auth_name: string;
    path: string;
    path_type: string;
    pid: string;
    icon: string;
    children: IDefaultData[];
    edit: number;
    id: string;
}
interface DataProps {
    sonIds: string[];
    tableData: IDefaultData[];
    expandedKeys: string[];
    isTreeShow: boolean
}

export default defineComponent({
    name: 'MenuConfig',
    components: {QIconPicker, QIcon, QTableTreeDrag},
    setup() {
        const authNameWidth = 250;
        const store = useGlobalStore();
        const { createMessage } = useMessage();
        const inputDomList = ref<any>({});
        const unRefData = {
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
            tableHeader: get_table_header_columns({auth_name: '菜单名称', path: '页面地址', icon: '图标', action: '操作' }, {
                alignData: {
                    all: 'left'
                },
                widthData: {
                    action: '250px',
                    icon: '160px',
                    auth_name: `${authNameWidth}px`
                }
            }),
            tempMenu: { auth_name: '', path: '', icon: '' }
        };
        const data: DataProps = reactive({
            expandedKeys: [],
            tableData: [],
            isTreeShow: false,
            sonIds: []
        });
        const tableOption = computed((): TableProps => {
            return {
                columns: unRefData.tableHeader,
                dataSource: data.tableData,
                rowKey: 'id',
                size: 'small'
            };
        });
        const dynamic_width = (id:any) => { // 动态计算宽度
            const $dom = unref(inputDomList)[id];
            if ($dom && $dom.input) {
                const _className = $dom.input.parentNode.children[0].className;
                const _num = _className.replace(/\D/g, '');
                return {
                    width: `${authNameWidth - parseInt(_num) * 15 - 24 - 16 - 4}px`
                };
            }
            return {
                width: '30%'
            };
        };
        const init_data = async() => {
            // 强制类型转化
            store.pageLoading = true;
            const _res = await api_manage_auth_list() as unknown as Result<Record<'table_list', IDefaultData[]>>;
            if (_res.code == 200) {
                data.tableData = _res.data.table_list;
                data.isTreeShow = true;
            }
        };
        const add_first_level_menu = () => {
            //  添加一级菜单
            const _data = deep_copy(unRefData.defaultData);
            _data.id = 'default-' + Date.now();
            data.tableData.push(_data);
            scroll_to_input(_data);
        };
        const add_sub_menu = (obj: IDefaultData) => {
            // 添加子集菜单
            const _data = deep_copy(unRefData.defaultData);
            _data.id = 'default-' + Date.now();
            _data.pid = obj.id;
            if (!obj.children) {
                obj.children = [_data];
            } else {
                obj.children.push(_data);
            }
            if (!data.expandedKeys.includes(obj.id)) {
                data.expandedKeys.push(obj.id);
            }
            scroll_to_input(_data);
        };
        const add_interface = (obj: IDefaultData) => {
            // 添加接口
            const _data = deep_copy(unRefData.defaultData);
            _data.id = 'default-' + Date.now();
            _data.pid = obj.id;
            _data.path_type = '2';
            if (!obj.children) {
                obj.children = [_data];
            } else {
                obj.children.push(_data);
            }
            if (!data.expandedKeys.includes(obj.id)) {
                data.expandedKeys.push(obj.id);
            }
            scroll_to_input(_data);
        };
        const set_input_ref = (el: any, id: any) => {
            inputDomList.value[id] = el;
        };
        const scroll_to_input = (data: IDefaultData) => {
            setTimeout(() => {
                const $input = inputDomList.value[data.id as any].$el;
                if (
                    $input.offsetTop >
                    document.querySelectorAll('.js-layout-main')[0].scrollTop +
                    document.documentElement.clientHeight -
                    100
                ) {
                    document.querySelectorAll('.js-layout-main')[0].scrollTo(0, $input.offsetTop - 300);
                }
                inputDomList.value[data.id as any].focus();
            }, 50);
        };
        const save_menu = (obj: IDefaultData) => {
            //  保存菜单
            if (obj.auth_name.trim() == '') {
                createMessage.error('标题不能为空');
                return false;
            }
            if (obj.path.trim() == '') {
                createMessage.error('页面地址不能为空');
                return false;
            }
            const _data = {
                auth_name: obj.auth_name,
                path: obj.path,
                pid: obj.pid,
                path_type: obj.path_type,
                icon: obj.icon,
                id: obj.id
            };
            if (_data.id.includes('default-')) {
                _data.id = '';
                store.pageLoading = true;
                api_manage_auth_create(_data).then((res) => {
                    if (res.code == 200) {
                        obj.edit = 0;
                        obj.id = res.data.id;
                        obj.auth_name = _data.auth_name;
                        obj.path = _data.path;
                        obj.pid = _data.pid;
                        obj.icon = _data.icon;
                        if (_data.path_type == '2') {
                            createMessage.success('接口新增成功');
                        } else {
                            createMessage.success('菜单新增成功');
                        }
                    } else {
                        front_remove_menu(obj, data.tableData);
                    }
                });
            } else {
                store.pageLoading = true;
                api_manage_auth_update(_data).then((res) => {
                    if (res.code == 200) {
                        obj.edit = 0;
                        obj.auth_name = _data.auth_name;
                        obj.path = _data.path;
                        obj.icon = _data.icon;
                        if (_data.path_type == '2') {
                            createMessage.success('接口修改成功');
                        } else {
                            createMessage.success('菜单修改成功');
                        }
                    } else {
                        front_remove_menu(obj, data.tableData);
                    }
                });
            }
        };
        // 删除菜单
        const delete_menu = (obj: IDefaultData) => {
            if (obj.id.includes('default-')) {
                front_remove_menu(obj, data.tableData);
                if (obj.path_type == '2') {
                    createMessage.success('接口删除成功');
                } else {
                    createMessage.success('菜单删除成功');
                }
            } else {
                api_manage_auth_delete({ id: obj.id }).then((res) => {
                    if (res.code == 200) {
                        front_remove_menu(obj, data.tableData);
                        if (obj.path_type == '2') {
                            createMessage.success('接口删除成功');
                        } else {
                            createMessage.success('菜单删除成功');
                        }
                    }
                });
            }
        };
        // 编辑菜单
        const edit_menu = (obj: IDefaultData) => {
            console.log({dataRef: obj});
            unRefData.tempMenu = deep_copy(obj);
            obj.edit = 1;
        };
        // 取消添加、编辑菜单或接口
        const cancel_menu = (obj: IDefaultData) => {
            obj.edit = 0;
            obj.auth_name = unRefData.tempMenu.auth_name;
            obj.path = unRefData.tempMenu.path;
            obj.icon = unRefData.tempMenu.icon;
        };
        // 排序
        const handel_table_drag = (dataObj: Record<'tableList'|'parentData'|'targetData', any>) => {
            // data.tableData = dataObj.tableList;
            let _parentId;
            if (dataObj.parentData && Object.keys(dataObj.parentData).length === 0) {
                _parentId = '0';
            } else {
                _parentId = dataObj.parentData.id;
            }
            if (_parentId === '0') {
                data.sonIds = dataObj.tableList.map((item: any) => item.id);
            } else {
                get_node_by_id(_parentId, dataObj.tableList);
            }
            api_manage_auth_sort({
                pid: _parentId,
                first_auth_id_str: data.sonIds.join(',')
            }).then((res) => {
                if (res.code == 200) {
                    createMessage.success('排序成功');
                } else {
                    init_data();
                }
            }).catch((err) => {
                console.log(err);
                init_data();
            });
        };
        const front_remove_menu = (data: IDefaultData, arr: IDefaultData[]) => {
            arr.some((n, i) => {
                if (arr[i].id === data.id) {
                    arr.splice(i, 1);
                    return true;
                } else if (arr[i].children && arr[i].children!.length > 0) {
                    front_remove_menu(data, arr[i].children!);
                }
            });
        };
        // 递归获取指定id节点下的所有一级子节点
        const get_node_by_id = (id: number, arr: IDefaultData[]) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id + '') {
                    data.sonIds = arr[i].children!.map((item: IDefaultData) => item.id);
                    break;
                } else if (arr[i].children && arr[i].children!.length > 0) {
                    get_node_by_id(id, arr[i].children!);
                } else {
                    continue;
                }
            }
        };
        onMounted(async() => {
            await init_data();
        });
        const refData = toRefs(data);
        return {
            ...unRefData,
            ...refData,
            store,
            inputDomList,
            tableOption,
            set_input_ref,
            add_first_level_menu,
            add_sub_menu,
            add_interface,
            save_menu,
            delete_menu,
            edit_menu,
            cancel_menu,
            handel_table_drag,
            dynamic_width
        };
    }
});
</script>

<style lang="scss">
.menu-config-container {
    .ant-btn ~ .ant-btn {
        margin: 0;
    }
    .ant-btn-sm {
        padding: 0 5px;
    }
    .ant-table {

    }
}
</style>
