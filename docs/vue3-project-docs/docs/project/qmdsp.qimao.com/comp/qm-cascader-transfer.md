# 级联穿梭框 组件

## 功能
单栏/双栏穿梭选择框，左侧勾选，数据展示到右侧已选组件

## 展示

<script setup>
    import { ref } from 'vue';
    import QmCascaderTransfer from '@components/qmdsp.qimao.com/qm-cascader-transfer/index.vue';
    const codeOne = 
`<template>
    <qm-cascader-transfer
        :title="['省份', '城市']"
        v-model:checked-value="cascaderValue"
        :data-source="arealist"
        :columns-num="2"
        :show-search="true"
        :placeholder="'请输入城市名称查询'"
        @changeCascaderTransfer="handleChange"
    ></qm-cascader-transfer>
</template>
<script setup>
    import { ref } from 'vue';
    import QmCascaderTransfer from '@/components/qm-cascader-transfer/index.vue';
    const arealist = [{ 
        value: 110000,
        label: '北京市',
        children: [
            {
                value: 110100,
                area: [
                    {
                        value: '110101',
                        label: '东城区'
                    },

                ],
                label: '市辖区'
            }
        ]}, {
        value: 120000,
        label: '天津市',
        children: [
            {
                value: '120100',
                area: [
                    {
                        value: '120101',
                        label: '和平区'
                    }, {
                        value: '120102',
                        label: '河东区'
                    },
                ],
                label: '市辖区'
            }
        ]    
    }];
    const cascaderValue = ref([ // mock二级数据回显
        {
            value: 110000,
            children: [] // children为空，一级全选状态
        }, {
            value: 140000,
            children: [140100]
        }
    ]);
    function handleChange(val) {
        console.log(val);
    }
<\/script>`
const codeTwo = 
`<template>
    <qm-cascader-transfer
       :title="['手机品牌']"
        v-model:checked-value="cascaderPhoneValue"
        :data-source="phonelist"
        :columns-num="1"
        @changeCascaderTransfer="handleChangePhone"
    ></qm-cascader-transfer>
</template>
<script setup>
    import { ref } from 'vue';
    import QmCascaderTransfer from '@/components/qm-cascader-transfer/index.vue';
    const phonelist = [{
        value: 1,
        label: '华为'
    }, {
        value: 2,
        label: '苹果'
    }, {
        value: 3,
        label: 'oppo'
    }]
    const cascaderPhoneValue = ref([1, 2]); // mock一级数据回显
    function handleChangePhone(val) {
        console.log(val, 'val');
    }
<\/script>`
    const arealist = [{ 
        value: 110000,
        label: '北京市',
        children: [
            {
                value: 110100,
                area: [
                    {
                        value: '110101',
                        label: '东城区'
                    },

                ],
                label: '市辖区'
            }
        ] 
    }, {
        value: 120000,
        label: '天津市',
        children: [
            {
                value: '120100',
                area: [
                    {
                        value: '120101',
                        label: '和平区'
                    }, {
                        value: '120102',
                        label: '河东区'
                    },
                ],
                label: '市辖区'
            }
        ]    
    }, {
        value: '130000',
        label: '河北省',
        children: [
            {
                value: '130100',
                label: '石家庄市'
            }, {
                value: '130200',
                label: '唐山市'
            }, {
                value: '130300',
                label: '秦皇岛市'
            }, {
                value: '130400',
                label: '邯郸市'
            }, {
                value: '130500',
                label: '邢台市'
            }, {
                value: '130600',
                label: '保定市'
            }, {
                value: '130700',
                label: '张家口市'
            }, {
                value: '130800',
                label: '承德市'
            }, {
                value: '130900',
                label: '沧州市'
            }, {
                value: '131000',
                label: '廊坊市'
            }
        ]
    }, {
        value: '220000',
        label: '吉林省',
        children: [
            {
                value: '220100',
                label: '长春市'
            }, {
                value: '220200',
                label: '吉林市'
            }, {
                value: '220300',
                label: '四平市'
            }, {
                value: '220400',
                label: '辽源市'
            }
        ]
    }, {
        value: '230000',
        label: '黑龙江省',
        children: [
            {
                value: '230100',
                label: '哈尔滨市'
            }, {
                value: '230200',
                label: '齐齐哈尔市'
            }, {
                value: '231200',
                label: '绥化市'
            }, {
                value: '232700',
                label: '大兴安岭地区'
            }
        ]
    }, {
        value: '320000',
        label: '江苏省',
        children: [
            {
                value: '320100',
                label: '南京市'
            }, {
                value: '321300',
                label: '宿迁市'
            }
        ]
    }, {
        value: '340000',
        label: '安徽省',
        children: [
            {
                value: '340600',
                label: '淮北市'
            }, {
                value: '340700',
                label: '铜陵市'
            }
        ]
    }];
    const phonelist = [{
        value: 1,
        label: '华为'
    }, {
        value: 2,
        label: '苹果'
    }, {
        value: 3,
        label: 'oppo'
    }]
    const cascaderPhoneValue = ref([1, 2]); // mock一级回显数据
    const cascaderValue = ref([ // mock二级回显数据
        {
            value: 110000,
            children: [] // children为空，一级全选状态
        }, {
            value: 140000,
            children: [140100]
        }
    ]);
    function handleChange(val) {
        console.log(val);
    }
    function handleChangePhone(val) {
        console.log(val);
    }
