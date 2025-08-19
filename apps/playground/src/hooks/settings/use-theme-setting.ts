import { computed, type Ref } from 'vue';
import { theme as antdTheme } from 'ant-design-vue';
import { useAntdDesignTokens } from '@quantum-design/hooks/vue/use-design-tokens';

// 写成hooks, 方便以后扩展, 扩展项目可视化配置
export function useThemeSetting(theme: Ref<'dark' | 'light'>) {
    const { tokens } = useAntdDesignTokens();
    const _tokens = {
        colorPrimary: tokens.colorPrimary,
        colorLink: tokens.colorLink,
        colorSuccess: tokens.colorSuccess,
        colorPrimaryHover: tokens.colorPrimaryHover,
        colorLinkHover: tokens.colorLinkHover,
        colorWarning: tokens.colorWarning,
        colorError: tokens.colorError,
        colorTextDisabled: tokens.colorTextDisabled,
    };
    const getThemeToken = computed(() => {
        if (theme.value === 'dark') {
            return {
                token: _tokens,
                algorithm: antdTheme.darkAlgorithm,
            };
        } else {
            return {
                token: _tokens,
                algorithm: antdTheme.defaultAlgorithm,
            };
        }
    });

    return {
        getThemeToken,
    };
}
