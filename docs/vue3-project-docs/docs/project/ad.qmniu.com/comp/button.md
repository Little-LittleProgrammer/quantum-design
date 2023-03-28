# 按钮组 组件

## 功能
将`jsonscheams`转化为按钮组

## 展示

<script setup>
    import {QButtonGroup} from '@components/ad.qmniu.com/qm-button/index.ts'
    const code = `<template>
    <q-button-group :actions="create_button_actions()"></q-button-group>
</template>
<script setup>
    import {QButtonGroup} from '@components/ad.qmniu.com/qm-button/index.ts'
    function create_button_actions() {
        return [{
            label: '新增',
            onClick: () => {
            }
        }, {
            label: '复制',
            onClick: () => {
            }
        }, {
            label: '删除',
            popConfirm: {
                title: '是否确认删除'
            }
        }];
    }
\<\/script>`;
    function create_button_actions() {
        return [{
            label: '新增',
            type: 'primary',
            onClick: () => {
            }
        }, {
            label: '复制',
            onClick: () => {
            }
        }, {
            label: '删除',
            popConfirm: {
                title: '是否确认删除'
            }
        }];
    }
</script>
<codeView title="基本用法" description="按钮组用法">
    <q-button-group :actions="create_button_actions()"></q-button-group>
    <template #codeText>
        <highlight-code :code="code" >
        </highlight-code>
    </template>
</codeView>

## API

|属性|说明|类型|默认值|
|-----|--|--|--|
|actions|按钮的scheams配置|`ActionItem`|`{}`|
|divider|按钮之间是否有分割线|`boolean`|`false`|

```js
export interface ActionItem extends ButtonProps {
    onClick?: Fn;
    label?: string;
    color?: 'success' | 'error' | 'warning';
    icon?: string;
    popConfirm?: PopConfirm;
    disabled?: boolean;
    divider?: boolean;
    // 业务控制是否显示
    ifShow?: boolean | ((action: ActionItem) => boolean);
    tooltip?: string | TooltipProps;
}

export interface PopConfirm {
    title: string;
    okText?: string;
    cancelText?: string;
    confirm: Fn;
    cancel?: Fn;
    icon?: string;
    placement?:string
}
```