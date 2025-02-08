import type { PropType } from 'vue';

export const watermarkProps = {
    name: { // 水印名称
        type: String,
        default: ''
    },
    gapX: { // 水印之间的距离，根据中心距离计算
        type: String,
        default: '80px'
    },
    gapY: { // 水印之间的距离，根据中心距离计算
        type: String,
        default: '50px'
    },
    customStyle: {
        type: Object as PropType<Partial<CSSStyleDeclaration>>,
        default: {}
    }
};
