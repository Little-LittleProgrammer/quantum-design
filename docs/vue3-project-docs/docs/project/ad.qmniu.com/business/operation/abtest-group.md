# ABTestGroup

## 介绍
`qTreeTable`: 多级表格，用于展现层级

`componentMap`: 根据选择编辑的列或按钮来渲染不同的组件

### 
```vue
// 用特定的数据结构作为表头和数据，自动渲染为多级表格
        <q-tree-table :header="tableHeader" :treeData="tableData" style="min-width: 2100px" >
                <template #default="{ headerKey, cell, parent }">
                    <template v-if="headerKey === 'device_scope_txt'">
                        <a-button type="link" @click="open_modal('scope', cell)">查看实验组范围</a-button>
                    </template>
                    <template v-else-if="headerKey === 'direction_txt'">
                        <a-button type="link" @click="open_modal('direction', cell)">查看实验定向</a-button>
                    </template>
                    <template v-else-if="headerKey === 'other_policy_txt'">
                        {{ cell[headerKey] }}<q-icon class="orange m-l-10" type="FormOutlined" @click="single_edit('other_policy_txt', cell)"></q-icon>
                    </template>
                    <template v-else-if="headerKey === 'special_kv_txt'">
                        <div class="qm-flex-center">
                            <div class="w-110">
                                <p class="qm-ellipsis-text w-100 inline-block" v-for="text in cell.special_kv" :key="text.key">
                                    <a-tooltip :title="`${text.key}（${text.value}）`">
                                        {{ `${text.key}（${text.value}）` }}
                                    </a-tooltip>
                                </p>
                            </div>
                            <q-icon class="orange" type="FormOutlined" @click="single_edit('special_kv_txt', cell)"></q-icon>
                        </div>
                    </template>
                    <template v-else-if="headerKey === 'ad_unit_txt'">
                        {{ cell[headerKey] }} <q-icon class="orange m-l-10" type="FormOutlined" @click="single_edit(headerKey, parent)"></q-icon>
                    </template>
                    <template v-else-if="headerKey === 'direction_tag_txt'">
                        {{ cell[headerKey] }} <q-icon v-if="parent.ad_unit_id" class="orange m-l-10" type="FormOutlined" @click="single_edit(headerKey, parent.parent, parent)"></q-icon>
                    </template>
                    <template v-else-if="['policy_txt', 'flow_txt'].includes(headerKey)">
                        {{ cell[headerKey] }} <q-icon v-if="parent.ad_unit_id" class="orange" type="FormOutlined" @click="single_edit(headerKey, parent.parent, parent, cell)"></q-icon>
                    </template>
                    <span v-else>{{ cell[headerKey] }}</span>
                </template>
        </q-tree-table>
```

```vue
        // 根据不同的 componentKey 渲染不同的编辑组件
        <component
            v-else
            :is="componentMap[componentKey]"
            :batch-type="componentKey"
            :visible="batchVisible"
            :values="batchData"
            :special-config-list="specialConfigList"
            :step="step"
            :selectList="selectList"
            :group-id="groupId"
            @ok="submit_batch"
            @cancel="close_modal"
        >
        </component>
```

### 批量编辑
在 modal 中嵌套多级表格，点击不同按钮是展开对应的层级，禁用不相关的多选框
