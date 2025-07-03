<template>
    <div >
        <div >
            <a-button @click="reloadTable"> 还原 </a-button>
            <a-button @click="changeLoading"> 开启loading </a-button>
            <a-button @click="changeColumns"> 更改Columns </a-button>
            <a-button @click="getColumn"> 获取Columns </a-button>
            <a-button @click="getTableData"> 获取表格数据 </a-button>
            <a-button  @click="getTableRawData"> 获取接口原始数据 </a-button>
            <a-button @click="setPaginationInfo"> 跳转到第2页 </a-button>
            <a-button @click="addTableData"> 添加表格数据 </a-button>
        </div>
        <div class="mb-4">
            <a-button @click="getSelectRowList"> 获取选中行 </a-button>
            <a-button @click="getSelectRowKeyList"> 获取选中行Key </a-button>
            <a-button @click="setSelectedRowKeyList"> 设置选中行 </a-button>
            <a-button @click="clearSelect"> 清空选中行 </a-button>
            <a-button @click="getPagination"> 获取分页信息 </a-button>
            <a-button @click="collapseAll"> 展开 </a-button>
        </div>
        <q-antd-table @register="registerTable" @edit-end="handlerEdit" @edit-row-end="handlerEdit">
            <template #form-slot>
                12312312312
            </template>
            <template #headerTop>
                <alert type="info" show-icon>
                    <template #message>
                        <span>未选中任何项目</span>
                    </template>
                </alert>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <q-antd-table-action :actions="createActions(record, column)" />
                </template>
            </template>
        </q-antd-table>
        <edit @register="registerDrawer"></edit>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import {Alert} from 'ant-design-vue';
