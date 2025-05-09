import type { Options } from './types';

export const libraryName = '@quantum-design/vue3-pc-ui';

const allComponents: string[] = [
    'QLoading', 
    'QTag', 
    'QAntdThemeModeButton',
    'QTreeTable',
    'QWatemark'
];

const allNoStylesComponents: string[] = [
    'QAntdThemeModeButton'
];

const defaultInclude: RegExp[] = [
    /\.vue$/,
    /\.vue\?vue/,
    /\.vue\?v=/,
    /\.((c|m)?j|t)sx?$/
];

const defaultExclude: RegExp[] = [
    /[\\/]node_modules[\\/]/,
    /[\\/]\.git[\\/]/,
    /[\\/]\.nuxt[\\/]/
];

export const defaults: Options = {
    components: allComponents,
    noStylesComponents: allNoStylesComponents,
    importStyle: 'css',
    include: defaultInclude,
    exclude: defaultExclude
};
