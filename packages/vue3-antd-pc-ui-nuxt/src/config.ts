import { Options } from './types';

export const libraryName = '@q-front-npm/vue3-antd-pc-ui';

const allComponents: string[] = [
    'QAntdTable', 'QAntdTableAction', 'QAntdTablePagination', 'QAntdTableTreeDrag',
    'QAntdIcon', 'QAntdIconPicker',
    'QAntdForm', 'QAntdSelectAll',
    'QAntdBreadcrumb',
    'QAntdDropdown',
    'QAntdDrawer',
    'QAntdTransfer',
    'QAntdShrinkCard'
];

const allNoStylesComponents: string[] = [
    'QAntdDropdown'
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
