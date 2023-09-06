import { Options } from '../types';
import { libraryName } from '../config';
import { kebab_case } from '../utils';

export function get_style_dir(config: Options, name: string) {
    if (config.importStyle === false) {
        return undefined;
    }
    const _dir = kebab_case(name);
    const type = config.importStyle === 'scss' ? 'scss' : 'css';
    return `${libraryName}/dist/es/style/${_dir}/index.${type}`;
}

// 获取当前组件样式目录
export function resolve_styles(config: Options, name: string) {
    const { components, noStylesComponents } = config;

    if ((components && !components.includes(name)) || noStylesComponents.includes(name)) {
        return undefined;
    }
    return /^Q[A-Z]/.test(name) ? get_style_dir(config, name) : undefined;
}
