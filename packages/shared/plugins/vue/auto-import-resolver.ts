function kebab_case(key: string) {
    const result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
}

export interface QResolverOptions {
    importStyle: boolean | 'css' | 'scss';

    prefix: string; // package 的默认开头
    notPrefix?: string[]
    packageName: string // package名称

    moduleType: 'es' | 'lib'
}

interface IMatcher {
    pattern: RegExp
    styleDir: string
}

const matchComponents: IMatcher[] = [
    // default
    {
        pattern: /^QLoading/,
        styleDir: 'q-loading'
    },
    {
        pattern: /^QTag/,
        styleDir: 'q-tag'
    },
    {
        pattern: /^QTreeTable/,
        styleDir: 'q-tree-table'
    },
    {
        pattern: /^QWatermark/,
        styleDir: 'q-watermark'
    },
    // antd
    {
        pattern: /^QAntdBreadcrumb/,
        styleDir: 'q-breadcrumb'
    },
    {
        pattern: /^QAntdShrinkCard/,
        styleDir: 'q-card'
    },
    {
        pattern: /^QAntdDrawer/,
        styleDir: 'q-drawer'
    },
    {
        pattern: /^QAntdForm/,
        styleDir: 'q-form'
    },
    {
        pattern: /^QAntdIcon|^QAntdIconPicker/,
        styleDir: 'q-icon'
    },
    {
        pattern: /^QAntdKeepAliveTabs/,
        styleDir: 'q-keep-alive-tabs'
    },
    {
        pattern: /^QAntdSetting/,
        styleDir: 'q-setting'
    },
    {
        pattern: /^QAntdTable|^QAntdTableAction|^QAntdTablePagination|^QAntdTableTreeDrag/,
        styleDir: 'q-table'
    },
    {
        pattern: /^QAntdTransfer/,
        styleDir: 'q-transfer'
    },

    {
        pattern: /^QAntdUpload/,
        styleDir: 'q-upload'
    }
];

function get_style_dir(compName: string) {
    let _styleDir;
    const _total = matchComponents.length;
    for (let i = 0; i < _total; i++) {
        const matcher = matchComponents[i];
        if (compName.match(matcher.pattern)) {
            _styleDir = matcher.styleDir;
            break;
        }
    }
    if (!_styleDir)
        _styleDir = false;

    return _styleDir;
}

function get_side_effects(dirName: string, options: QResolverOptions) {
    const { importStyle, packageName, moduleType} = options;
    if (!importStyle)
        return;

    const _styleDir = get_style_dir(dirName);
    if (!_styleDir) {
        return;
    }
    return `${packageName}/dist/${moduleType}/style/${_styleDir}/index.${importStyle}`;
}

const defaultOptions: QResolverOptions[] = [{
    importStyle: 'css',
    prefix: 'Q',
    notPrefix: ['QAntd', 'QEle'],
    packageName: '@quantum-design/vue3-pc-ui',
    moduleType: 'es'
}, {
    importStyle: 'css',
    prefix: 'QAntd',
    packageName: '@quantum-design/vue3-antd-pc-ui',
    moduleType: 'es'
}];

export function PixiuResolver(options: QResolverOptions[] = defaultOptions) {
    const _resolver = options.map(item => {
        const { prefix, moduleType, packageName } = item;
        return {
            type: 'component',
            resolve: (name: string) => {
                console.log(name);
                if (name.startsWith(prefix) && (!item.notPrefix?.length || (item.notPrefix?.length && !item.notPrefix.some(e => name.startsWith(e))))) {
                    return {
                        name: name,
                        from: `${packageName}/${moduleType}`,
                        sideEffects: get_side_effects(name, item)
                    };
                }
            }
        };
    });
    return _resolver;
}
