<template>
    <div class="theme-btn" @click="change_theme">
        <a-tooltip :title="getTitle">
            <a-button size="small" type="link">
                <template #icon>
                    <svg v-if="getThemeMode == 'light'" t="1629981701741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2109" width="22" height="22">
                        <path
                            d="M241.49333333 175.36L223.57333333 157.86666666c-17.49333333-17.49333333-46.08-17.49333333-64 0l-0.42666666 0.42666667c-17.49333333 17.49333333-17.49333333 46.08 0 64l17.49333333 17.49333333c17.49333333 17.49333333 46.08 17.49333333 63.57333333 0l0.42666667-0.42666666c18.34666667-17.49333333 18.34666667-46.08 0.85333333-64zM102.82666667 465.06666666H56.74666667c-24.74666667 0-45.22666667 20.05333333-45.22666667 45.22666667v0.85333333c0 24.74666667 20.05333333 45.22666667 45.22666667 45.22666667h46.08c24.74666667 0 45.22666667-20.05333333 45.22666666-45.22666667v-0.85333333c0-25.17333333-20.48-45.22666667-45.22666666-45.22666667z m409.6-452.69333333h-0.85333334c-24.74666667 0-45.22666667 20.05333333-45.22666666 45.22666667v43.94666666c0 24.74666667 20.05333333 45.22666667 45.22666666 45.22666667h0.85333334c24.74666667 0 45.22666667-20.05333333 45.22666666-45.22666667V57.6c0-25.17333333-20.48-45.22666667-45.22666666-45.22666667z m352 145.92c-17.92-17.92-46.50666667-17.92-64-0.42666667l-17.49333334 17.49333334c-17.49333333 17.49333333-17.49333333 46.08 0 64l0.42666667 0.42666666c17.49333333 17.49333333 46.08 17.49333333 64 0l17.49333333-17.49333333c17.49333333-17.92 17.49333333-46.50666667-0.42666666-64z m-82.34666667 687.36l17.92 17.92c17.49333333 17.92 46.50666667 17.92 64 0 17.49333333-17.49333333 17.49333333-46.50666667 0-64l-17.92-17.92c-17.49333333-17.49333333-46.08-17.49333333-64 0-17.49333333 17.92-17.49333333 46.50666667 0 64z m93.86666667-335.36v0.85333333c0 24.74666667 20.05333333 45.22666667 45.22666666 45.22666667h46.08c24.74666667 0 45.22666667-20.05333333 45.22666667-45.22666667v-0.85333333c0-24.74666667-20.05333333-45.22666667-45.22666667-45.22666667h-46.08c-24.74666667 0-45.22666667 20.05333333-45.22666666 45.22666667zM512 237.65333333c-150.61333333 0-273.06666667 122.45333333-273.06666667 273.06666667s122.45333333 273.06666667 273.06666667 273.06666666 273.06666667-122.45333333 273.06666667-273.06666666-122.45333333-273.06666667-273.06666667-273.06666667z m-0.42666667 771.41333333h0.85333334c24.74666667 0 45.22666667-20.05333333 45.22666666-45.22666666v-43.94666667c0-24.74666667-20.05333333-45.22666667-45.22666666-45.22666667h-0.85333334c-24.74666667 0-45.22666667 20.05333333-45.22666666 45.22666667v43.94666667c0 24.74666667 20.48 45.22666667 45.22666666 45.22666666z m-352.42666666-146.34666666c17.92 17.92 46.50666667 17.92 64.42666666 0l17.92-17.92c17.49333333-17.49333333 17.49333333-46.08 0-64l-0.42666666-0.42666667c-17.49333333-17.49333333-46.50666667-17.49333333-64 0l-17.92 17.92c-17.49333333 18.34666667-17.49333333 46.93333333 0 64.42666667z"
                            fill="#fff"
                            p-id="2110"
                        ></path>
                    </svg>
                    <svg v-else-if="getThemeMode === 'system'" t="1755506499961" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5842" width="22" height="22">
                        <path d="M0 0h1024v1024H0z" fill="#ffffff" opacity=".01" p-id="5843"></path>
                        <path
                            d="M950.933333 602.218667A448.149333 448.149333 0 0 0 736 124.032a448.149333 448.149333 0 0 0-521.6 52.949333 42.666667 42.666667 0 1 0 56.661333 63.786667 362.816 362.816 0 0 1 596.288 344.256 42.666667 42.666667 0 1 0 83.584 17.194667zM330.666667 826.069333a362.816 362.816 0 0 1-174.08-386.88 42.666667 42.666667 0 1 0-83.584-17.152A448.149333 448.149333 0 0 0 288 899.989333a448.149333 448.149333 0 0 0 521.216-52.629333 42.666667 42.666667 0 0 0-56.597333-63.850667 362.816 362.816 0 0 1-421.973334 42.56z m141.653333-544.682666c14.464-32.661333 59.733333-33.834667 76.373333-3.370667l1.6 3.264 171.328 384a42.666667 42.666667 0 0 1-76.437333 37.76l-1.493333-2.986667-36.778667-82.453333a42.88 42.88 0 0 1-9.6 1.066667h-170.666667c-3.370667 0-6.656-0.384-9.813333-1.130667l-36.48 82.410667a42.666667 42.666667 0 0 1-53.184 22.976l-3.114667-1.237334a42.666667 42.666667 0 0 1-22.976-53.184l1.237334-3.114666 170.005333-384zM454.08 533.333333h115.221333l-57.834666-129.621333L454.08 533.333333z"
                            fill="#ffffff"
                            fill-opacity=".85"
                            p-id="5844"
                        ></path>
                    </svg>
                    <svg v-else t="1629981741093" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3285" width="22" height="22">
                        <path d="M565 200.4c25.6 44.6 40.4 96.2 40.4 151.3 0 167.9-136.1 304-304 304-22.9 0-45.2-2.6-66.7-7.4C284.5 760.7 397 839.2 527.8 839.2c177 0 320.5-143.5 320.5-320.5 0-164.4-123.8-299.8-283.3-318.3z m-252.1 43.2h-39.2v-39.2c0-10.8-8.8-19.6-19.6-19.6s-19.6 8.8-19.6 19.6v39.2h-39.2c-10.8 0-19.6 8.8-19.6 19.6s8.8 19.6 19.6 19.6h39.2V322c0 10.8 8.8 19.6 19.6 19.6s19.6-8.8 19.6-19.6v-39.2h39.2c10.8 0 19.6-8.8 19.6-19.6s-8.8-19.6-19.6-19.6z" fill="#FFF0C2" p-id="3286"></path>
                        <path d="M306.9 245.6h-35.2v-35.2c0-9.7-7.9-17.6-17.6-17.6-9.7 0-17.6 7.9-17.6 17.6v35.2h-35.2c-9.7 0-17.6 7.9-17.6 17.6 0 9.7 7.9 17.6 17.6 17.6h35.2V316c0 9.7 7.9 17.6 17.6 17.6 9.7 0 17.6-7.9 17.6-17.6v-35.2h35.2c9.7 0 17.6-7.9 17.6-17.6 0-9.7-7.9-17.6-17.6-17.6z" fill="#FFC445" p-id="3287"></path>
                        <path d="M427.8 475.3h-27.5v-27.5c0-7.6-6.2-13.8-13.8-13.8-7.6 0-13.8 6.2-13.8 13.8v27.5h-27.5c-7.6 0-13.8 6.2-13.8 13.8 0 7.6 6.2 13.8 13.8 13.8h27.5v27.5c0 7.6 6.2 13.8 13.8 13.8 7.6 0 13.8-6.2 13.8-13.8v-27.5h27.5c7.6 0 13.8-6.2 13.8-13.8 0-7.6-6.2-13.8-13.8-13.8z" fill="#FFF0C2" p-id="3288"></path>
                        <path d="M423.6 476.7h-24.7V452c0-6.8-5.5-12.4-12.4-12.4-6.8 0-12.4 5.5-12.4 12.4v24.7h-24.7c-6.8 0-12.4 5.5-12.4 12.4 0 6.8 5.5 12.4 12.4 12.4h24.7v24.7c0 6.8 5.5 12.4 12.4 12.4 6.8 0 12.4-5.5 12.4-12.4v-24.7h24.7c6.8 0 12.4-5.5 12.4-12.4 0-6.8-5.5-12.4-12.4-12.4z" fill="#FFC445" p-id="3289"></path>
                        <path d="M563.4 223c23.8 41.4 37.5 89.4 37.5 140.6 0 156-126.5 282.5-282.5 282.5-21.3 0-42-2.4-62-6.9 46.3 104.5 150.8 177.4 272.4 177.4 164.5 0 297.9-133.4 297.9-297.9 0-152.7-115.1-278.6-263.3-295.7z" fill="#FFF" p-id="3290"></path>
                    </svg>
                </template>
            </a-button>
        </a-tooltip>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
