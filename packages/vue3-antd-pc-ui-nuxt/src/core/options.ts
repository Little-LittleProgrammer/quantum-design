import { useNuxt } from '@nuxt/kit';
import { libraryName } from '../config';

export function resolve_options() {
    const nuxt = useNuxt();

    nuxt.options.build.transpile.push(libraryName);
}
