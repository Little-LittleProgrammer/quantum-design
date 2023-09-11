import { propTypes } from '@quantum-design/types/vue/types';

export const tabsProps = {
    initPath: propTypes.string.def('/home'),
    showQuick: propTypes.bool.def(true),
    canDrag: propTypes.bool.def(true)
};
