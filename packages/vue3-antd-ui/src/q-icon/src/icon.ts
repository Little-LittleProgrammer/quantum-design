import { createVNode } from 'vue';
import * as Icons from '@ant-design/icons-vue';

const Icon = (props: { type: string, spin?:boolean }) => {
    const { type, spin } = props;
    return createVNode(Icons[type as keyof typeof Icons], {spin: spin, 'two-tone-color': '#E6A817'});
};

export {
    Icon
};