defineOptions({
    name: 'QAntdThemeModeButton',
});
import { useProjectSetting } from '@quantum-design/hooks/vue/use-project-setting';
const { updateProjectConfig, getThemeMode } = useProjectSetting();
const modeList = ['system', 'light', 'dark'];

// 动画状态管理，防止重复触发
const isAnimating = ref(false);

const getTitle = computed(() => {
    if (getThemeMode.value === 'system') {
        return '跟随系统';
    }
    return `${getThemeMode.value === 'dark' ? '暗黑' : '亮色'}主题`;
});
const change_theme = async (event: MouseEvent) => {
    // 防止动画进行中的重复触发
    if (isAnimating.value) {
        return;
    }
    const _mode = modeList[(modeList.indexOf(getThemeMode.value) + 1) % modeList.length];
    const dom = document.documentElement;

    const isNeedAnimation = (getThemeMode.value === 'system' && dom.dataset.system === 'dark') || (getThemeMode.value === 'dark' && dom.dataset.system === 'light') || getThemeMode.value === 'light';

    const isAppearanceTransition =
        // @ts-expect-error
        document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 如果不支持动画或者是系统模式，直接切换主题
    if (!isAppearanceTransition || !event || !isNeedAnimation) {
        console.log('直接切换主题', _mode);
        updateProjectConfig({
            theme: {
                mode: _mode as 'dark' | 'light' | 'system',
            },
        });
        return;
    }

    // 设置动画状态
    isAnimating.value = true;

    // 获取点击位置坐标
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    try {
        // 监听动画完成和中断的重置函数
        const resetAnimatingState = () => {
            isAnimating.value = false;
            // 移除动画标记类
            dom.classList.remove('view-transition-active');
        };

        // 创建圆形展开动画路径
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

        // 在开始动画前，给文档添加标记类，用于控制过渡效果
        dom.classList.add('view-transition-active');

        // @ts-ignore startViewTransition
        const transition = document.startViewTransition(async () => {
            // 在这里进行主题切换，View Transition API 会自动捕获前后状态
            updateProjectConfig({
                theme: {
                    mode: _mode as 'dark' | 'light' | 'system',
                },
            });
            // 等待 DOM 更新完成
            await nextTick();
        });

        // 当过渡准备就绪时，立即开始自定义圆形展开动画
        transition.ready.then(() => {
            const animation = document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 650,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)',
                },
            );

            // 监听动画事件
            animation.addEventListener('finish', resetAnimatingState);
            animation.addEventListener('cancel', resetAnimatingState);
        });

        // 额外的安全保障：最多 600ms 后重置状态
        setTimeout(resetAnimatingState, 600);

        // 监听过渡完成
        transition.finished.finally(resetAnimatingState);
    } catch (error) {
        // 如果动画失败，降级到直接切换
        console.warn('Theme transition animation failed:', error);
        updateProjectConfig({
            theme: {
                mode: _mode as 'dark' | 'light' | 'system',
            },
        });
        isAnimating.value = false;
        // 确保移除动画标记类
        dom.classList.remove('view-transition-active');
    }
};
</script>
