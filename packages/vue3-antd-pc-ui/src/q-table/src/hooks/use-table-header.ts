import { ComputedRef, Slots, computed, h, unref } from 'vue';
import { BasicTableProps, InnerHandlers, Recordable } from '../types/table';
import { js_is_string } from '@quantum-design/utils';
import TableHeader from '../components/header/table-header.vue';
import {useSlots} from '@quantum-design/hooks/vue';

// table组件的 header， 不是表格 header
export function useTableHeader(
    propsRef: ComputedRef<BasicTableProps>,
    slots: Slots,
    handlers: InnerHandlers
) {
    const {getSlot} = useSlots();
    const getHeaderProps = computed(() => {
        const { title, showTableSetting, titleHelpMessage, tableSetting } = unref(propsRef);
        const _hideTitle = !slots.tableTitle && !title && !slots.toolbar && !showTableSetting;
        if (_hideTitle && !js_is_string(title)) {
            return {};
        }
        return {
            title: _hideTitle ? null
                : () => h(TableHeader, {
                    title,
                    titleHelpMessage,
                    showTableSetting,
                    tableSetting,
                    onColumnsChange: handlers.onColumnsChange
                } as Recordable, {
                    ...(slots.toolbar
                        ? {
                            toolbar: () => getSlot(slots, 'toolbar')
                        }
                        : {}),
                    ...(slots.tableTitle
                        ? {
                            tableTitle: () => getSlot(slots, 'tableTitle')
                        }
                        : {}),
                    ...(slots.headerTop
                        ? {
                            headerTop: () => getSlot(slots, 'headerTop')
                        }
                        : {})
                })
        };
    });
    return { getHeaderProps };
}
