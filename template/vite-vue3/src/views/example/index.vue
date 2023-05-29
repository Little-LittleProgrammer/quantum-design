<!--  -->
<template>
    <div>
        <a-card class="g-card" :size="antdStore.cardSize">
            <q-form @register="register"></q-form>
        </a-card>
        <a-card class="g-card mt" :size="antdStore.cardSize">
            <a-table rowKey="age" :size="antdStore.tableSize" :pagination="false" :columns="data.tableData.header" :dataSource="getPaginationList">
                <template #bodyCell="{record, column, index}">
                    <template v-if="column.key==='action'">
                        <q-table-action :actions="create_table_actions(record, index)"></q-table-action>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-card class="g-card mt" :size="antdStore.cardSize">
            <q-table-pagination :pageOption="getPageOption"></q-table-pagination>
        </a-card>
        <edit @register="registerDrawer"></edit>
    </div>
</template>

<script lang='ts' setup>
import { computed, reactive } from 'vue'
import { IExampleData, IExampleDataTableData } from './interface';
import { FormSchema, QForm, useForm, QTableAction ,ActionItem, useDrawer, QDrawer, QTablePagination, PaginationProps } from '@wuefront/vue3-antd-ui'
import { usePagination } from '@wuefront/hooks/vue'
import { useGlobalStore } from '@/store/modules/global';
import { js_tools_get_table_header_columns } from '@/assets/ts/tools';
import { useAntdStore } from '@/store/modules/antd';
import { useDrawerClose } from '@/hooks/web/use-drawer-close';
import edit from './components/edit.vue'
interface IDataProps {
    tableData: IExampleDataTableData;
    pageOption: IPageOption

}
const data: IDataProps = reactive({
    tableData: {
        header: [],
        list: []
    },
    pageOption: {
        current: 1,
        pageSize: 10,
        total: 0
    }
})
const  getTableList = computed(() => {
    return data.tableData.list
})
const globalStore = useGlobalStore()
const antdStore = useAntdStore()
const {getTotal, getPaginationList, setCurrentPage, setPageSize} = usePagination(getTableList, data.pageOption.pageSize)
const schemas = computed<FormSchema<IExampleData>[]>(() => [{
    label: '名字',
    field: 'name',
    component: 'Input'
}, {
    label: '年龄',
    field: 'age',
    component: 'InputNumber'
}])
const [register] = useForm({
    schemas,
    layout: 'inline',
    submitFunc: () => init_data()
})

const [registerDrawer, {openDrawer, setDrawerProps, closeDrawer, getVisible}] = useDrawer();

async function init_data() {
    globalStore.pageLoading = true 
    const _res = await (function() {
        return new Promise<Result<ITableData<keyof IExampleData>>>((resolve) => {
            setTimeout(() => {
                globalStore.pageLoading = false; // 实际情况不需要
                const _list = new Array(100).fill(1).map((_item, index) => ({name: 'a'+index, age: index+1}))
                resolve({
                    code: 200,
                    data: {
                        header: js_tools_get_table_header_columns({
                            name: '名字',
                            age: '年龄',
                            action: '操作'
                        }),
                        list: _list
                    },
                    msg: 'success'
                })
            }, 1000)
        }) 
    })();
    if (_res.code === 200) {
        data.tableData.header = _res.data.header;
        data.tableData.list = _res.data.list;
    }
}

function create_table_actions(record: IExampleData, index: number):ActionItem[] {
    return [{
        label: '编辑',
        onClick: () => {
            setDrawerProps({
                title: '编辑'
            })
            openDrawer(true, record)
        }
    }, {
        label: '删除',
        popConfirm: {
            title: '是否确认删除',
            confirm: () => {
                data.tableData.list.splice(index, 1)
            }
        }
    }]
}

const getPageOption = computed<PaginationProps>(() => {
    return {
        ...data.pageOption,
        total: getTotal.value,
        onChange: (page: number, size: number) => {
            setPageSize(size);
            data.pageOption.pageSize = size;
            setCurrentPage(page),
            data.pageOption.current = page
        }
    }
})

useDrawerClose({getVisible, closeDrawer})

</script>
<style lang='scss' scoped>
</style>