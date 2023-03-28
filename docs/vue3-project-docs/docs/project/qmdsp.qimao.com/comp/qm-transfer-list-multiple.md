# 多选表格穿梭框 组件

## 功能
左侧展示表格 表格可以多选 右侧展示选中项的详细信息

## 展示

<script setup>
    import { reactive } from 'vue';
    import QmTransferListMultiple from '@components/qmdsp.qimao.com/qm-transfer-list-multiple/index.vue';
    const code = 
    `
    <div class="test-component">
        <qm-transfer-list-multiple ref="qmTransferListMultipleRefs" v-model="data.selectedRowKeys" @changeRowSelection="changeRowSelection" :field="data.field" :tableOptions="data.tableOptions" :showSearch="true" :searchKey="['campaign_name']">
        </qm-transfer-list-multiple>
    </div>
    <script setup>
        const data = reactive({
            searchFormData: {
                key_word: ''
            },
            field: 'campaign_name',
            pageOption: {
                current: 1,
                pageSize: 9999,
                total: 0
            },
            selectedRows: [],
            selectedRowKeys: [],
            tableOptions: {
                rowKey: 'campaign_id',
                columns: [
                    {
                        "title": "广告计划名称或ID",
                        "key": "campaign_name",
                        "dataIndex": "campaign_name",
                        "width": "80%",
                        "align": "left",
                        "fixed": "",
                        "sorter": false,
                        "customCell": null,
                        "ellipsis": true
                    },
                    {
                        "title": "营销目标",
                        "key": "target_type_text",
                        "dataIndex": "target_type_text",
                        "width": "20%",
                        "align": "left",
                        "fixed": "",
                        "sorter": false,
                        "customCell": null
                    }
                ],
                dataSource: [
                    {
                        "campaign_id": 10000002133,
                        "campaign_name": "1234",
                        "status": 3,
                        "status_text": "删除",
                        "target_type": 1,
                        "target_type_text": "落地页",
                        "imp_num": "",
                        "clk_num": "",
                        "cost": "",
                        "clk_rate": "",
                        "avg_cpc": 0,
                        "cpm": 0,
                        "daily_budget": 0,
                        "budget_type": 1,
                        "active": 3,
                        "budget_mode": 1
                    },
                {
                        "campaign_id": 10000001647,
                        "campaign_name": "Android应用2022_12_30_11:03:16",
                        "status": 4,
                        "status_text": "账户未生效",
                        "target_type": 2,
                        "target_type_text": "安卓应用",
                        "imp_num": "",
                        "clk_num": "",
                        "cost": "",
                        "clk_rate": "",
                        "avg_cpc": 0,
                        "cpm": 0,
                        "daily_budget": 0,
                        "budget_type": 1,
                        "active": 1,
                        "budget_mode": 1
                    },
                    {
                        "campaign_id": 10000002109,
                        "campaign_name": "1",
                        "status": 4,
                        "status_text": "账户未生效",
                        "target_type": 1,
                        "target_type_text": "落地页",
                        "imp_num": "",
                        "clk_num": "",
                        "cost": "",
                        "clk_rate": "",
                        "avg_cpc": 0,
                        "cpm": 0,
                        "daily_budget": 0,
                        "budget_type": 1,
                        "active": 1,
                        "budget_mode": 1
                    },
                    {
                        "campaign_id": 10000002029,
                        "campaign_name": "ccc1",
                        "status": 4,
                        "status_text": "账户未生效",
                        "target_type": 1,
                        "target_type_text": "落地页",
                        "imp_num": "",
                        "clk_num": "",
                        "cost": "",
                        "clk_rate": "",
                        "avg_cpc": 0,
                        "cpm": 0,
                        "daily_budget": 0,
                        "budget_type": 1,
                        "active": 1,
                        "budget_mode": 1
                    },
                    {
                        "campaign_id": 10000001750,
                        "campaign_name": "IOS应用2022_12_30_14:22:31",
                        "status": 4,
                        "status_text": "账户未生效",
                        "target_type": 3,
                        "target_type_text": "iOS应用",
                        "imp_num": "",
                        "clk_num": "",
                        "cost": "",
                        "clk_rate": "",
                        "avg_cpc": 0,
                        "cpm": 0,
                        "daily_budget": 0,
                        "budget_type": 1,
                        "active": 1,
                        "budget_mode": 1
                    }
                ]
            },
            pageOptions: {}
        });

        function changeRowSelection(selectedRowKeys, selectedRows) {
            console.log(selectedRowKeys, selectedRows, 'changeRowSelection');
        }
    <\/script>
    <style lang="scss" scoped>
        .test-component {
            width: 100%;
            :deep(.qm-transfer-list-multiple) {
                width: 100%;
                table {
                    margin: 0;
                    tr:nth-child(2n) {
                        background-color: initial;
                    }
                    th, td {
                        border: initial;
                    }
                }
                .right {
                    .body {
                        ul {
                            margin: initial;
                            padding: initial;
                        }
                    }
                }
            }
            .test-btn {
                margin-top: 20px;
            }
        }
    <\/style>`;

