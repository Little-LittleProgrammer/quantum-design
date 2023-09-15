import { Popover } from 'ant-design-vue';
import type { FunctionalComponent, defineComponent } from 'vue';
import { componentMap } from '../../component-map';
import type { ComponentType } from '../../types/component-type';
import { h} from 'vue';

export interface ComponentProps {
    component: ComponentType;
    rule: boolean;
    popoverVisible: boolean;
    ruleMessage: string;
    getPopupContainer?: Fn;
}

// 规则校验弹框
export const CellComponent: FunctionalComponent = (
    {
        component = 'Input',
        rule = true,
        ruleMessage,
        popoverVisible,
        getPopupContainer
    }: ComponentProps,
    { attrs }
) => {
    const _comp = componentMap.get(component) as typeof defineComponent;

    const _defaultComp = h(_comp, attrs);
    if (!rule) {
        return _defaultComp;
    }
    return h(
        Popover,
        {
            overlayClassName: 'q-table-editable-cell-rule-popover',
            open: !!popoverVisible,
            ...(getPopupContainer ? { getPopupContainer } : {})
        },
        {
            default: () => _defaultComp,
            content: () => ruleMessage
        }
    );
};
