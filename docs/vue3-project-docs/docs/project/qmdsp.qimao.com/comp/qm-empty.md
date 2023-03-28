# 空状态 组件

## 功能
展示无数据时的提示界面

## 展示

<script lang="ts" setup>
    import { ref } from 'vue';
    import QmEmpty from '@components/qmdsp.qimao.com/qm-empty/index.vue';
    import { Table as ATable } from 'ant-design-vue';
    const code1 = 
`<template>
    <qm-empty btnText="去新建" :btnEvent="jump_create">
        <a-table
            :columns="columns"
            :data-source="[]"
            size="small"
            :pagination="false"
        />
    </qm-empty>
</template>
<script setup>
    import QmEmpty from '@/components/qm-empty/index.vue';
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        }, {
            title: 'Age',
            dataIndex: 'age'
        }, {
            title: 'Address',
            dataIndex: 'address'
        }
    ];
    function jump_create() {
        console.log('点击新建按钮');
    }
<\/script>`;
    const code2 = 
`<template>
    <qm-empty>
        <template #empty>
            <p>暂无数据，<a @click="jump_create">点我去新建</a></p>
        </template>
        <a-table
            :columns="columns"
            :data-source="[]"
            size="small"
            :pagination="false"
        />
    </qm-empty>
</template>
<script setup>
    import QmEmpty from '@/components/qm-empty/index.vue';
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        }, {
            title: 'Age',
            dataIndex: 'age'
        }, {
            title: 'Address',
            dataIndex: 'address'
        }
    ];
    function jump_create() {
        console.log('点击新建按钮');
    }
<\/script>`;
    const code3 = 
`<template>
    <qm-empty :isShow="isShow" btnText="去新建" :btnEvent="jump_create"></qm-empty>
</template>
<script setup>
    import { ref } from 'vue';
    import QmEmpty from '@/components/qm-empty/index.vue';
    const isShow = ref<boolean>(true);
    function jump_create() {
        console.log('点击新建按钮');
    }
<\/script>`;
    const isShow = ref<boolean>(true);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        }, {
            title: 'Age',
            dataIndex: 'age'
        }, {
            title: 'Address',
            dataIndex: 'address'
        }
    ];
    function jump_create() {
        console.log('点击新建按钮');
    }
</script>

1. 只有在 antd 组件无数据时，显示空状态界面
<codeView title="传参方式" description="通过传参的方式，使用 qm-empty 包裹的 antd 组件无数据时，展示自定义的空状态文案">
    <qm-empty btnText="去新建" :btnEvent="jump_create">
        <a-table
            :columns="columns"
            :data-source="[]"
            size="small"
            :pagination="false"
        />
    </qm-empty>
    <template #codeText>
        <highlight-code :code="code1"></highlight-code>
    </template>
</codeView>  
<br />
<codeView title="插槽方式" description="通过插槽的方式，使用 qm-empty 包裹的 antd 组件无数据时，展示插槽的内容">
    <qm-empty>
        <template #empty>
            <p>暂无数据，<a @click="jump_create">点我去新建</a></p>
        </template>
        <a-table
            :columns="columns"
            :data-source="[]"
            size="small"
            :pagination="false"
        />
    </qm-empty>
    <template #codeText>
        <highlight-code :code="code2"></highlight-code>
    </template>
</codeView>
2. 直接显示空状态界面
<codeView title="基本用法" description="通过传参或插槽的方式，直接显示空状态界面，需设置 isShow 参数为 true">
    <qm-empty :isShow="true" btnText="去新建" :btnEvent="jump_create"></qm-empty>
    <template #codeText>
        <highlight-code :code="code3"></highlight-code>
    </template>
</codeView>

## API
| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| btnText | `string` |  -  |  -   | 可点击的链接文案 |
| btnEvent | `function` |  -   |  -   | 点击事件 |
| isShow | `boolean` |  false   |  false｜true   | 是否直接显示空状态界面 |