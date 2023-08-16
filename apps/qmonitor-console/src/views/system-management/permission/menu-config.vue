<!--  -->
<template>
    <div class="menu-config-container">
        <a-card class="qm-card" :size="antdStore.cardSize">
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
                                :ref="(el:any) => set_input_ref(el, record.id)"
                                :style="dynamic_width(record.id)"
                                :placeholder="`请输入${pathTypeKey[record.path_type][0]}名称`"
                            />
                        </template>
                        <template v-else>
                            <a-tooltip placement="topLeft" :title="record.auth_name">
                                <div >
                                    <span>{{record.auth_name}}</span>
                                </div>
                            </a-tooltip>
                        </template>
                    </template>
                    <template v-if="column.key === 'path'">
                        <template v-if="record.edit && record.edit == 1">
                            <a-input  v-model:value.trim="record.path" :placeholder="`请输入${pathTypeKey[record.path_type][0]}标识`"></a-input>
                        </template>
                        <template v-else>
                            <span>{{text}}</span>
                        </template>
                    </template>
                    <template v-if="column.key === 'path_type'">
                        <template v-if="record.edit && record.edit == 1">
                            <a-select v-model:value="record.path_type" :options="selectObj.path_type_list"></a-select>
                        </template>
                        <template v-else>
                            <a-tag :color="pathTypeKey[text][1]">{{pathTypeKey[text][0]}}</a-tag>
                        </template>
                    </template>
                    <template v-if="column.key === 'icon'">
                        <template v-if="record.edit && record.edit == 1 && record.path_type == 1">
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
                            <template v-if="(record.id || record.id === 0) && !(record.id >= 1000000)" >
                                <a-button type="link" size="small" @click="() => cancel_menu(record)" >取消</a-button>
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="record.path_type == '1'">
                                <a-button type="link" size="small" @click="() => add_sub(record)">添加</a-button>
                            </template>
                            <a-button type="link" size="small" @click="() => edit_menu(record)">修改</a-button>
                        </template>
                        <template v-if="(record.id || record.id === 0) && !(record.id > 1000000)">
                            <a-popconfirm
                                :title="'确认删除 ' + record.auth_name + pathTypeKey[record.path_type][0]+ '?'"
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
import { js_utils_deep_copy } from '@wuefront/utils';
import { useMessage } from '@wuefront/hooks/vue';
import { QIconPicker, QIcon } from '@wuefront/vue3-antd-pc-ui';
import {QTableTreeDrag, TableProps} from '@wuefront/vue3-antd-pc-ui';
import { api_manage_auth_create, api_manage_auth_delete, api_manage_auth_list, api_manage_auth_sort, api_manage_auth_update } from '@/http/api/system-management/permission/menu-config';
import { defineComponent, reactive, toRefs, onMounted, ref, computed, unref } from 'vue';
import { useGlobalStore } from '@/store/modules/global';
import { js_utils_get_table_header_columns } from '@wuefront/utils';
import { useAntdStore } from '@/store/modules/antd';
import type { IMenuData } from '@wuefront/types/vue/router';
interface DataProps {
    sonIds: number[];
    tableData: IMenuData[];
    expandedKeys: number[];
    isTreeShow: boolean;
    customId: number;
    selectObj: ISelectList<'path_type_list'>
}

