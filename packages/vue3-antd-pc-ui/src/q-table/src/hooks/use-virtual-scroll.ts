import { type ComputedRef, type Ref, computed, nextTick, onMounted, onUnmounted, reactive, readonly, ref, unref, watch } from 'vue';
import type { BasicTableProps, Recordable } from '../types/table';
import { throttle } from 'lodash-es';

export interface VirtualScrollConfig {
    /** 每行高度（像素），支持固定高度 */
    itemHeight?: number;
    /** 缓冲区行数，用于平滑滚动 */
    bufferSize?: number;
    /** 可视区域高度 */
    containerHeight?: number;
    /** 是否启用虚拟滚动 */
    enabled?: boolean;
    /** 滚动节流延迟 */
    throttleDelay?: number;
}

export interface VirtualScrollState {
    /** 开始渲染的索引 */
    start: number;
    /** 结束渲染的索引 */
    end: number;
    /** 每行高度 */
    itemHeight: number;
    /** 表格高度 */
    tableHeight: number;
    /** 当前偏移量 */
    currentOffset: number;
    /** 可视区域行数 */
    count: number;
    /** 滚动容器DOM */
    wrapperDom: HTMLElement | null;
    /** 表格内容DOM */
    contentDom: HTMLElement | null;
    /** 占位符DOM */
    placeholderDom: HTMLElement | null;
    /** 类名前缀 */
    className: string;
}

interface UseVirtualScrollProps {
    propsRef: ComputedRef<BasicTableProps>;
    dataSource: Ref<Recordable[]>;
    containerRef: Ref<ComponentRef>;
    scrollRef: Ref<{ y: any }>;
    size: 'small' | 'middle' | 'large';
}

export interface VirtualScrollReturn {
    virtualState: Readonly<VirtualScrollState>;
    isVirtualEnabled: ComputedRef<boolean>;
    config: ComputedRef<VirtualScrollConfig>;
    visibleData: ComputedRef<Recordable[]>;
    scrollToIndex: (index: number, align?: 'top' | 'center' | 'bottom') => void;
    scrollToRow: (rowKey: string | number, align?: 'top' | 'center' | 'bottom') => void;
    getRealIndex: (virtualIndex: number) => number;
    isIndexVisible: (index: number) => boolean;
    updateConfig: (newConfig: Partial<VirtualScrollConfig>) => void;
    scrollInfo: ComputedRef<{
        start: number;
        end: number;
        currentOffset: number;
        count: number;
        totalCount: number;
    }>;
}

const DEFAULT_CONFIG = {
    itemHeight: 54, // ant-design-vue 表格默认行高
    bufferSize: 5, // 缓冲区大小
    containerHeight: 400,
    enabled: true,
    throttleDelay: 16, // 约 60fps
};

