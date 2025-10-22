// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';

import { BarChart, LineChart, PieChart, MapChart, PictorialBarChart, RadarChart } from 'echarts/charts';

import { TitleComponent, TooltipComponent, GridComponent, PolarComponent, AriaComponent, ParallelComponent, LegendComponent, RadarComponent, ToolboxComponent, DataZoomComponent, VisualMapComponent, TimelineComponent, CalendarComponent, GraphicComponent, MarkLineComponent, MarkPointComponent } from 'echarts/components';

import { SVGRenderer } from 'echarts/renderers';

echarts.use([LegendComponent, TitleComponent, TooltipComponent, GridComponent, PolarComponent, AriaComponent, ParallelComponent, BarChart, LineChart, PieChart, MapChart, RadarChart, SVGRenderer, PictorialBarChart, RadarComponent, ToolboxComponent, DataZoomComponent, VisualMapComponent, TimelineComponent, CalendarComponent, GraphicComponent, MarkLineComponent, MarkPointComponent]);

import type { EChartsOption } from 'echarts';
import { computed, onUnmounted, ref, type Ref, unref, watch, nextTick, type ComputedRef } from 'vue';

export type { EChartsOption };
interface EChartsInitOpts {
    locale?: string;
    renderer?: 'canvas' | 'svg';
    devicePixelRatio?: number;
    useDirtyRect?: boolean;
    useCoarsePointer?: boolean;
    pointerSize?: number;
    ssr?: boolean;
    width?: number | string;
    height?: number | string;
}

export function useEcharts(elRef: Ref<HTMLDivElement>, theme: 'light' | 'dark' | 'default' = 'default', getThemeRef?: ComputedRef<string>, initOpts?: EChartsInitOpts) {
    const _themeMode = getThemeRef || { value: 'light' };
    const getDarkMode = computed(() => {
        return theme == 'default' ? _themeMode.value : theme;
    });
    let chartInstance: echarts.ECharts | null = null;
    const cacheOptions = ref({}) as Ref<EChartsOption>;

    function init_echarts(t = theme, customOpts?: EChartsInitOpts) {
        const $el = unref(elRef);
        if (!$el || !unref($el)) {
            return;
        }
        chartInstance = echarts.init($el, t, customOpts || initOpts || {});
    }

    const getOptions = computed(() => {
        if (getDarkMode.value !== 'dark') {
            return cacheOptions.value as EChartsOption;
        }
        // console.log(cacheOptions.value);
        return {
            backgroundColor: 'transparent',
            ...cacheOptions.value,
        } as EChartsOption;
    });

    function set_options(options: EChartsOption, clear = true) {
        cacheOptions.value = {}; // 重置后再进行赋值, 以便computed监听到深层次属性
        cacheOptions.value = options;
        if (unref(elRef)?.offsetHeight === 0) {
            setTimeout(() => {
                set_options(unref(getOptions));
            }, 30);
            return;
        }
        nextTick(() => {
            setTimeout(() => {
                if (!chartInstance) {
                    init_echarts(getDarkMode.value as 'default');

                    if (!chartInstance) return;
                }
                clear && chartInstance?.clear();

                chartInstance?.setOption(getOptions.value);
            }, 30);
        });
    }

    watch(
        () => getDarkMode.value,
        (theme) => {
            if (chartInstance) {
                // 销毁实例，实例销毁后无法再被使用
                chartInstance.dispose();
                init_echarts(theme as 'default');
                set_options(cacheOptions.value);
            }
        },
    );

    onUnmounted(() => {
        if (!chartInstance) return;
        chartInstance.dispose();
        chartInstance = null;
    });

    function get_instance(): echarts.ECharts | null {
        if (!chartInstance) {
            init_echarts(getDarkMode.value as 'default');
        }
        return chartInstance;
    }

    function addComp(comp: any[]) {
        echarts.use(comp);
    }

    function rerender(newInitOpts?: EChartsInitOpts) {
        if (chartInstance) {
            chartInstance.dispose();
            init_echarts(getDarkMode.value as 'default', newInitOpts);
        }
    }

    return {
        setOptions: set_options,
        echarts,
        getInstance: get_instance,
        addComp,
        rerender,
    };
}
