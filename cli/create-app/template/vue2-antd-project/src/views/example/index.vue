<template>
    <div class="wrapper-special">
        <div class="main">
            <!-- 表单 -->
            <div class="row">
                <div class="qm-form flex t-180">
                    <div class="qm-form-item">
                        <a-form-model :model="form" :size="$store.state.antd.modelSize">
                            <a-form-model-item label="Activity name">
                                <a-input v-model="form.name" />
                            </a-form-model-item>
                            <a-form-model-item label="Activity zone">
                                <a-select v-model="form.region" placeholder="please select your zone">
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="Activity time">
                                <a-date-picker v-model="form.date1" show-time class="block" type="date" placeholder="Pick a date"/>
                            </a-form-model-item>
                            <a-form-model-item label="Instant delivery">
                                <a-switch v-model="form.delivery" />
                            </a-form-model-item>
                            <a-form-model-item label="定宽">
                                <a-checkbox-group v-model="form.type">
                                    <div class="qm-form-checkbox-list w-80">
                                        <a-checkbox value="1" name="type">1</a-checkbox>
                                        <a-checkbox value="2" name="type">2</a-checkbox>
                                        <a-checkbox value="3" name="type">3</a-checkbox>
                                    </div>
                                </a-checkbox-group>
                            </a-form-model-item>
                            <a-form-model-item label="自适应宽度">
                                <a-checkbox-group v-model="form.type">
                                    <a-checkbox value="1" name="type">Online</a-checkbox>
                                    <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                    <a-checkbox value="3" name="type">Offline</a-checkbox>
                                </a-checkbox-group>
                            </a-form-model-item>
                            <a-form-model-item label="Resources">
                                <a-radio-group v-model="form.resource">
                                    <a-radio value="1">Sponsor</a-radio>
                                    <a-radio value="2">Venue</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            <a-form-model-item class="ant-form-item-btn">
                                <a-button type="primary">Create</a-button>
                                <a-button>Cancel</a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="qm-form flex t-180">
                    <div class="qm-form-item">
                        <a-form-model :model="form" :size="$store.state.antd.modelSize">
                            <a-form-model-item label="Activity name">
                                <a-input v-model="form.name" />
                            </a-form-model-item>
                            <a-form-model-item label="Activity zone">
                                <a-select v-model="form.region" placeholder="please select your zone">
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="Activity time">
                                <a-date-picker v-model="form.date1" show-time type="date" placeholder="Pick a date"/>
                            </a-form-model-item>
                            <a-form-model-item label="Instant delivery">
                                <a-switch v-model="form.delivery" />
                            </a-form-model-item>
                            <a-form-model-item label="字数">
                                <div class="txt">
                                    <a-input v-model="form.name" />
                                    <span class="s-tips">字</span>
                                </div>
                            </a-form-model-item>
                            <a-form-model-item label="Activity type">
                                <span class="s-tips red block">提示：标签过多时，可用Ctrl + F进行搜索</span>
                                <a-checkbox-group v-model="form.type">
                                    <div class="qm-form-checkbox-list w-120">
                                        <a-checkbox value="1" name="type">Online</a-checkbox>
                                        <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                        <a-checkbox value="3" name="type">Offline</a-checkbox>
                                    </div>
                                </a-checkbox-group>
                            </a-form-model-item>
                            <a-form-model-item class="ant-form-item-btn">
                                <a-button type="primary">Create</a-button>
                                <a-button>Cancel</a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div class="qm-form-item">
                        <a-form-model :model="form" :size="$store.state.antd.modelSize">
                            <a-form-model-item label="Activity name">
                                <a-input v-model="form.name" />
                            </a-form-model-item>
                            <a-form-model-item label="Activity type">
                                <a-checkbox-group v-model="form.type">
                                    <div class="qm-form-checkbox-list w-120">
                                        <a-checkbox value="1" name="type">Online</a-checkbox>
                                        <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                        <a-checkbox value="3" name="type">Offline</a-checkbox>
                                    </div>
                                </a-checkbox-group>
                            </a-form-model-item>
                            <a-form-model-item class="ant-form-item-btn">
                                <a-button type="primary">Create</a-button>
                                <a-button>Cancel</a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                </div>
            </div>
            
            <!-- 筛选 -->
            <div class="row">
                <div class="qm-form auto">
                    <a-form-model :model="form" layout="inline" :size="$store.state.antd.modelSize">
                        <a-form-model-item label="Activity name">
                            <a-input v-model="form.name" class="w-120" />
                        </a-form-model-item>
                        <a-form-model-item label="Activity zone">
                            <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                <a-select-option value="shanghai">Zone one</a-select-option>
                                <a-select-option value="beijing">Zone two</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="Activity time">
                            <a-date-picker v-model="form.date1" show-time type="date" class="w-200 mr" placeholder="Pick a date"/>
                            <span class="s-tips red">提示语句</span>
                        </a-form-model-item>
                        <a-form-model-item label="Instant delivery">
                            <a-switch v-model="form.delivery" />
                        </a-form-model-item>
                        <a-form-model-item label="Activity type">
                            <a-checkbox-group v-model="form.type">
                                <a-checkbox value="1" name="type">Online</a-checkbox>
                                <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                <a-checkbox value="3" name="type">Offline</a-checkbox>
                            </a-checkbox-group>
                            <span class="s-tips red">提示语句</span>
                        </a-form-model-item>
                        <a-form-model-item label="Activity type">
                            <a-range-picker class="w-220" :defaultPickerValue="$store.state.antd.defaultPicker.prev" :ranges="$store.state.antd.rangePicker.yesterday" />
                        </a-form-model-item>
                        <a-form-model-item class="ant-form-item-btn">
                            <a-button type="primary">Create</a-button>
                            <a-button>Cancel</a-button>
                            <span class="s-tips red">提示语句</span>
                        </a-form-model-item>
                        <a-form-model-item class="ant-form-item-btn">
                            <a-button type="primary">Create</a-button>
                            <a-button>Cancel</a-button>
                            <span class="s-tips red">提示语句</span>
                        </a-form-model-item>
                        <a-form-model-item class="ant-form-item-btn">
                            <a-button type="primary">Create</a-button>
                            <a-button>Cancel</a-button>
                            <span class="s-tips red">提示语句</span>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </div>

            <!-- 筛选 -->
            <div class="row">
                <div class="qm-form auto filter">
                    <a-form-model :model="form" layout="inline" :size="$store.state.antd.modelSize">
                        <div class="ant-form-filter-list">
                            <a-form-model-item label="hover筛选类型">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-checkbox-group v-model="form.type">
                                    <a-checkbox value="1" name="type">Online</a-checkbox>
                                    <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                    <a-checkbox value="3" name="type">Offline</a-checkbox>
                                </a-checkbox-group>
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-checkbox-group v-model="form.type">
                                    <a-checkbox value="1" name="type">Online</a-checkbox>
                                    <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                    <a-checkbox value="3" name="type">Offline</a-checkbox>
                                </a-checkbox-group>
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-checkbox-group v-model="form.type">
                                    <a-checkbox value="1" name="type">Online</a-checkbox>
                                    <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                    <a-checkbox value="3" name="type">Offline</a-checkbox>
                                </a-checkbox-group>
                            </a-form-model-item>
                        </div>
                        <a-form-model-item class="ant-form-item-btn">
                            <a-button type="primary" @click="show_more">Create</a-button>
                            <a-button type="primary">Create</a-button>
                            <a-button>Cancel</a-button>
                        </a-form-model-item>
                    </a-form-model>
                    <br><br><br><br><br><br><br>
                </div>
            </div>

            <div class="row">
                <div class="qm-form">
                    <a-form-model layout="inline" :size="$store.state.antd.modelSize">
                        <a-form-model-item>
                            <a-button type="primary">添加一级菜单</a-button>
                            <a-button type="primary">添加一级菜单</a-button>
                            <a-button type="primary">添加一级菜单</a-button>
                            <a-button type="primary">添加一级菜单</a-button>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </div>

            <div class="row">
                <p class="qm-btn-list">
                    <span class="s-tips">当前章节：23323</span>
                    <span class="s-btn"><a-button>上一章</a-button></span>
                    <span class="s-btn"><a-button>下一章</a-button></span>
                    <span class="s-tips red">按←→️️可进行切章</span>
                    <span class="s-btn right">
                        <a-button type="primary">查看日志</a-button>
                    </span>
                </p>
            </div>


            <div class="row">
                <div class="qm-form auto filter">
                    <a-form-model :model="form" layout="inline" :size="$store.state.antd.modelSize">
                        <div class="ant-form-filter-list">
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-input v-model="form.name" class="w-120" />
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                    <a-select-option value="beijing">Zone two</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="测试">
                                <a-checkbox-group v-model="form.type">
                                    <a-checkbox value="1" name="type">Online</a-checkbox>
                                    <a-checkbox value="2" name="type">Promotion</a-checkbox>
                                    <a-checkbox value="3" name="type">Offline</a-checkbox>
                                </a-checkbox-group>
                            </a-form-model-item>
                        </div>
                        <a-form-model-item class="ant-form-item-btn">
                            <a-button type="primary" @click="show_more">Create</a-button>
                            <a-button type="primary">Create</a-button>
                            <a-button>Cancel</a-button>
                        </a-form-model-item>
                    </a-form-model>
                </div>
                <a-table :columns="columns" :data-source="data" bordered :size="$store.state.antd.tableSize" class="mt even-bg">
                    <template v-for="col in ['name', 'age', 'address']" :slot="col" slot-scope="text, record, index">
                        <div :key="col">
                            <a-input v-if="record.editable" :value="text" />
                            <template v-else>{{ text }}</template>
                        </div>
                    </template>
                    <template slot="operation" slot-scope="text, record, index">
                        <div class="editable-row-operations">
                            <span v-if="record.editable">
                                <a href="javascript:void(0)">Save</a>
                                <a-popconfirm title="Sure to cancel?">
                                    <a href="javascript:void(0)">Cancel</a>
                                </a-popconfirm>
                            </span>
                            <span v-else>
                                <a href="javascript:void(0)" :disabled="editingKey !== ''">Edit</a>
                            </span>
                        </div>
                    </template>
                </a-table>
            </div>
            
            <div class="mt">
                <div class="row flex">
                    <div class="col-a">
                        <div class="qm-mod">
                            <div class="qm-mod-th">
                                <span class="s-tit">标题</span>
                                <span class="s-tips">提示语</span>
                                <div class="filter">
                                    <div class="qm-form auto">
                                        <a-form-model :model="form" layout="inline" :size="$store.state.antd.modelSize">
                                            <a-form-model-item label="a">
                                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                                    <a-select-option value="beijing">Zone two</a-select-option>
                                                </a-select>
                                            </a-form-model-item>
                                            <a-form-model-item label="">
                                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                                    <a-select-option value="beijing">Zone two</a-select-option>
                                                </a-select>
                                            </a-form-model-item>
                                        </a-form-model>
                                    </div>
                                </div>
                                <div class="fun">
                                    <div class="qm-form">
                                        <a-form-model layout="inline">
                                            <a-form-model-item>
                                                <a-button type="primary">添加一级菜单</a-button>
                                            </a-form-model-item>
                                        </a-form-model>
                                    </div>
                                </div>
                            </div>
                            <div class="qm-mod-tb">
                                <a-popconfirm title="Are you sure delete this task?" ok-text="确认" cancel-text="取消" @confirm="confirm" @cancel="cancel"><a href="javascript:void(0);">popconfirm</a></a-popconfirm>
                            </div>
                        </div>
                    </div>
                    <div class="col-b">
                        <div class="qm-mod">
                            <div class="qm-mod-th">
                                <span class="s-tit">标题</span>
                            </div>
                            <div class="qm-mod-tb">
                                bbbb
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt">
                <div class="row flex">
                    <div class="col-a">
                        <div class="qm-mod">
                            <div class="qm-mod-th flex">
                                <span class="s-tit">标题</span>
                                <span class="s-tips">提示语</span>
                                <div class="filter">
                                    <div class="qm-form auto">
                                        <a-form-model :model="form" layout="inline" :size="$store.state.antd.modelSize">
                                            <a-form-model-item label="a">
                                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                                    <a-select-option value="beijing">Zone two</a-select-option>
                                                </a-select>
                                            </a-form-model-item>
                                            <a-form-model-item label="323">
                                                <a-select v-model="form.region" class="w-160" placeholder="please select your zone">
                                                    <a-select-option value="shanghai">Zone one</a-select-option>
                                                    <a-select-option value="beijing">Zone two</a-select-option>
                                                </a-select>
                                            </a-form-model-item>
                                        </a-form-model>
                                    </div>
                                </div>
                                <span class="s-tips">最后更新数据时间：2020-06-13 10:42:54</span>
                                <div class="fun">
                                    <div class="qm-form">
                                        <a-form-model layout="inline">
                                            <a-form-model-item>
                                                <a-button type="primary">添加一级菜单</a-button>
                                            </a-form-model-item>
                                        </a-form-model>
                                    </div>
                                </div>
                            </div>
                            <div class="qm-mod-tb">
                                cccc
                            </div>
                        </div>
                    </div>
                    <div class="col-b">
                        
                    </div>
                </div>
            </div>

            <div class="row">
                <a-table :columns="columnsA" bordered :dataSource="tableList" :size="$store.state.antd.tableSize" rowKey="id" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: on_select_change }" :scroll="{ x: 2000, y: 500 }" class="even-bg">
                    <template slot="env" slot-scope="text">
                        <template v-for="option in $store.state.select.list.deploy_env_select" v-if="text == option.value">
                            {{option.label}}
                        </template>
                    </template>
                    <template slot-scope="text, record, index" slot="action">
                        <p class="p-btn-list">
                            <a href="javascript:void(0);" @click="edit_docker(record)">编辑</a>
                            <a-popconfirm :title="'是否确定删除' + record.name + 'docker配置?'" @confirm="delete_docker(record, index)"  okText="确认" cancelText="取消">
                                <a href="javascript:void(0);">删除</a>
                            </a-popconfirm>
                        </p>
                    </template>
                </a-table>
            </div>

            <div class="row">
                <div class="qm-mod">
                    <div class="qm-mod-th">
                        <span class="s-tit">弹窗</span>
                    </div>
                    <div class="qm-mod-tb">
                        <a-button type="primary" @click="popData.visible = true">标题居中</a-button>
                        <a-button type="primary" @click="popDataA.visible = true">底部居中</a-button>
                        <a-button type="primary" @click="popDataB.visible = true">300宽弹窗</a-button>
                        <a-button type="primary" @click="popDataC.visible = true">自定义弹窗</a-button>
                    </div>
                </div>
            </div>

            <a-modal 
                title="标题居中" 
                dialogClass="header-center"
                :visible="popData.visible" 
                @ok="popData.visible = false" 
                @cancel="popData.visible = false" 
                centered
            >
                <p>内容</p>
            </a-modal>

            <a-modal 
                title="底部居中" 
                dialogClass="footer-center"
                :visible="popDataA.visible" 
                @ok="popDataA.visible = false" 
                @cancel="popDataA.visible = false" 
                centered
            >
                <p>内容</p>
            </a-modal>

            <a-modal 
                title="300宽弹窗" 
                dialogClass="w-300"
                :visible="popDataB.visible" 
                @ok="popDataB.visible = false" 
                @cancel="popDataB.visible = false" 
                centered
            >
                <p>内容</p>
            </a-modal>

            <a-modal 
                title="自定义弹窗" 
                dialogClass="header-center footer-center w-500"
                :visible="popDataC.visible" 
                @ok="popDataC.visible = false" 
                @cancel="popDataC.visible = false" 
                centered
            >
                <p>内容</p>
                <template slot="footer">
                    <div>
                        <a-button @click="popDataC.visible = false">关闭</a-button>
                        <a-button type="primary" @click="popDataC.visible = false">确认</a-button>
                    </div>
                </template>
            </a-modal>

        </div>
    </div>
