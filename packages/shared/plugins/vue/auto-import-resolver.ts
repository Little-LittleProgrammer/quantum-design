import {matchComponents} from '../../enums/components';

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
    const { importStyle, packageName, moduleType, prefix} = options;
    if (!importStyle)
        return;

    const _styleDir = get_style_dir(dirName);
    if (!_styleDir) {
        return;
    }
    const _compName = kebab_case(dirName.slice(prefix.length));
    return `${packageName}/dist/${moduleType}/style/${_styleDir}/${_compName}.${importStyle}`;
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

export function QResolver(options: QResolverOptions[] = defaultOptions) {
    const _resolver = options.map(item => {
        const { prefix, moduleType, packageName } = item;
        return {
            type: 'component',
            resolve: (name: string) => {
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