</script>
<style lang="scss">
@import 'https://at.alicdn.com/t/c/font_3795995_tj8mcnwoqmf.css';
._project_qmdsp_qimao_com_comp_qm-cascader-transfer{
    ul {
        padding-left: 0;
        margin: 0;
    }    
}
</style>
<codeView title="基本用法" description="双栏穿梭框">
    <qm-cascader-transfer
        :title="['省份', '城市']"
        v-model:checked-value="cascaderValue"
        :data-source="arealist"
        :columns-num="2"
        :show-search="true"
        :placeholder="'请输入城市名称查询'"
        @changeCascaderTransfer="handleChange"
    ></qm-cascader-transfer>
    <br/>
    <template #codeText>
        <highlight-code :code="codeOne"></highlight-code>
    </template>
</codeView>
<codeView title="基本用法" description="单栏穿梭框">
    <qm-cascader-transfer
       :title="['手机品牌']"
        v-model:checked-value="cascaderPhoneValue"
        :data-source="phonelist"
        :columns-num="1"
        @changeCascaderTransfer="handleChangePhone"
    ></qm-cascader-transfer>
    <br/>
    <template #codeText>
        <highlight-code :code="codeTwo"></highlight-code>
    </template>
</codeView>


### API

| 属性    | 类型                                                              | 默认值   | 说明     |
| ------- | -----------------------------------------------------------------| ------ | -------- |
| title         | `string[]`| -      | 标题集合，顺序从左至右 |
| checked-value(v-model) | `array<{value, label, children}>, string[]｜ number[]` | - | 选中的值 |
| data-source   | `array<{value, label, children}>` | []      | 数据源 |
| columns-num   | `Number`  | 2      | 展示最大层级 |
| show-search   | `Boolean` | false      | 是否展示顶部搜索框 |
| placeholder   | `String`  | -      | 输入框内提示内容 |


### 事件

| 事件名称   |                 说明                | 回调参数 |
| ------ | ---------------------------------- | ------ | 
| changeCascaderTransfer | 选中项发生改变时的回调函数   |  Function(checkedValue)  |


### 说明
传参/回显数据结构如下
```js
// 1、双栏结构,一级全选状态下，children传空，反之value值依次传入children
[{
    value: 110000,
    children: []
}, {
    value: 140000,
    children: [140100]
}, {
    value: 130000,
    children: [130100, 130200, 130300, 130400]
}]

// 2、单栏结构，value值依次传入
[1, 2]
```