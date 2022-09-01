import { nextTick, unref } from 'vue';
import type { Ref } from 'vue';
import type { Options } from 'sortablejs';

export function useSortable(el: HTMLElement | Ref<HTMLElement>, options?: Options) {
    function init_sortable() {
        nextTick(async() => {
            if (!el) return;
            const _sortable = (await import('sortablejs')).default;
            _sortable.create(unref(el), {
                animation: 500,
                delay: 400,
                delayOnTouchOnly: true,
                ...options
            });
        });
    }
    return {
        initSortable: init_sortable
    };
}