import { useTable, useDrawer, QAntdTable, QAntdTableAction } from '@quantum-design/vue3-antd-pc-ui';
import { useMessage } from '@quantum-design/hooks/vue/use-message';
import { getBasicColumns, getBasicData } from './tableData';
import edit from './components/edit.vue';
import dayjs from 'dayjs';
import { gDateFormatEnum } from '@quantum-design/shared/enums';
export default defineComponent({
    name: 'FormTable',
    components: { Alert, edit, QAntdTable, QAntdTableAction },
    setup() {
        const { createMessage } = useMessage();
        function onChange() {
            console.log('onChange', arguments);
        }
        const data = reactive({
            selectObj: {} });
        const schemas = computed(() => {
            return [{field: `key_word`,
                label: `Slot示例`,
                component: 'Input',
                slot: 'slot'
            }, {
                label: '日期',
                field: 'duration',
                component: 'RangePicker',
                defaultValue: [dayjs().subtract(7, 'day').startOf('month'), dayjs().subtract(1, 'day')]
            }, {
                label: '接入模式',
                field: 'access_mode',
                component: 'Select',
                componentProps: {
                    options: data.selectObj.access_mode_list
                }
            }];
        });
        const dataSource = ref([]);
        const [
            registerTable,
            {
                setLoading,
                setProps,
                getColumns,
                getDataSource,
                getRawDataSource,
                reload,
                getPaginationRef,
                setPagination,
                getSelectRows,
                getSelectRowKeys,
                setSelectedRowKeys,
                clearSelectedRowKeys,
                insertTableDataRecord
            }
        ] = useTable({
            canResize: true,
            title: 'QTable示例',
            titleHelpMessage: '使用useTable调用表格内方法',
            immediate: true,
            useSearchForm: true,
            formConfig: {
                layout: 'inline',
                schemas,
                fieldMapToTime: [['duration', ['start', 'end'], gDateFormatEnum.date]]
            },
            scroll: {x: 2000 },
            columns: getBasicColumns(),
            dataSource: dataSource,
            // dataSource: getBasicData(),
            autoCreateKey: true,
            summaryConfig: {
                fixed: 'top'
            },
            columnsConfig: {
                sortData: ['partner_id'],
                widthData: {
                    name: 200
                }
            },
            fetchSetting: {
                totalField: 'pagination.count'
            },
            showTableSetting: true,
            onChange,
            rowSelection: {
                type: 'checkbox'
            },
            onColumnsChange: (data: ColumnChangeParam[]) => {
                console.log('ColumnsChanged', data);
            }

        });

        const [registerDrawer, {openDrawer }] = useDrawer();

        function changeLoading() {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
        function changeColumns() {
            const _column = [
                {
                    'title': '合作平台ID',
                    'key': 'partner_id',
                    'dataIndex': 'partner_id',
                    'width': 150,
                    'resizable': true,
                    'align': 'center',
                    'fixed': '',
                    'sorter': true,
                    'customCell': null,
                    'ellipsis': true,
                    children: [
                        {
                            'title': '合作平台Code',
                            'key': 'partner_code',
                            'dataIndex': 'partner_code',
                            'width': 150,
                            'resizable': true,
                            'align': 'center',
                            'fixed': '',
                            'sorter': false,
                            'customCell': null,
                            'ellipsis': true
                        },
                        {
                            'title': '合作平台名称',
                            'key': 'name',
                            'dataIndex': 'name',
                            'width': 200,
                            'resizable': true,
                            'align': 'center',
                            'fixed': '',
                            'sorter': false,
                            'customCell': null,
                            'editRule': true,
                            'helpMessage': '你好',
                            'editRow': true,
                            'editComponent': 'Input',
                            'ellipsis': true
                        } ]
                }
            ];
            setProps({
                columns: _column
            });
        }
        function reloadTable() {
            // setProps({
            //     columns: getBasicColumns(),
            //     rowSelection: {
            //         type: 'checkbox'
            //     },
            //     showIndexColumn: true
            // });
            reload({
                page: 1
            });
        }
        function getColumn() {
            createMessage.info('请在控制台查看！');
            console.log(getColumns());
        }

        function getTableData() {
            createMessage.info('请在控制台查看！');
            console.log(getDataSource());
        }

        function getTableRawData() {
            createMessage.info('请在控制台查看！');
            console.log(getRawDataSource());
        }

        function getPagination() {
            createMessage.info('请在控制台查看！');
            console.log(getPaginationRef());
        }

        function setPaginationInfo() {
            setPagination({
                current: 2
            });
            reload();
        }
        function getSelectRowList() {
            createMessage.info('请在控制台查看！');
            console.log(getSelectRows());
        }
        function getSelectRowKeyList() {
            createMessage.info('请在控制台查看！');
            console.log(getSelectRowKeys());
        }
        function setSelectedRowKeyList() {
            setSelectedRowKeys(['0', '1', '2']);
        }
        function clearSelect() {
            clearSelectedRowKeys();
        }
        function handlerEdit(e) {
            console.log(e);
        }

        function createActions(record, column) {
            if (!record.editable) {
                return [
                    {
                        label: '编辑1',
                        onClick: () => {
                            record.onEdit();
                            console.log('编辑');
                        }
                    }, {
                        label: '编辑2',
                        onClick: () => {
                            openDrawer();
                        }
                    }
                ];
            }
            return [
                {
                    label: '保存',
                    onClick: () => {
                        record.onSubmit();
                        console.log('保存');
                    }
                },
                {
                    label: '取消',
                    popConfirm: {
                        title: '是否取消编辑',
                        confirm: () => {
                            record.onCancel();
                            console.log('取消');
                        }
                    }
                }
            ];
        }

        function collapseAll() {
            setProps({
                ellipsis: false
            });
        }

        function addTableData() {
            dataSource.value.push({
                id: Math.random(),
                name: '123',
                age: 123
            });
            console.log(dataSource.value);
            // insertTableDataRecord({
            //     partner_id: '123',
            //     partner_code: '123',
            //     name: '123'
            // });
        }

        return {
            registerTable,
            handlerEdit,
            changeLoading,
            changeColumns,
            reloadTable,
            getColumn,
            getTableData,
            getTableRawData,
            getPagination,
            setPaginationInfo,
            getSelectRowList,
            getSelectRowKeyList,
            setSelectedRowKeyList,
            clearSelect,
            onChange,
            collapseAll,
            createActions,
            addTableData,
            registerDrawer
        };
    }
});
</script>

