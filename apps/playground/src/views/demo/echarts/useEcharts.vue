<template>
    <a-card class="g-mt">
        <div style="height: 500px" ref="chartRef"></div>
        <a-button @click="toggle">切换渲染模式</a-button>
        <div>{{ _renderer }}</div>
    </a-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useEcharts } from '@quantum-design/hooks/vue/use-echarts';
import { CanvasRenderer } from 'echarts/renderers';

const chartRef = ref();
const _renderer: Ref<'svg' | 'canvas'> = ref('svg');
const { setOptions: setChartOptions, addComp, rerender } = useEcharts(chartRef, undefined, undefined, { renderer: _renderer.value });
addComp([CanvasRenderer]);
function toggle() {
    _renderer.value = _renderer.value === 'svg' ? 'canvas' : 'svg';

    rerender({ renderer: _renderer.value });
    setTimeout(() => {
        setChartOptions({
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'line',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        });
    }, 1000);
}
onMounted(() => {
    setChartOptions({
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'line',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    });
});
</script>
