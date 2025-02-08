
import type { ExtractPropTypes, PropType } from 'vue';

export interface DropMenu {
    onClick?: Fn;
    to?: string;
    icon?: string;
    event: string | number;
    text: string;
    disabled?: boolean;
    divider?: boolean;
}
export const dropdownProps = {
    popconfirm: Boolean,
    /**
     * the trigger mode which executes the drop-down action
     * @default ['hover']
     * @type string[]
     */
    trigger: {
        type: [Array] as PropType<('contextmenu' | 'click' | 'hover')[]>,
        default: () => {
            return ['contextmenu'];
        }
    },
    dropMenuList: {
        type: Array as PropType<(DropMenu & Record<string, any>)[]>,
        default: () => []
    },
    selectedKeys: {
        type: Array as PropType<string[]>,
        default: () => []
    }
};

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>
