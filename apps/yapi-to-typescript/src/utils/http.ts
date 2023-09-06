import {js_is_number} from '@q-front-npm/utils';
import {createAxios} from '@q-front-npm/http';
import Browser from 'webextension-polyfill';

interface IApiDetailInfo {
    errcode: number;
    errmsg: string;
    data: {
        query_path: { path: string };
        path: string;
        method: string;
        title: string;
        project_id: number;
        req_body_form: {
            name: string;
            type: string;
            example: string;
            required: string;
            desc: string;
        }[];
        req_params: {
            name: string;
            desc: string;
        }
        _id: number;
        req_query: { required: '0' | '1'; name: string }[];
        res_body_type: 'raw' | 'json';
        req_body_type: 'raw' | 'json';
        res_body: string;
        req_body_other: string;
        username: string;
    };
}

interface ITransfrom {
    q: string,
}

interface ITransfromRes {

}

const yapiApi = createAxios({
    requestOptions: {
        // 接口地址
        apiUrl: 'http://yapi.km.com/'
    }
});

const transformApi = createAxios({
    requestOptions: {
        apiUrl: 'https://openapi.youdao.com/'
    }
});

export async function api_get_detail() {
    const _ids = location.href.replace(/\D/g, '/').split('/').filter(item => item);
    const _id = _ids[1];
    const _projectId = _ids[0];
    const _token = (await Browser.storage.local.get()).token?.[_projectId];
    if (js_is_number(+(_id || ''))) {
        const _value = await yapiApi.get<IApiDetailInfo>({
            url: '/interface/get',
            params: {
                id: _id,
                token: _token
            }
        });
        return _value;
    }
}

export async function api_transform_word(params: ITransfrom) {
    transformApi.post<ITransfromRes>({
        params: {
            appKey: 'appKey', // appKey
            salt: 'salt', // uuid
            from: 'en',
            to: 'zh-CHS',
            sign: 'sign', // sha256(应用ID+input+salt+curtime+应用密钥)
            signType: 'v3',
            curtime: 'curtime', // 当前UTC时间戳(秒)
            ...params
        }
    });
}
