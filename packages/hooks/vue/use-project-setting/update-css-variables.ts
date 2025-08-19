import { BUILT_IN_THEME_PRESETS } from './constants';
import type { IProjectConfig } from './types';
import { generatorColorVariables } from '@quantum-design/shared/color';
import { js_utils_update_css_variables as executeUpdateCSSVariables } from '@quantum-design/utils';

export function isDarkMode(theme: string) {
    let dark = theme === 'dark';
    if (theme === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const dom = document.documentElement;
        dom.dataset.system = dark ? 'dark' : 'light';
    }
    return dark;
}

/**
 * 更新主要的 CSS 变量
 * @param  preference - 当前偏好设置对象，它的颜色值将被转换成 HSL 格式并设置为 CSS 变量。
 */
function updateMainColorVariables(config: IProjectConfig) {
    if (!config.theme) {
        return;
    }
    const { colorError, colorPrimary, colorSuccess, colorWarning } = config.theme;

    const colorVariables = generatorColorVariables([
        { color: colorPrimary, name: 'primary-color' },
        { alias: 'warning-color', color: colorWarning, name: 'yellow-color' },
        { alias: 'success-color', color: colorSuccess, name: 'green-color' },
        { alias: 'error-color', color: colorError, name: 'red-color' },
    ]);

    // 要设置的 CSS 变量映射
    const colorMappings = {
        '--green-color-500': '--success-color',
        '--primary-color-500': '--primary-color',
        '--red-color-500': '--error-color',
        '--yellow-color-500': '--warning-color',
    };

    // 统一处理颜色变量的更新
    Object.entries(colorMappings).forEach(([sourceVar, targetVar]) => {
        const colorValue = colorVariables[sourceVar];
        if (colorValue) {
            document.documentElement.style.setProperty(targetVar, colorValue);
        }
    });
    executeUpdateCSSVariables(colorVariables);
}

export function updateCssVariables(config: IProjectConfig) {
    const root = document.documentElement;
    if (!root || !config.theme) return;

    const { builtinType, mode, radius } = config.theme;

    // html 设置 dark 类
    if (Reflect.has(config.theme, 'mode')) {
        const dark = isDarkMode(mode);
        root.classList.toggle('dark', dark);
    }

    // html 设置 data-theme=[builtinType] 主题色
    if (Reflect.has(config.theme, 'builtinType')) {
        const rootTheme = root.dataset.theme;
        if (rootTheme !== builtinType) {
            root.dataset.theme = builtinType;
        }
    }

    // 获取当前的内置主题
    const currentBuiltType = [...BUILT_IN_THEME_PRESETS].find((item) => item.type === builtinType);

    let builtinTypeColorPrimary: string | undefined = '';

    if (currentBuiltType) {
        const isDark = isDarkMode(mode);
        // 设置不同主题的主要颜色
        const color = isDark ? currentBuiltType.darkPrimaryColor || currentBuiltType.primaryColor : currentBuiltType.primaryColor;
        builtinTypeColorPrimary = color || currentBuiltType.color;
    }

    // 如果内置主题颜色和自定义颜色都不存在，则不更新主题颜色
    if (builtinTypeColorPrimary || Reflect.has(config.theme, 'colorPrimary') || Reflect.has(config.theme, 'colorError') || Reflect.has(config.theme, 'colorSuccess') || Reflect.has(config.theme, 'colorWarning')) {
        updateMainColorVariables(config);
    }
    // 更新圆角
    if (Reflect.has(config.theme, 'radius')) {
        document.documentElement.style.setProperty('--radius', `${radius}rem`);
    }
}
