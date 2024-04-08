import type { Options } from '../types';
import { libraryName } from '../config';
import { kebab_case } from '../utils';
import {matchComponents} from '@quantum-design/shared/enums';

export function get_style_dir(config: Options, name: string) {
    if (config.importStyle === false) {
        return undefined;
    }
    let _styleDir;
    const _total = matchComponents.length;
    for (let i = 0; i < _total; i++) {
        const matcher = matchComponents[i];
        if (name.match(matcher.pattern)) {
            _styleDir = matcher.styleDir;
            break;
        }
    }
    const _name = kebab_case(name.slice(5));
    const type = config.importStyle === 'scss' ? 'scss' : 'css';
    return `${libraryName}/dist/es/style/${_styleDir}/${_name}.${type}`;
}

// 获取当前组件样式目录
export function resolve_styles(config: Options, name: string) {
    const { components, noStylesComponents } = config;

    if ((components && !components.includes(name)) || noStylesComponents.includes(name)) {
        return undefined;
    }
    return /^QAntd[A-Z]/.test(name) ? get_style_dir(config, name) : undefined;
}

