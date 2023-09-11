import { component_with_install } from '@quantum-design/utils';
import ShrinkCard from './src/shrink-card.vue';
import { CardType } from 'ant-design-vue/lib/card/Card';

export type {
    CardType
};

const QAntdShrinkCard = component_with_install(ShrinkCard);

export default QAntdShrinkCard;
