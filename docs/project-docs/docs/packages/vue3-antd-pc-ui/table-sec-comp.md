# table

对 a-table 一些常用功能的二次封装

:::tip
table 子组件，请看[table-sec-comp](./table-sec-comp.md)
:::

## table-action

对表格操作栏进行了封装

### 使用

```vue
<template #action="{ record }">
    <TableAction :actions="create_actions(record)" />
</template>

<script lang='ts'>
import { ActionItem } from '@/components/table/interface';
...
const create_actions = (record: T): ActionItem[] => {
    return [
        {
            label: '编辑',
            onClick: open_edit_modal.bind(null, record)
        },
        {
            label: '删除',
            popConfirm: {
                title: '是否确认删除',
                confirm: del_adv_code.bind(null, record)
            }
        }
    ];
};
// 打开编辑界面
const open_edit_modal = (record?: IRecordData) => {
    data.editData.visible = true;
    data.editData.formData = {};
    if (record) {
        data.editData.formData = record;
    }
};

// 删除
const del_adv_code = async(record: IRecordData) => {
    const { id } = record;
    store.commit('global/SET_PAGE_LOADING_STATUS', true);
    const _res = await api_adv_code_del({ id: id as string });
    if (_res.code == 200) {
        createMessage.success('删除成功');
        init_data();
    }
};
</script>
```

### API
**TableAction.action**
| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| isShow | `boolean \| (function => boolean)` | true   |  -   | 此属性是否展示, 或者满足什么条件才展示 |
| tooltip | `object \| string` |  -   |  -   | 属性与[a-tooltip](https://2x.antdv.com/components/tooltip-cn#API)保持一致, 当为字符串时,表示标题 |
| popConfirm | `object ` |  -   |  -   | 属性与[a-popconfirm](https://2x.antdv.com/components/popconfirm-cn#API)保持一致,`confirm, cancel`如需传参, 使用bind函数 |
| label | `string ` |  -   |  -   | 按钮文案 |
| icon | `string ` |  -   |  -   | 按钮图标 |
| ... | `... ` |  -   |  -   | 剩下的与 [a-button](https://2x.antdv.com/components/button-cn#API) 属性保持一致|

## table-pagination

### 使用
```vue

<table-pagination :pageOption="create_page_option()">
    <template #>
        <a-button type="primary" @click="open_edit_modal()"> + 新增广告位</a-button>
    </template>
</table-pagination>

<script lang='ts'>
import { PaginationProps } from 'ant-design-vue/lib/pagination';
pageOption: {
    current: 1,
    pageSize: 10,
    total: 0
},
const create_page_option = (): PaginationProps => {
    return {
        ...data.pageOption,
        onChange: option_change
    };
};
const option_change = (val: number, size:number) => {
    const _req = {
        ...data.formData,
        page: val,
        page_size: size
    };
    init_data(_req);
};
</script>
```

### API

| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| - | `slot` | true   |  -   | 左侧区域显示 |

**table-pagination. pageOption**

与[a-pagination](https://2x.antdv.com/components/pagination-cn#API)属性保持一致

## table-tree-drag
可拖拽 树形表格

### 使用
```vue
<template>
    <q-table-tree-drag v-model:expandedRowKeys="expandedKeys" :table-options="tableOption" @refreshTable="handel_table_drag">
          <template #bodyCell="{ text, record, column }">
            自定义表格
          </template>
    </q-table-tree-drag>
</template>

<script lang="ts">
    export default defineComponent({
        setup() {
            const expandedKeys =ref<string[]>([])
            const tableOption = computed((): TableProps => {
                return {
                    columns: unRefData.tableHeader,
                    dataSource: data.tableData,
                    rowKey: 'id',
                    size: 'small'
                };
            });
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
        }
    })
</script>

```

### API
```js
props: {
    tableOptions: {
        type: Object as PropType<TableProps>,
        default: () => {}
    },
    expandedRowKeys: {
        type: Array as PropType<string[]>,
        default: () => []
    }
}
```