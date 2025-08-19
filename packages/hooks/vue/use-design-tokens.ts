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
        colorBorder: '',
        colorBorderSecondary: '',
        colorError: '',
        colorInfo: '',
        colorPrimary: '',
        colorSuccess: '',
        colorTextBase: '',
        colorWarning: '',
        colorLink: '',
        colorPrimaryHover: '',
        colorLinkHover: '',
        colorTextDisabled: '',
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

            tokens.colorLink = getCssVariableValue('--link-color');

            tokens.colorPrimaryHover = getCssVariableValue('--hover-link-color');

            tokens.colorLinkHover = getCssVariableValue('--hover-link-color');

            tokens.colorTextBase = getCssVariableValue('--text-color');
            tokens.colorTextDisabled = getCssVariableValue('--disabled-color');
            tokens.colorBorderSecondary = tokens.colorBorder = getCssVariableValue('--border-color-base');
            tokens.colorBgElevated = getCssVariableValue('--aside-bg');

            tokens.colorBgContainer = getCssVariableValue('--aside-bg');

            tokens.colorBgBase = getCssVariableValue('--body-bg');

            tokens.borderRadius = getCssVariableValue('--body-bg');
        },
        { immediate: true },
    );

    return {
        tokens,
    };
}
