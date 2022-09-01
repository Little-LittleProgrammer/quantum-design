import { propTypes } from '../../utils/types';

export const tabsProps = {
    initPath: propTypes.string.def('/home'),
    showQuick: propTypes.bool.def(true),
    canDrag: propTypes.bool.def(true)
};