export default defineComponent({
    name: 'MenuConfig',
    components: {QIconPicker, QIcon, QTableTreeDrag},
    setup() {
        const authNameWidth = 250;
        const store = useGlobalStore();
        const { createMessage } = useMessage();
        const inputDomList = ref<any>({});
        const antdStore = useAntdStore();
        const unRefData = {
            defaultData: {
                auth_name: '', // 名称
                path: '', // 路径
                path_type: 1, //  菜单就是1  功能接口2
                pid: 0, //  上级菜单id，默认顶级为0
                icon: '', // 图标
                children: undefined, // 子菜单
                edit: 1,
                id: 1000000
            },
            tableHeader: js_utils_get_table_header_columns({auth_name: '菜单名称', path: '页面地址', path_type: '类型', icon: '图标', action: '操作' }, {
                alignData: {
                    all: 'left',
                    path_type: 'center',
                    icon: 'center'
                },
                widthData: {
                    action: '150px',
                    icon: '160px',
                    path_type: '80px',
                    auth_name: `${authNameWidth}px`
                }
            }),
            tempMenu: { auth_name: '', path: '', icon: '', path_type: 1 },
            pathTypeKey: {
                1: ['页面', 'orange'],
                2: ['接口', 'red'],
                3: ['按钮', 'pink']
            } as Record<number, string[]>
        };
        const data: DataProps = reactive({
            expandedKeys: [],
            tableData: [],
            isTreeShow: false,
            sonIds: [],
            customId: 1000000,
            selectObj: {
                path_type_list: Object.entries(unRefData.pathTypeKey).map(item => ({value: parseInt(item[0]), label: item[1][0]}))
            }
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
            const _res = await api_manage_auth_list();
            if (_res.code == 200) {
                data.tableData = _res.data.list;
                data.isTreeShow = true;
            }
        };
        const add_first_level_menu = () => {
            //  添加一级菜单
            const _data = js_utils_deep_copy(unRefData.defaultData);
            _data.id = data.customId++;
            data.tableData.push(_data);
            scroll_to_input(_data);
        };
        const add_sub = (obj: IMenuData) => {
            const _data = js_utils_deep_copy(unRefData.defaultData);
            _data.id = data.customId++;
            _data.pid = obj.id || 0;
            _data.path_type = 1;
            if (!obj.children) {
                obj.children = [_data];
            } else {
                obj.children.push(_data);
            }
            if (obj.id && !data.expandedKeys.includes(obj.id)) {
                data.expandedKeys.push(obj.id);
            }
            console.log(_data);
            scroll_to_input(_data);
        };
        const set_input_ref = (el: any, id: any) => {
            inputDomList.value[id] = el;
        };
        const scroll_to_input = (data: IMenuData) => {
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
        const save_menu = (obj: IMenuData) => {
            //  保存菜单
            if (!obj.auth_name || obj.auth_name.trim() == '') {
                createMessage.error('标题不能为空');
                return false;
            }
            if (!obj.path || obj.path.trim() == '') {
                createMessage.error('页面地址不能为空');
                return false;
            }
            const _data = {
                auth_name: obj.auth_name,
                path: obj.path,
                pid: obj.pid || 0,
                path_type: obj.path_type,
                icon: obj.icon,
                id: obj.id
            };
            if (_data.id && _data.id >= 1000000) {
                delete _data.id;
                store.pageLoading = true;
                api_manage_auth_create(_data).then((res) => {
                    if (res.code == 200) {
                        obj.edit = 0;
                        obj.id = res.data.id;
                        obj.auth_name = _data.auth_name;
                        obj.path = _data.path;
                        obj.pid = _data.pid;
                        obj.icon = _data.icon;
                        create_message(_data, 'add');
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
                        create_message(_data, 'edit');
                    } else {
                        front_remove_menu(obj, data.tableData);
                    }
                });
            }
        };
        // 删除菜单
        const delete_menu = (obj: IMenuData) => {
            if (obj.id && obj.id >= 1000000) {
                front_remove_menu(obj, data.tableData);
                create_message(obj, 'del');
            } else {
                api_manage_auth_delete({ id: obj.id! }).then((res) => {
                    if (res.code == 200) {
                        front_remove_menu(obj, data.tableData);
                        create_message(obj, 'del');
                    }
                });
            }
        };
        const create_message = (obj:IMenuData, type: 'add' | 'edit' | 'del') => {
            const _typeObj = {
                'add': '添加',
                'edit': '修改',
                'del': '删除'
            };
            const _msg = unRefData.pathTypeKey[obj.path_type!][0];
            createMessage.success(`${_msg}${_typeObj[type]}成功, 请重新刷新页面以使配置生效`);
        };
        // 编辑菜单
        const edit_menu = (obj: IMenuData) => {
            console.log({dataRef: obj});
            unRefData.tempMenu = {
                auth_name: obj.auth_name || '',
                path: obj.path || '',
                icon: obj.icon || '',
                path_type: obj.path_type || 1
            };
            obj.edit = 1;
        };
        // 取消添加、编辑菜单或接口
        const cancel_menu = (obj: IMenuData) => {
            obj.edit = 0;
            obj.auth_name = unRefData.tempMenu.auth_name;
            obj.path = unRefData.tempMenu.path;
            obj.icon = unRefData.tempMenu.icon;
            obj.path_type = unRefData.tempMenu.path_type;
        };
        // 排序
        const handel_table_drag = (dataObj: Record<'tableList'|'parentData'|'targetData', any>) => {
            // data.tableData = dataObj.tableList;
            let _parentId;
            if (dataObj.parentData && Object.keys(dataObj.parentData).length === 0) {
                _parentId = 0;
            } else {
                _parentId = dataObj.parentData.id;
            }
            if (_parentId === 0) {
                data.sonIds = dataObj.tableList.map((item: any) => item.id);
            } else {
                get_node_by_id(_parentId, dataObj.tableList);
            }
            api_manage_auth_sort({
                pid: _parentId,
                first_auth_id_arr: data.sonIds
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
        const front_remove_menu = (data: IMenuData, arr: IMenuData[], parentData?: IMenuData) => {
            arr.some((_n, i) => {
                if (arr[i].id === data.id) {
                    arr.splice(i, 1);
                    if (parentData && arr.length === 0 && parentData.children) {
                        parentData.children = undefined;
                    }
                    return true;
                } else if (arr[i].children && arr[i].children!.length > 0) {
                    front_remove_menu(data, arr[i].children!, arr[i]);
                }
            });
        };
        // 递归获取指定id节点下的所有一级子节点
        const get_node_by_id = (id: number, arr: IMenuData[]) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id) {
                    data.sonIds = arr[i].children!.map((item: IMenuData) => item.id!);
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
            antdStore,
            inputDomList,
            tableOption,
            set_input_ref,
            add_first_level_menu,
            add_sub,
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
