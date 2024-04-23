
import { isNullOrUndef } from '@quantum-design/utils';
import { useSortable } from '@quantum-design/hooks/base/use-sortable';
import { useTabsStore } from './use-tabs-store';
import { nextTick } from 'vue';

// 排序
export function useTabsDrag(affixTextList: string[]) {
    const store = useTabsStore();
    nextTick(() => {
        const el = document.querySelectorAll(`.ant-tabs-nav-wrap > div`)?.[0] as HTMLElement;
        const { initSortable } = useSortable(el, {
            // 过滤, 初始化页面不能移动
            filter: (e) => {
                const text = (e as unknown as ChangeEvent)?.target?.innerText;
                if (!text) return false;
                return affixTextList.includes(text);
            },
            onEnd: (evt) => {
                console.log(evt);

                const { oldIndex, newIndex } = evt;

                if (isNullOrUndef(oldIndex) || isNullOrUndef(newIndex) || oldIndex === newIndex) {
                    return;
                }

                store.sort_tabs({oldIndex, newIndex});
            }
        });
        initSortable();
    });
}
