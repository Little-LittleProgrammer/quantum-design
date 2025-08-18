import { reactive, watch } from 'vue';
import { useProjectSetting } from './use-project-setting';

export function useAntdDesignTokens() {
    const rootStyles = getComputedStyle(document.documentElement);
    const { getProjectConfig } = useProjectSetting();

    const tokens = reactive({
        borderRadius: '' as any,
        colorBgBase: '',
        colorBgContainer: '',
        colorBgElevated: '',
        colorBgLayout: '',
        colorBgMask: '',
        colorBorder: '',
        colorBorderSecondary: '',
        colorError: '',
        colorInfo: '',
        colorPrimary: '',
        colorSuccess: '',
        colorTextBase: '',
        colorWarning: '',
        zIndexPopupBase: 2000, // 调整基础弹层层级，避免下拉等组件被弹窗或者最大化状态下的表格遮挡
    });

    const getCssVariableValue = (variable: string, trim: boolean = true) => {
        const value = rootStyles.getPropertyValue(variable);
        return trim ? value.trim() : value;
    };

    watch(
        () => getProjectConfig.value.theme,
        () => {
            tokens.colorPrimary = getCssVariableValue('--primary-color');

            tokens.colorInfo = getCssVariableValue('--primary-color');

            tokens.colorError = getCssVariableValue('--error-color');

            tokens.colorWarning = getCssVariableValue('--warning-color');

            tokens.colorSuccess = getCssVariableValue('--success-color');

            tokens.colorTextBase = getCssVariableValue('--text-color');

            // 不再需要获取 --primary-foreground

            tokens.colorBorderSecondary = tokens.colorBorder = getCssVariableValue('--border-color-base');

            // 使用合适的背景色变量
            tokens.colorBgElevated = getCssVariableValue('--aside-bg');

            tokens.colorBgContainer = getCssVariableValue('--aside-bg');

            tokens.colorBgBase = getCssVariableValue('--body-bg');

            const radius = Number.parseFloat(getCssVariableValue('--border-radius-base'));
            tokens.borderRadius = radius * 16;

            tokens.colorBgLayout = getCssVariableValue('--body-bg');
        },
        { immediate: true },
    );

    return {
        tokens,
    };
}
