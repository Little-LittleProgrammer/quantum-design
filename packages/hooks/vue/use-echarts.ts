// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';

import {
    BarChart,
    LineChart,
    PieChart,
    MapChart,
    PictorialBarChart,
    RadarChart
} from 'echarts/charts';

import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    AriaComponent,
    ParallelComponent,
    LegendComponent,
    RadarComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    TimelineComponent,
    CalendarComponent,
    GraphicComponent
} from 'echarts/components';

import { SVGRenderer } from 'echarts/renderers';

echarts.use([
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    AriaComponent,
    ParallelComponent,
    BarChart,
    LineChart,
    PieChart,
    MapChart,
    RadarChart,
    SVGRenderer,
    PictorialBarChart,
    RadarComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    TimelineComponent,
    CalendarComponent,
    GraphicComponent
]);

import type { EChartsOption } from 'echarts';
import { js_create_local_storage } from '@quantum-design/utils/extra';
import { computed, onUnmounted, ref, Ref, unref, watch, nextTick, ComputedRef } from 'vue';

export type {EChartsOption};

export function useEcharts(
    elRef: Ref<HTMLDivElement>,
    theme: 'light' | 'dark' | 'default' = 'default',
    getThemeRef?: ComputedRef<string>
) {
    const ls = js_create_local_storage();
    const _themeMode = getThemeRef || ls.get('themeMode');
    const getDarkMode = computed(() => {
        return theme == 'default' ? _themeMode.value : theme;
    });
    let chartInstance: echarts.ECharts | null = null;
    const cacheOptions = ref({}) as Ref<EChartsOption>;

    function init_echarts(t = theme) {
        const $el = unref(elRef);
        if (!$el || !unref($el)) {
            return;
        }

        chartInstance = echarts.init($el, t);
    }

    const getOptions = computed(() => {
        if (getDarkMode.value !== 'dark') {
            return cacheOptions.value as EChartsOption;
        }
        // console.log(cacheOptions.value);
        return {
            backgroundColor: 'transparent',
            ...cacheOptions.value
        } as EChartsOption;
    });

    function set_options(options: EChartsOption, clear = true) {
        cacheOptions.value = {};// 重置后再进行赋值, 以便computed监听到深层次属性
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

    watch(() => getDarkMode.value, (theme) => {
        if (chartInstance) {
            // 销毁实例，实例销毁后无法再被使用
            chartInstance.dispose();
            init_echarts(theme as 'default');
            set_options(cacheOptions.value);
        }
    });

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

    return {
        setOptions: set_options,
        echarts,
        getInstance: get_instance
    };
}

