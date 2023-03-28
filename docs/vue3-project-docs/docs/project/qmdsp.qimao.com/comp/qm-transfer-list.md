# 单选表格穿梭框 组件

## 功能
左侧展示表格 表格可以单选 右侧展示选中项的详细信息

## 展示

<script setup>
    import { reactive } from 'vue';
    import { Input as AInput } from 'ant-design-vue';
    import QmTransferList from '@components/qmdsp.qimao.com/qm-transfer-list/index.vue';
    const code = 
    `<template>
        <div class="test-component">
            <qm-transfer-list ref="qmTransferListRefs" v-model="data.selectedRowKeys" :tableOptions="data.tableOptions" :pageOptions="data.pageOption" :mainTitle="data.mainTitle" class="qm-transfer-list-container">
                <template #searchInput>
                    <a-input @change="change_name" v-model:value="data.searchFormData.key_word" placeholder="请输入广告计划名称或ID" />
                </template>
                <template #right="{ target_type_text, budget_type, budget_mode, show_campaign_name }">
                    <div v-if="target_type_text">营销目标：{{ target_type_text }}</div>
                    <div v-if="budget_type">推广预算：{{ budget_type }}</div>
                    <div v-if="budget_type">预算分配：{{ budget_mode }}</div>
                </template>
            </qm-transfer-list>
        </div>
    </template>
    <script setup>
        import { reactive } from 'vue';
        import QmTransferList from '@/components/qm-transfer-list/index.vue';

        const data = reactive({
            searchFormData: {
                key_word: ''
            },
            pageOption: {
                current: 1,
                pageSize: 8,
                total: 0,
                hideOnSinglePage: false
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
            pageOptions: {},
            mainTitle: '已有广告计划'
        });

        function change_name(e) {
            console.log(e);
        }
    <\/script>
    <style lang="scss" scoped>
    .test-component {
        width: 100%;
        :deep(.qm-transfer-list-container) {
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
        pageOption: {
            current: 1,
            pageSize: 8,
            total: 0,
            hideOnSinglePage: false
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
        pageOptions: {},
        mainTitle: '已有广告计划'
    });

    function change_name(e) {
        console.log(e);
    }
</script>

<style lang="scss" scoped>
.test-component {
    width: 100%;
    :deep(.qm-transfer-list-container) {
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
    }
    .test-btn {
        margin-top: 20px;
    }
}
</style>
<codeView title="基本用法" description="左侧展示表格 表格可以单选 右侧展示选中项的详细信息">
    <div class="test-component">
        <qm-transfer-list ref="qmTransferListRefs" v-model="data.selectedRowKeys" :tableOptions="data.tableOptions" :pageOptions="data.pageOption" :mainTitle="data.mainTitle" class="qm-transfer-list-container">
            <template #searchInput>
                <a-input @change="change_name" v-model:value="data.searchFormData.key_word" placeholder="请输入广告计划名称或ID" />
            </template>
            <template #right="{ target_type_text, budget_type, budget_mode, show_campaign_name }">
                <div v-if="target_type_text">营销目标：{{ target_type_text }}</div>
                <div v-if="budget_type">推广预算：{{ budget_type }}</div>
                <div v-if="budget_type">预算分配：{{ budget_mode }}</div>
            </template>
        </qm-transfer-list>
    </div>
    <template #codeText>
        <highlight-code :code="code"></highlight-code>
    </template>
</codeView>

## API
| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| value(v-model) | `number[]` |  -  |  -   | 表格勾选的数据的 key 数组 |
| mainTitle | `string` |  已有广告计划   |  -   | 表格上方的title |
| rightTitle | `string` |  已选广告计划   |  -   | 表格右侧的title |
| tableOptions | `TableProps` |  -   |  -   | 表格相关的参数，可参考antd Table 表格 组件 |
| pageOptions | `PaginationProps` |  -   |  -   | 分页相关的参数，可参考antd Pagination 分页 组件 |
| searchInput | `slot` |  -   |  -   | 搜索框占位 |
| headerCell | `v-slot:headerCell="{title, column}"` |  -   |  -   | antd Table 表格 组件 headerCell插槽 |
| bodyCell | `v-slot:bodyCell="{text, record, index, column}"` |  -   |  -   | antd Table 表格 组件 headerCell插槽 |
| right | `v-slot:right="data.selectedRows[0]"` |  -   |  -   | 右侧 详细信息插槽 当前选中行的数据 |

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