</template>
<script>

const columns = [
    {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        scopedSlots: { customRender: 'name' },
    },
    {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        scopedSlots: { customRender: 'age' },
    },
    {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        scopedSlots: { customRender: 'address' },
    },
    {
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
    },
];

const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

import { Switch } from 'ant-design-vue';
export default {
    data() {
        this.cacheData = data.map(item => ({ ...item }));
        return {
            form: {
                name: '',
                region: undefined,
                date1: undefined,
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
            popData: {
                visible: false,
            },
            popDataA: {
                visible: false,
            },
            popDataB: {
                visible: false,
            },
            popDataC: {
                visible: false,
            },
            data,
            columns,
            editingKey: '',
            selectedRowKeys: [],
            tableList: [
                {
                    id: 1,
                    name: 1111,
                    name1: 1111,
                    name2: 1111,
                    name3: 1111,
                    name4: 1111,
                    name5: 1111,
                    name6: 1111,
                    name7: 1111,
                    action: '',
                },
                {
                    id: 2,
                    name: 1111,
                    name1: 1111,
                    name2: 1111,
                    name3: 1111,
                    name4: 1111,
                    name5: 1111,
                    name6: 1111,
                    name7: 1111,
                    action: '',
                },
                {
                    id: 3,
                    name: 1111,
                    name1: 1111,
                    name2: 1111,
                    name3: 1111,
                    name4: 1111,
                    name5: 1111,
                    name6: 1111,
                    name7: 1111,
                    action: '',
                },
                {
                    id: 4,
                    name: 1111,
                    name1: 1111,
                    name2: 1111,
                    name3: 1111,
                    name4: 1111,
                    name5: 1111,
                    name6: 1111,
                    name7: 1111,
                    action: '',
                },
                {
                    id: 5,
                    name: 1111,
                    name1: 1111,
                    name2: 1111,
                    name3: 1111,
                    name4: 1111,
                    name5: 1111,
                    name6: 1111,
                    name7: 1111,
                    action: '',
                },
                {
                    id: 6,
                    name: 1111,
                    name1: 1111,
                    name2: 1111,
                    name3: 1111,
                    name4: 1111,
                    name5: 1111,
                    name6: 1111,
                    name7: 1111,
                    action: '',
                }
            ],
            columnsA: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 100,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name1',
                    width: 100,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name2',
                    width: 150,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name3',
                    width: 300,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name4',
                    width: 200,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name5',
                    width: 500,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name6',
                    width: 800,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name7',
                    width: 200,
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                    key: 'action',
                    width: 150,
                    scopedSlots: { customRender: 'action'}
                }
            ],
        };
    },
    components: {
        'a-switch': Switch
    },
    computed: {
    },
    created() {
    },
    methods: {
        show_more(){

        },
        confirm(){

        },
        cancel(){

        },
        on_select_change(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
    }
};
</script>
<style lang="scss" scoped>
    .main{
        background: #f5f5f5;
        padding: $space;
        .row{
            background: #fff;
            padding: $space;
        }
    }

</style>
