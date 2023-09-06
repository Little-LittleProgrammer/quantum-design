import { js_utils_first_to_upper } from '@q-front-npm/utils';

export function path_to_pascal_interface(path: string) {
    const _pathArr = path.split('/').filter(i => i);
    let _res = 'I';
    for (const path of _pathArr) {
        const _str = prop_to_pascal(path);
        _res += _str;
    }
    return _res;
}

export function prop_to_pascal(str: string, symbol:string = '-') {
    console.log(str, symbol);
    if (str) {
        const _arr = str.split(symbol).filter(i => i).map(item => {
            return js_utils_first_to_upper(item);
        });
        return _arr.join('');
    }
    return str;
}

