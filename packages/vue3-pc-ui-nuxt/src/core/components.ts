import { addComponent } from '@nuxt/kit';
import type { Options } from '../types';
import { libraryName } from '../config';
import { kebab_case } from '../utils';

export function resolve_components(config: Options) {
    const { components } = config;
    const _allComponents = components === false ? [] : components;
    _allComponents.forEach(item => {
        if (typeof item === 'string') {
            const _dir = kebab_case(item);
            addComponent({
                export: item,
                name: item,
                filePath: libraryName + `/es`
            });
        }
    });
}
 