export function useVirtualScroll({ propsRef, dataSource, containerRef, scrollRef, size }: UseVirtualScrollProps): VirtualScrollReturn {
    const virtualState = reactive<VirtualScrollState>({
        start: 0,
        end: 0,
        itemHeight: 54,
        tableHeight: 400,
        currentOffset: 0,
        count: 0,
        wrapperDom: null,
        contentDom: null,
        placeholderDom: null,
        className: '',
    });

    const init = ref(false);

    // 虚拟滚动配置
    const config = computed(() => {
        const props = unref(propsRef);
        const virtualConfig = props.virtualConfig || {};

        return {
            ...DEFAULT_CONFIG,
            containerHeight: unref(scrollRef).y || 400,
            itemHeight: size === 'small' ? 40 : size === 'middle' ? 48 : 57,
            ...virtualConfig,
            enabled: !!(props.virtual && (virtualConfig.enabled ?? true)),
        };
    });

    // 是否启用虚拟滚动
    const isVirtualEnabled = computed(() => {
        const { virtual } = unref(propsRef);
        const { enabled } = unref(config);
        const data = unref(dataSource);

        // 只有在启用虚拟滚动、有足够数据时才启用
        return virtual && enabled && data.length > 30;
    });

    // 初始化虚拟滚动参数
    const initVirtualList = () => {
        const { itemHeight, containerHeight } = unref(config);

        virtualState.itemHeight = itemHeight;
        virtualState.tableHeight = containerHeight;
        virtualState.end = Math.ceil(containerHeight / itemHeight);
        virtualState.count = virtualState.end - virtualState.start + 4;

        // 获取容器的类名
        const container = unref(containerRef)?.$el;
        if (container) {
            const classList = Array.from(container.classList);
            const qTableClass = classList.find((cls) => cls.includes('q-table'));
            virtualState.className = qTableClass || '';
        }
    };

    // 初始化DOM元素和样式
    const initDOMElements = () => {
        const className = virtualState.className ? `.${virtualState.className} ` : '';

        const outerWrapperDom = document.querySelector(`${className}.ant-table`);
        if (outerWrapperDom) {
            outerWrapperDom.classList.add('virtual-enabled');
        }

        // 获取滚动容器和内容容器
        virtualState.wrapperDom = document.querySelector(`${className}.ant-table-body`);
        if (virtualState.wrapperDom) {
            virtualState.contentDom = virtualState.wrapperDom.querySelector('table');
        }

        if (!virtualState.wrapperDom || !virtualState.contentDom) return;

        // 样式调整
        virtualState.wrapperDom.style.position = 'relative';
        virtualState.wrapperDom.style.top = '0';
        virtualState.wrapperDom.style.left = '0';
        virtualState.contentDom.style.position = 'absolute';

        // 创建占位元素，撑起高度
        createPlaceholder();

        // 添加滚动监听
        virtualState.wrapperDom.addEventListener('scroll', throttledScrollHandler as unknown as EventListener);
    };

    // 创建占位符元素
    const createPlaceholder = () => {
        if (!virtualState.wrapperDom) return;

        if (virtualState.placeholderDom) {
            virtualState.wrapperDom.removeChild(virtualState.placeholderDom);
        }

        const placeholderDom = document.createElement('div');
        placeholderDom.className = 'placeholder-dom';
        placeholderDom.style.height = `${unref(dataSource).length * virtualState.itemHeight}px`;
        placeholderDom.style.position = 'absolute';
        placeholderDom.style.top = '0';
        placeholderDom.style.left = '0';
        placeholderDom.style.right = '0';
        placeholderDom.style.zIndex = '-1';

        virtualState.wrapperDom.appendChild(placeholderDom);
        virtualState.placeholderDom = placeholderDom;
    };

    // 处理滚动事件
    const handleScroll = () => {
        if (!virtualState.wrapperDom || !virtualState.contentDom || !unref(isVirtualEnabled)) return;

        // 获取滚动偏移量
        const scrollTop = virtualState.wrapperDom.scrollTop;

        // 重新计算start和end
        const dataLen = unref(dataSource).length;
        virtualState.start = Math.floor(scrollTop / virtualState.itemHeight);
        virtualState.end = Math.min(dataLen, virtualState.start + virtualState.count);

        // 内容DOM元素进行偏移，保证视觉可见
        virtualState.currentOffset = scrollTop - (scrollTop % virtualState.itemHeight);
        virtualState.contentDom.style.transform = `translateY(${virtualState.currentOffset}px)`;
    };

    // 节流的滚动处理函数
    const throttledScrollHandler = throttle(handleScroll, unref(config).throttleDelay);

    // 滚动到指定位置
    function scrollToIndex(index: number, align: 'top' | 'center' | 'bottom' = 'top') {
        if (!virtualState.wrapperDom || !unref(isVirtualEnabled)) return;

        const { itemHeight } = virtualState;
        const { tableHeight } = virtualState;
        let scrollTop = index * itemHeight;

        if (align === 'center') {
            scrollTop = scrollTop - tableHeight / 2 + itemHeight / 2;
        } else if (align === 'bottom') {
            scrollTop = scrollTop - tableHeight + itemHeight;
        }

        const maxScrollTop = unref(dataSource).length * itemHeight - tableHeight;
        scrollTop = Math.max(0, Math.min(scrollTop, maxScrollTop));

        virtualState.wrapperDom.scrollTop = scrollTop;
    }

    // 滚动到指定的数据项
    function scrollToRow(rowKey: string | number, align: 'top' | 'center' | 'bottom' = 'top') {
        const data = unref(dataSource);
        const props = unref(propsRef);
        const rowKeyField = props.rowKey || 'id';

        const index = data.findIndex((item) => {
            const key = typeof rowKeyField === 'function' ? rowKeyField(item) : item[rowKeyField];
            return key === rowKey;
        });

        if (index !== -1) {
            scrollToIndex(index, align);
        }
    }

    // 更新占位符高度
    const updatePlaceholderHeight = () => {
        if (virtualState.placeholderDom) {
            const dataLen = unref(dataSource).length;
            virtualState.placeholderDom.style.height = `${dataLen * virtualState.itemHeight}px`;
        }
    };

    // 监听数据变化
    watch(
        () => unref(dataSource).length,
        async (val) => {
            if (config.value.enabled) {
                if (!init.value && val > 0) {
                    await nextTick();
                    initVirtualList();
                    initDOMElements();
                    init.value = true;
                    await nextTick();
                }
                if (unref(isVirtualEnabled) || !!virtualState.placeholderDom) {
                    if (!unref(isVirtualEnabled) && virtualState.wrapperDom && virtualState.contentDom) {
                        virtualState.wrapperDom.scrollTop = 0;
                        virtualState.contentDom.style.transform = `translateY(0px)`;
                    }
                    updatePlaceholderHeight();
                }
            }
        },
        {
            immediate: true,
        },
    );

    // 监听配置变化
    watch(
        () => unref(config),
        (newConfig) => {
            if (config.value.enabled) {
                virtualState.itemHeight = newConfig.itemHeight;
                virtualState.tableHeight = newConfig.containerHeight;
                if (unref(isVirtualEnabled)) {
                    const newCount = Math.ceil(newConfig.containerHeight / newConfig.itemHeight);
                    if (newCount > virtualState.count) {
                        virtualState.end += newCount - virtualState.count;
                    } else {
                        virtualState.end -= newCount - virtualState.count;
                    }
                    virtualState.count = Math.ceil(newConfig.containerHeight / newConfig.itemHeight) + 4;
                    updatePlaceholderHeight();
                }
            }
        },
        { deep: true },
    );

    onUnmounted(() => {
        // 清理事件监听
        if (virtualState.wrapperDom) {
            virtualState.wrapperDom.removeEventListener('scroll', throttledScrollHandler as unknown as EventListener);
        }

        // 清理占位符
        if (virtualState.placeholderDom && virtualState.wrapperDom) {
            virtualState.wrapperDom.removeChild(virtualState.placeholderDom);
        }
    });

    // 计算可见数据
    const visibleData = computed(() => {
        if (!unref(isVirtualEnabled)) {
            return unref(dataSource);
        }
        const data = unref(dataSource);
        return data.slice(virtualState.start, virtualState.end);
    });

    // 获取可见行的真实索引
    function getRealIndex(virtualIndex: number): number {
        return virtualState.start + virtualIndex;
    }

    // 检查索引是否在可见范围内
    function isIndexVisible(index: number): boolean {
        return index >= virtualState.start && index <= virtualState.end;
    }

    // 更新配置
    function updateConfig(newConfig: Partial<VirtualScrollConfig>) {
        Object.assign(virtualState, newConfig);
        if (unref(isVirtualEnabled)) {
            updatePlaceholderHeight();
        }
    }

    return {
        // 状态
        virtualState: readonly(virtualState),
        isVirtualEnabled,
        config,

        // 数据
        visibleData,

        // 方法
        scrollToIndex,
        scrollToRow,
        getRealIndex,
        isIndexVisible,
        updateConfig,

        // 滚动信息
        scrollInfo: computed(() => ({
            start: virtualState.start,
            end: virtualState.end,
            currentOffset: virtualState.currentOffset,
            count: virtualState.count,
            totalCount: unref(dataSource).length,
        })),
    };
}
