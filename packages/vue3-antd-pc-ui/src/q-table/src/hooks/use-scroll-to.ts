import { nextTick, type ComputedRef, type Ref, unref, warn } from 'vue';
import type {Recordable} from '../types/table';

export function useTableScrollTo(tableElRef: Ref<ComponentRef>, getDataSourceRef: ComputedRef<Recordable[]>) {
    let bodyEl: HTMLElement | null;

    async function findTargetRowToScroll(targetRowData: Recordable) {
        const {id} = targetRowData;
        const _targetRowEl: HTMLElement | null | undefined = bodyEl?.querySelector(
            `[data-row-key="${id}"]`
        );

        await nextTick();
        bodyEl?.scrollTo({
            top: _targetRowEl?.offsetTop ?? 0,
            behavior: 'smooth'
        });
    }

    function scrollTo(pos: string): void {
        const _table = unref(tableElRef);
        if (!_table) return;

        const _tableEl: Element = _table.$el;
        if (!_tableEl) return;

        if (!bodyEl) {
            bodyEl = _tableEl.querySelector('.ant-table-body');
            if (!bodyEl) return;
        }

        const _dataSource = unref(getDataSourceRef);
        if (!_dataSource) return;

        // judge pos type
        if (pos === 'top') {
            findTargetRowToScroll(_dataSource[0]);
        } else if (pos === 'bottom') {
            findTargetRowToScroll(_dataSource[_dataSource.length - 1]);
        } else {
            const targetRowData = _dataSource.find((data) => data.id === pos);
            if (targetRowData) {
                findTargetRowToScroll(targetRowData);
            } else {
                warn(`id: ${pos} doesn't exist`);
            }
        }
    }

    return { scrollTo };
}
