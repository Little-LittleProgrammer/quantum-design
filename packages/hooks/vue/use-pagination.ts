import { ref, unref, computed, Ref } from 'vue';

// 用于前端实现分页
function pagination<T = any>(list: T[], pageNo: number, pageSize: number): T[] {
    const _offset = (pageNo - 1) * Number(pageSize);
    const _ret =
    _offset + Number(pageSize) >= list.length
        ? list.slice(_offset, list.length)
        : list.slice(_offset, _offset + Number(pageSize));
    return _ret;
}

export function usePagination<T = any>(list: Ref<T[]>, pageSize: number) {
    const _currentPage = ref(1);
    const _pageSizeRef = ref(pageSize);

    const getPaginationList = computed(() => {
        return pagination(unref(list), unref(_currentPage), unref(_pageSizeRef));
    });

    const getTotal = computed(() => {
        return unref(list).length;
    });

    function setCurrentPage(page: number) {
        _currentPage.value = page;
    }

    function setPageSize(pageSize: number) {
        _pageSizeRef.value = pageSize;
    }

    return { setCurrentPage, getTotal, setPageSize, getPaginationList };
}
