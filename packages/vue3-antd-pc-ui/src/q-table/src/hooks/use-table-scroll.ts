import { ref, type ComputedRef, type Ref, nextTick, unref, computed, watch, onActivated, onMounted } from 'vue';
import type { BasicTableProps, BasicColumn, TableRowSelection } from '../types/table';
import type {Recordable} from '../types/table';
import { js_utils_dom_offset, js_utils_throttle_event } from '@quantum-design/utils';
import { isBoolean } from 'lodash-es';
import { DEFAULT_NORMAL_WIDTH } from '../enums/const';

export function useTableScroll(
    propsRef: ComputedRef<BasicTableProps>,
    tableElRef: Ref<ComponentRef>,
    columnsRef: ComputedRef<BasicColumn[]>,
    rowSelectionRef: ComputedRef<TableRowSelection | null>,
    getDataSourceRef: ComputedRef<Recordable[]>,
    wrapRef: Ref<HTMLElement | null>,
    formRef: Ref<ComponentRef>
) {
    const tableHeightRef: Ref<Nullable<number | string>> = ref(167);
    // Greater than animation time 280
    const debounceRedoHeight = () => js_utils_throttle_event(redoHeight, {time: 100});

    const getCanResize = computed(() => {
        const { canResize, scroll } = unref(propsRef);
        return canResize && !(scroll || {}).y;
    });

    watch(
        () => [unref(getCanResize), unref(getDataSourceRef)?.length],
        () => {
            debounceRedoHeight();
        },
        {
            flush: 'post'
        }
    );

    function redoHeight() {
        nextTick(() => {
            calcTableHeight();
        });
    }

    function setHeight(height: number) {
        tableHeightRef.value = height;
    }

    // No need to repeat queries
    let paginationEl: HTMLElement | null;
    let footerEl: HTMLElement | null;
    let bodyEl: HTMLElement | null;
    function handleScrollBar(bodyEl: HTMLElement, tableEl: Element) {
        const hasScrollBarY = bodyEl.scrollHeight > bodyEl.clientHeight;
        const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;

        if (hasScrollBarY) {
            tableEl.classList.contains('hide-scrollbar-y') &&
            tableEl.classList.remove('hide-scrollbar-y');
        } else {
            !tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.add('hide-scrollbar-y');
        }

        if (hasScrollBarX) {
            tableEl.classList.contains('hide-scrollbar-x') &&
            tableEl.classList.remove('hide-scrollbar-x');
        } else {
            !tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.add('hide-scrollbar-x');
        }
    }

    function caclPaginationHeight(tableEl: Element): number {
        const { pagination } = unref(propsRef);
        // Pager height
        let paginationHeight = 2;
        if (!isBoolean(pagination)) {
            paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
            if (paginationEl) {
                const offsetHeight = paginationEl.offsetHeight;
                paginationHeight += offsetHeight || 0;
            } else {
            // TODO First fix 24
                paginationHeight += 24;
            }
        } else {
            paginationHeight = -8;
        }
        return paginationHeight;
    }

    function caclFooterHeight(tableEl: Element): number {
        const { pagination } = unref(propsRef);
        let footerHeight = 0;
        if (!isBoolean(pagination)) {
            if (!footerEl) {
                footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
            } else {
                const offsetHeight = footerEl.offsetHeight;
                footerHeight += offsetHeight || 0;
            }
        }
        return footerHeight;
    }

    function calcHeaderHeight(headEl: Element): number {
        let headerHeight = 0;
        if (headEl) {
            headerHeight = (headEl as HTMLElement).offsetHeight;
        }
        return headerHeight;
    }

    function calcBottomAndPaddingHeight(tableEl: Element, headEl: Element) {
        const { pagination, isCanResizeParent, useSearchForm } = unref(propsRef);
        // Table height from bottom height-custom offset
        let paddingHeight = 30;
        let bottomIncludeBody = 0;
        if (unref(wrapRef) && isCanResizeParent) {
            const tablePadding = 12;
            const formMargin = 16;
            let paginationMargin = 10;
            const wrapHeight = unref(wrapRef)?.offsetHeight ?? 0;

            let formHeight = unref(formRef)?.$el.offsetHeight ?? 0;
            if (formHeight) {
                formHeight += formMargin;
            }
            if (isBoolean(pagination) && !pagination) {
                paginationMargin = 0;
            }
            if (isBoolean(useSearchForm) && !useSearchForm) {
                paddingHeight = 0;
            }

            const headerCellHeight =
            (tableEl.querySelector('.ant-table-title') as HTMLElement)?.offsetHeight ?? 0;

            console.log(wrapHeight - formHeight - headerCellHeight - tablePadding - paginationMargin);
            bottomIncludeBody =
            wrapHeight - formHeight - headerCellHeight - tablePadding - paginationMargin;
        } else {
            // Table height from bottom
            bottomIncludeBody = js_utils_dom_offset(headEl as Element & HTMLElement).bottomIncludeBody;
        }

        return {
            paddingHeight,
            bottomIncludeBody
        };
    }

    async function calcTableHeight() {
        const { resizeHeightOffset, maxHeight } = unref(propsRef);
        const tableData = unref(getDataSourceRef);

        const table = unref(tableElRef);
        if (!table) return;

        const tableEl: Element = table.$el;
        if (!tableEl) return;

        if (!bodyEl) {
            bodyEl = tableEl.querySelector('.ant-table-body');
            if (!bodyEl) return;
        }

        handleScrollBar(bodyEl, tableEl);

        bodyEl!.style.height = 'unset';

        if (!unref(getCanResize) || !unref(tableData) || tableData.length === 0) return;

        await nextTick();
        // Add a delay to get the correct bottomIncludeBody paginationHeight footerHeight headerHeight

        const headEl = tableEl.querySelector('.ant-table-thead ');

        if (!headEl) return;

        const paginationHeight = caclPaginationHeight(tableEl);
        const footerHeight = caclFooterHeight(tableEl);
        const headerHeight = calcHeaderHeight(headEl);
        const { paddingHeight, bottomIncludeBody } = calcBottomAndPaddingHeight(tableEl, headEl);

        let height =
          bottomIncludeBody -
          (resizeHeightOffset || 0) -
          paddingHeight -
          paginationHeight -
          footerHeight -
          headerHeight;
        height = (height > maxHeight! ? (maxHeight as number) : height) ?? height;
        setHeight(height);

        bodyEl!.style.height = `${height}px`;
    }

    let mounted: boolean;
    onMounted(() => {
        calcTableHeight();
        nextTick(() => {
            debounceRedoHeight();
        });
        nextTick(() => {
            mounted = true;
        });
    });

    onActivated(() => {
        if (mounted) {
            calcTableHeight();
            nextTick(() => {
                debounceRedoHeight();
            });
        }
    });

    const getScrollX = computed(() => {
        let width = 0;
        if (unref(rowSelectionRef)) {
            width += 60;
        }

        // TODO props ?? 0;

        const columns = unref(columnsRef).filter((item) => !item.defaultHidden);
        columns.forEach((item) => {
            width += Number.parseFloat(item.width as string) || 0;
        });
        const unsetWidthColumns = columns.filter((item) => !Reflect.has(item, 'width'));

        const len = unsetWidthColumns.length;
        if (len !== 0) {
            width += len * DEFAULT_NORMAL_WIDTH;
        }

        const table = unref(tableElRef);
        const tableWidth = table?.$el?.offsetWidth ?? 0;
        return tableWidth > width ? '100%' : width;
    });

    const getScrollRef = computed(() => {
        const tableHeight = unref(tableHeightRef);
        const { canResize, scroll } = unref(propsRef);
        return {
            x: unref(getScrollX),
            y: canResize ? tableHeight : null,
            scrollToFirstRowOnChange: false,
            ...scroll
        };
    });

    return { getScrollRef, redoHeight };
}
