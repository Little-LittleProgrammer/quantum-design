import { CSSProperties, createVNode } from 'vue';
import * as Icons from '@ant-design/icons-vue';
import type { Component } from 'vue';
import {icons} from '../data/icons-data';

const iconList: Record<keyof typeof Icons, Component> = Icons;

const Icon = (props: { type: keyof typeof iconList, spin?:boolean, class?: string, style?: string | CSSProperties }) => {
    const { type, spin } = props;
    return createVNode(iconList[type], {spin: spin, 'two-tone-color': '#E6A817'});
};

function addIcon<T extends string>(name: T, component:Component) {
    iconList[name as 'createFromIconfontCN'] = component;
    icons.push(name);
}

export {
    Icon,
    addIcon
};
