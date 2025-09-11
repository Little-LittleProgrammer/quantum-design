import type { Config } from 'tailwindcss';

import path from 'node:path';

import { getPackagesSync } from '@manypkg/get-packages';
import animate from 'tailwindcss-animate';

import { enterAnimationPlugin } from './plugins/entry';

const { packages } = getPackagesSync(process.cwd());

const tailwindPackages: string[] = [];

// 不同打包配置替换
packages.forEach((pkg) => {
    if (pkg.dir.includes('apps') || pkg.dir.includes('packages/vue3-antd-pc-ui') || pkg.dir.includes('packages/vue3-pc-ui') || pkg.dir.includes('packages/styles')) {
        tailwindPackages.push(path.join(pkg.dir, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'));
    }
});

const customColors = {
    green: {
        ...createColorsPalette('green-color'),
    },
    header: {
        DEFAULT: 'var(--header-bg)',
    },
    main: {
        DEFAULT: 'var(--body-bg)',
    },
    red: {
        ...createColorsPalette('red-color'),
    },
    success: {
        ...createColorsPalette('success-color'),
        DEFAULT: 'var(--success-color)',
    },
    warning: {
        ...createColorsPalette('warning-color'),
        DEFAULT: 'var(--warning-color)',
    },
    yellow: {
        ...createColorsPalette('yellow-color'),
    },
};

export default {
    content: ['./index.html', ...tailwindPackages],
    darkMode: 'selector',
    plugins: [animate, enterAnimationPlugin],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            spacing: {
                '0': '0px',
                px: '1px',
                '0.5': '2px',
                '1': '4px',
                '1.5': '6px',
                '2': '8px',
                '2.5': '10px',
                '3': '12px',
                '3.5': '14px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '7': '28px',
                '8': '32px',
                '9': '36px',
                '10': '40px',
                '11': '44px',
                '12': '48px',
                '14': '56px',
                '16': '64px',
                '20': '80px',
                '24': '96px',
                '28': '112px',
                '32': '128px',
                '36': '144px',
                '40': '160px',
                '44': '176px',
                '48': '192px',
                '52': '208px',
                '56': '224px',
                '60': '240px',
                '64': '256px',
                '72': '288px',
                '80': '320px',
                '96': '384px',
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'collapsible-down': 'collapsible-down 0.2s ease-in-out',
                'collapsible-up': 'collapsible-up 0.2s ease-in-out',
                float: 'float 5s linear 0ms infinite',
            },

            animationDuration: {
                '2000': '2000ms',
                '3000': '3000ms',
            },
            borderRadius: {
                lg: 'var(--border-radius-base)',
                md: 'calc(var(--border-radius-base) - 2px)',
                sm: 'calc(var(--border-radius-base) - 4px)',
                xl: 'calc(var(--border-radius-base) + 4px)',
            },
            boxShadow: {
                float: `0 6px 16px 0 rgb(0 0 0 / 8%),
          0 3px 6px -4px rgb(0 0 0 / 12%),
          0 9px 28px 8px rgb(0 0 0 / 5%)`,
            },
            colors: {
                ...customColors,
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'collapsible-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-collapsible-content-height)' },
                },
                'collapsible-up': {
                    from: { height: 'var(--radix-collapsible-content-height)' },
                    to: { height: '0' },
                },
                float: {
                    '0%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0)' },
                },
            },
            zIndex: {
                '100': '100',
                '1000': '1000',
            },
        },
    },
    safelist: ['dark'],
} as Config;

function createColorsPalette(name: string) {
    // backgroundLightest: '#EFF6FF', // Tailwind CSS 默认的 `blue-50`
    //         backgroundLighter: '#DBEAFE',  // Tailwind CSS 默认的 `blue-100`
    //         backgroundLight: '#BFDBFE',    // Tailwind CSS 默认的 `blue-200`
    //         borderLight: '#93C5FD',        // Tailwind CSS 默认的 `blue-300`
    //         border: '#60A5FA',             // Tailwind CSS 默认的 `blue-400`
    //         main: '#3B82F6',               // Tailwind CSS 默认的 `blue-500`
    //         hover: '#2563EB',              // Tailwind CSS 默认的 `blue-600`
    //         active: '#1D4ED8',             // Tailwind CSS 默认的 `blue-700`
    //         backgroundDark: '#1E40AF',     // Tailwind CSS 默认的 `blue-800`
    //         backgroundDarker: '#1E3A8A',   // Tailwind CSS 默认的 `blue-900`
    //         backgroundDarkest: '#172554',  // Tailwind CSS 默认的 `blue-950`

    // •	backgroundLightest (#EFF6FF): 适用于最浅的背景色，可能用于非常轻微的阴影或卡片的背景。
    // •	backgroundLighter (#DBEAFE): 适用于略浅的背景色，通常用于次要背景或略浅的区域。
    // •	backgroundLight (#BFDBFE): 适用于浅色背景，可能用于输入框或表单区域的背景。
    // •	borderLight (#93C5FD): 适用于浅色边框，可能用于输入框或卡片的边框。
    // •	border (#60A5FA): 适用于普通边框，可能用于按钮或卡片的边框。
    // •	main (#3B82F6): 适用于主要的主题色，通常用于按钮、链接或主要的强调色。
    // •	hover (#2563EB): 适用于鼠标悬停状态下的颜色，例如按钮悬停时的背景色或边框色。
    // •	active (#1D4ED8): 适用于激活状态下的颜色，例如按钮按下时的背景色或边框色。
    // •	backgroundDark (#1E40AF): 适用于深色背景，可能用于主要按钮或深色卡片背景。
    // •	backgroundDarker (#1E3A8A): 适用于更深的背景，通常用于头部导航栏或页脚。
    // •	backgroundDarkest (#172554): 适用于最深的背景，可能用于非常深色的区域或极端对比色。

    return {
        50: `var(--${name}-50)`,
        100: `var(--${name}-100)`,
        200: `var(--${name}-200)`,
        300: `var(--${name}-300)`,
        400: `var(--${name}-400)`,
        500: `var(--${name}-500)`,
        600: `var(--${name}-600)`,
        700: `var(--${name}-700)`,
        // 800: `hsl(var(--${name}-800))`,
        // 900: `hsl(var(--${name}-900))`,
        // 950: `hsl(var(--${name}-950))`,
        // 激活状态下的颜色，适用于按钮按下时的背景色或边框色。
        active: `var(--${name}-700)`,
        // 浅色背景，适用于输入框或表单区域的背景。
        'background-light': `var(--${name}-200)`,
        // 适用于略浅的背景色，通常用于次要背景或略浅的区域。
        'background-lighter': `var(--${name}-100)`,
        // 最浅的背景色，适用于非常轻微的阴影或卡片的背景。
        'background-lightest': `var(--${name}-50)`,
        // 适用于普通边框，可能用于按钮或卡片的边框。
        border: `var(--${name}-400)`,
        // 浅色边框，适用于输入框或卡片的边框。
        'border-light': `var(--${name}-300)`,
        // 鼠标悬停状态下的颜色，适用于按钮悬停时的背景色或边框色。
        hover: `var(--${name}-600)`,
        // 主色文本
        text: `var(--${name}-500)`,
        // 主色文本激活态
        'text-active': `var(--${name}-700)`,
        // 主色文本悬浮态
        'text-hover': `var(--${name}-600)`,
    };
}
