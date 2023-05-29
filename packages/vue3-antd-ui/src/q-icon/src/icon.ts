import { createVNode } from 'vue';
import * as Icons from '@ant-design/icons-vue';

const Icon = (props: { type: keyof typeof Icons, spin?:boolean, class?: string, style?: any }) => {
    const { type, spin } = props;
    return createVNode(Icons[type], {spin: spin, 'two-tone-color': '#E6A817'});
};

export {
    Icon
};
