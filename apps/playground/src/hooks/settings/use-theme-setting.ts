import { computed, type Ref } from 'vue';
import { theme as antdTheme } from 'ant-design-vue';
import { useAntdDesignTokens } from '@quantum-design/hooks/vue/use-design-tokens';

// 写成hooks, 方便以后扩展, 扩展项目可视化配置
export function useThemeSetting(theme: Ref<'dark' | 'light'>) {
    const { tokens } = useAntdDesignTokens();
    const getThemeToken = computed(() => {
        if (theme.value === 'dark') {
            return {
                token: tokens,
                algorithm: antdTheme.darkAlgorithm,
            };
        } else {
            return {
                token: tokens,
                algorithm: antdTheme.defaultAlgorithm,
            };
        }
    });

    return {
        getThemeToken,
    };
}
