<template>
    <div class="flex flex-wrap justify-between p-1">
        <template v-for="theme in builtinThemePresets" :key="theme.type">
            <div class="flex cursor-pointer flex-col" @click="handleSelect(theme)">
                <div
                    :class="{
                        'outline-box-active': theme.type === modelValue,
                    }"
                    class="outline-box flex-center group cursor-pointer"
                >
                    <template v-if="theme.type !== 'custom'">
                        <div :style="{ backgroundColor: theme.color }" class="mx-3 my-2 size-7 rounded-md"></div>
                    </template>
                </div>
                <div class="text-muted-foreground my-2 text-center text-xs">
                    {{ typeView(theme.type) }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { BuiltinThemePreset, BuiltinThemeType } from '@quantum-design/hooks/vue/use-project-setting';
import { BUILT_IN_THEME_PRESETS } from '@quantum-design/hooks/vue/use-project-setting';
import { computed, watch } from 'vue';

defineOptions({
    name: 'PreferenceBuiltinTheme',
});

const props = defineProps<{ isDark: boolean }>();

const modelValue = defineModel<BuiltinThemeType>({ default: 'default' });
const themeColorPrimary = defineModel<string>('themeColorPrimary');

const builtinThemePresets = computed(() => {
    return [...BUILT_IN_THEME_PRESETS];
});

function typeView(name: BuiltinThemeType) {
    switch (name) {
        case 'deep-blue': {
            return '深海蓝';
        }
        case 'deep-green': {
            return '深海绿';
        }
        case 'default': {
            return '默认';
        }
        case 'gray': {
            return '烟灰灰';
        }
        case 'green': {
            return '青柠绿';
        }
        case 'orange': {
            return '橘子橙';
        }
        case 'pink': {
            return '蔷薇粉';
        }
        case 'rose': {
            return '玫瑰红';
        }
        case 'sky-blue': {
            return '天空蓝';
        }
        case 'violet': {
            return '薰衣草紫';
        }
        case 'yellow': {
            return '柠檬黄';
        }
        case 'zinc': {
            return '锌色灰';
        }
    }
}

function handleSelect(theme: BuiltinThemePreset) {
    modelValue.value = theme.type;
}

watch(
    () => [modelValue.value, props.isDark] as [BuiltinThemeType, boolean],
    ([themeType, isDark]) => {
        const theme = builtinThemePresets.value.find((item) => item.type === themeType);
        if (theme) {
            const primaryColor = isDark ? theme.darkPrimaryColor || theme.primaryColor : theme.primaryColor;

            themeColorPrimary.value = primaryColor || theme.color;
        }
    },
);
</script>
