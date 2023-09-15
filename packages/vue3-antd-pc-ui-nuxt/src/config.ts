import { Options } from './types';

export const libraryName = '@quantum-design/vue3-antd-pc-ui';

const allComponents: string[] = [
    'QAntdTable', 'QAntdTableAction', 'QAntdTablePagination', 'QAntdTableImg', 'QAntdTableTreeDrag',
    'QAntdIcon', 'QAntdIconPicker',
    'QAntdForm', 'QAntdSelectAll',
    'QAntdDropdown',
    'QAntdDrawer',
    'QAntdTransfer',
    'QAntdShrinkCard'
];

const allNoStylesComponents: string[] = [
    'QAntdTableTreeDrag',
    'QAntdDropdown',
    'QAntdSelectAll',
    'QAntdIcon'
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
