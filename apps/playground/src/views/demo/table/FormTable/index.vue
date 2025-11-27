<template>
    <div>
        <div>
            <a-button @click="reloadTable"> 还原 </a-button>
            <a-button @click="changeLoading"> 开启loading </a-button>
            <a-button @click="changeColumns"> 更改Columns </a-button>
            <a-button @click="getColumn"> 获取Columns </a-button>
            <a-button @click="getTableData"> 获取表格数据 </a-button>
            <a-button @click="getTableRawData"> 获取接口原始数据 </a-button>
            <a-button @click="setPaginationInfo"> 跳转到第2页 </a-button>
            <a-button @click="getSelectRowList"> 获取选中行 </a-button>
            <a-button @click="getSelectRowKeyList"> 获取选中行Key </a-button>
            <a-button @click="setSelectedRowKeyList"> 设置选中行 </a-button>
            <a-button @click="clearSelect"> 清空选中行 </a-button>
            <a-button @click="getPagination"> 获取分页信息 </a-button>
            <a-button @click="collapseAll"> 展开 </a-button>
            <a-button @click="updateSetting"> 操作按钮悬浮切换 </a-button>
        </div>
        <q-antd-table @register="registerTable" @edit-end="handlerEdit" @edit-row-end="handlerEdit" @formExpandChange="handle_form_expand_change" @change="handle_table_change" @formCustomFilterChange="handle_form_custom_filter_change">
            <template #form-slot> 12312312312 </template>
            <!-- <template #headerTop>
                <alert type="info" show-icon>
                    <template #message>
                        <span v-if="getSelectRows().length > 0">已选中{{ getSelectRows().length }}项</span>
                        <span v-else>未选中任何项目</span>
                    </template>
                </alert>
            </template> -->
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <q-antd-table-action :actions="createActions(record, column)" />
                </template>
            </template>
            <template #paginationButton>
                <a-button>这是按钮A</a-button>
                <a-button>这是按钮BBBB</a-button>
                <a-button>这是长按钮啦啦啦啦</a-button>
            </template>
        </q-antd-table>
        <edit @register="registerDrawer"></edit>
        <base-modal />
    </div>
</template>
<script lang="ts" setup>
import { computed, h, ref, reactive } from 'vue';
import { useTable, useDrawer, QAntdTable, QAntdTableAction, useQAntdModal, type ColumnChangeParam } from '@quantum-design/vue3-antd-pc-ui';
import { useMessage } from '@quantum-design/hooks/vue/use-message';
import edit from './components/edit.vue';
import dayjs from 'dayjs';
import BaseDemo from '@/views/demo/modal/base-demo.vue';
import { getBasicColumns, getBasicData } from './tableData';

const defaultDuration = [dayjs().subtract(30, 'day'), dayjs()];

const { createMessage } = useMessage();

function onChange() {
    console.log('onChange', arguments);
}

const [BaseModal, baseModalApi] = useQAntdModal({
    // 连接抽离的组件
    connectedComponent: BaseDemo,
});

const data = reactive({
    selectObj: {
        access_mode_list: [
            {
                label: '1',
                value: '1',
            },
            {
                label: '2',
                value: '2',
            },
        ],
    },
});

const testSelectObj = ref({
    access_mode_list: [
        {
            label: '1',
            value: '1',
        },
    ],
});

const schemas = computed(() => {
    return [
        { field: `key_word`, label: `Slot示例`, component: 'Input', slot: 'slot' },
        {
            label: '日期',
            field: 'duration',
            component: 'RangePicker',
            defaultValue: defaultDuration,
            alwaysVisible: true,
        },
        {
            label: '接入模式',
            field: 'access_mode',
            component: 'Select',
            componentProps: {
                options: data.selectObj.access_mode_list,
            },
        },
        {
            label: '操作时间',
            field: 'operateTime',
            component: 'RangePicker',
            defaultValue: ['2025-08-01', '2025-08-02'],
            componentProps: {
                valueFormat: 'YYYY-MM-DD',
                format: 'YYYY-MM-DD',
                placeholder: ['开始日期', '结束日期'],
                onChange: (_value: any) => {
                    reload();
                },
            },
        },
        {
            label: '授权渠道',
            field: 'reader_cp_id',
            component: 'Cascader',
            componentProps: {
                placeholder: '全部',
                options: testSelectObj.value.access_mode_list,
                allowClear: true,
                class: 'w-250',
                showSearch: true,
            },
        },
    ];
});

const floating = ref(true);

const [registerTable, { setLoading, setColumns, setProps, getColumns, getDataSource, getRawDataSource, reload, getPaginationRef, setPagination, getSelectRows, getSelectRowKeys, setSelectedRowKeys, clearSelectedRowKeys }] = useTable({
    canResize: true,
    titleHelpMessage: '使用useTable调用表格内方法',
    // title: 'demo',
    immediate: true,
    useSearchForm: true,
    formConfig: {
        layout: 'inline',
        schemas,
        enableCustomFilter: true,
        formId: 'form-table',
        // fieldMapToTime: [['duration', ['start', 'end'], gDateFormatEnum.date]],
    },
    resizable: true,
    tableSetting: {
        cache: true,
        floating: floating.value,
    },
    columnsConfig: {
        widthData: {
            created_at: 180,
            auth_result: 180,
            check_result: 180,
            lock_result: 180,
            reader_cp_name: 180,
        },
        fixedData: {
            operateTime: 'left',
            partner_cp_name: 'left',
            reader_cp_name: 'left',
        },
    },

    scroll: { x: true },
    virtual: true,
    columns: getBasicColumns(),
    dataSource: getBasicData(),
    autoCreateKey: true,
    summaryConfig: {
        fixed: 'top',
    },
    expandedRowRender(_record) {
        return h('div', '123123123');
    },
    showTableSetting: true,
    onChange,
    rowSelection: {
        type: 'checkbox',
    },
    onColumnsChange: (data: ColumnChangeParam[]) => {
        console.log('ColumnsChanged', data);
    },
    useExtraComponents: [
        {
            component: 'CustomExtraComp',
            componentProps: {
                text: '外部传入：自定义注册组件，查看表格数据',
            },
        },
    ],
});

const [registerDrawer, { openDrawer }] = useDrawer();

function changeLoading() {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
    }, 1000);
}

function changeColumns() {
    setColumns(['name', 'age', 'address']);
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
        page: 1,
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
        current: 2,
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

function handlerEdit(e: any) {
    console.log(e);
}

function createActions(record: any, _column: any) {
    if (!record.editable) {
        return [
            {
                label: '弹窗',
                onClick: () => {
                    baseModalApi.open();
                },
            },
            {
                label: '抽屉',
                onClick: () => {
                    openDrawer();
                },
            },
        ];
    }
    return [
        {
            label: '保存',
            onClick: () => {
                record.onSubmit();
                console.log('保存');
            },
        },
        {
            label: '取消',
            popConfirm: {
                title: '是否取消编辑',
                confirm: () => {
                    record.onCancel();
                    console.log('取消');
                },
            },
        },
    ];
}

function collapseAll() {
    setProps({
        ellipsis: false,
    });
}

function handle_form_expand_change(expandStatus: boolean) {
    console.log('expandStatus==>', expandStatus);
}

function updateSetting() {
    setProps({
        tableSetting: {
            floating: !floating.value,
        },
    });
    floating.value = !floating.value;
}

function handle_table_change(...args: any) {
    console.log('handle_table_change', args);
}

function handle_form_custom_filter_change(config: any) {
    console.log('handle_form_custom_filter_change', config);
}
</script>
