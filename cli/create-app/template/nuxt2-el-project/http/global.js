import { get } from './request';

export function api_global_env() {
    return get('/site/get-env');
}