const data = reactive({
    searchFormData: {
        key_word: ''
    },
    field: 'campaign_name',
    pageOption: {
        current: 1,
        pageSize: 9999,
        total: 0
    },
    selectedRows: [],
    selectedRowKeys: [],
    tableOptions: {
        rowKey: 'campaign_id',
        columns: [
            {
                "title": "广告计划名称或ID",
                "key": "campaign_name",
                "dataIndex": "campaign_name",
                "width": "80%",
                "align": "left",
                "fixed": "",
                "sorter": false,
                "customCell": null,
                "ellipsis": true
            },
            {
                "title": "营销目标",
                "key": "target_type_text",
                "dataIndex": "target_type_text",
                "width": "20%",
                "align": "left",
                "fixed": "",
                "sorter": false,
                "customCell": null
            }
        ],
        dataSource: [
            {
                "campaign_id": 10000002133,
                "campaign_name": "1234",
                "status": 3,
                "status_text": "删除",
                "target_type": 1,
                "target_type_text": "落地页",
                "imp_num": "",
                "clk_num": "",
                "cost": "",
                "clk_rate": "",
                "avg_cpc": 0,
                "cpm": 0,
                "daily_budget": 0,
                "budget_type": 1,
                "active": 3,
                "budget_mode": 1
            },
           {
                "campaign_id": 10000001647,
                "campaign_name": "Android应用2022_12_30_11:03:16",
                "status": 4,
                "status_text": "账户未生效",
                "target_type": 2,
                "target_type_text": "安卓应用",
                "imp_num": "",
                "clk_num": "",
                "cost": "",
                "clk_rate": "",
                "avg_cpc": 0,
                "cpm": 0,
                "daily_budget": 0,
                "budget_type": 1,
                "active": 1,
                "budget_mode": 1
            },
            {
                "campaign_id": 10000002109,
                "campaign_name": "1",
                "status": 4,
                "status_text": "账户未生效",
                "target_type": 1,
                "target_type_text": "落地页",
                "imp_num": "",
                "clk_num": "",
                "cost": "",
                "clk_rate": "",
                "avg_cpc": 0,
                "cpm": 0,
                "daily_budget": 0,
                "budget_type": 1,
                "active": 1,
                "budget_mode": 1
            },
            {
                "campaign_id": 10000002029,
                "campaign_name": "ccc1",
                "status": 4,
                "status_text": "账户未生效",
                "target_type": 1,
                "target_type_text": "落地页",
                "imp_num": "",
                "clk_num": "",
                "cost": "",
                "clk_rate": "",
                "avg_cpc": 0,
                "cpm": 0,
                "daily_budget": 0,
                "budget_type": 1,
                "active": 1,
                "budget_mode": 1
            },
            {
                "campaign_id": 10000001750,
                "campaign_name": "IOS应用2022_12_30_14:22:31",
                "status": 4,
                "status_text": "账户未生效",
                "target_type": 3,
                "target_type_text": "iOS应用",
                "imp_num": "",
                "clk_num": "",
                "cost": "",
                "clk_rate": "",
                "avg_cpc": 0,
                "cpm": 0,
                "daily_budget": 0,
                "budget_type": 1,
                "active": 1,
                "budget_mode": 1
            }
        ]
    },
    pageOptions: {}
});

function changeRowSelection(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows, 'changeRowSelection');
}
</script>

<style lang="scss" scoped>
.test-component {
    width: 100%;
    :deep(.qm-transfer-list-multiple) {
        width: 100%;
        table {
            margin: 0;
            tr:nth-child(2n) {
                background-color: initial;
            }
            th, td {
                border: initial;
            }
        }
        .qm-transfer-list-multiple-body-wrapper-right {
            &-body {
                ul {
                    margin: initial;
                    padding: initial;
                }
            }
        }
    }
    .test-btn {
        margin-top: 20px;
    }
}
</style>
<codeView title="基本用法" description="左侧展示表格 表格可以多选 右侧展示选中项的详细信息">
    <div class="test-component">
        <qm-transfer-list-multiple ref="qmTransferListMultipleRefs" v-model="data.selectedRowKeys" @changeRowSelection="changeRowSelection" :field="data.field" :tableOptions="data.tableOptions" :showSearch="true" :searchKey="['campaign_name']">
        </qm-transfer-list-multiple>
    </div>
    <template #codeText>
        <highlight-code :code="code"></highlight-code>
    </template>
</codeView>

## API
| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| value(v-model) | `number[]` |  -  |  -   | 表格勾选的数据的 key 数组 |
| tableOptions | `TableProps` |  -   |  -   | 表格相关的参数，可参考antd Table 表格 组件 |
| field | `string` |  -   |  -   | 右侧想要展示的字段类型 |
| showSearch | `boolean` |  false   |  -   | 是否显示搜索框 |
| searchKey | `string[]` |  id   |  -   | 按照哪个字段名进行搜索 |
| placeholder | `string` |  请输入   |  -   | 占位符 |
| searchInput | `slot` |  -   |  -   | 搜索框占位 |
| headerCell | `v-slot:headerCell="{title, column}"` |  -   |  -   | antd Table 表格 组件 headerCell插槽 |
| bodyCell | `v-slot:bodyCell="{text, record, index, column}"` |  -   |  -   | antd Table 表格 组件 headerCell插槽 |
| field | `v-slot:field="item"` |  -   |  -   | 右侧 当前选中行的数据 |

### 事件
| 事件名称   |                 说明                | 回调参数 |
| ------ | ---------------------------------- | ------ | 
| changeRowSelection | selectedRowKeys发生变化时回调函数  |  Function(selectedRowKeys, selectedRows)  |

### 方法
| 方法名称   |                 说明                | 参数 |
| ------ | ---------------------------------- | ------ | 
| get_selection | 获取表格穿梭框这组件勾选的数据  |  -  |
| set_selection | 设置表格穿梭框这组件勾选的数据  |  `number[]`  |
| clear_selection | 清空表格穿梭框这组件勾选的数据  |  -  |