import { post, get } from '@/http/request';

export function api_global_env() {
    return get('/site/get-env');
}
