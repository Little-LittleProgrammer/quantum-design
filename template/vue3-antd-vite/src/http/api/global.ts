import { defHttp } from '../axios';
enum Api {
    GetEnv= '/check/env',
    upload= '/common/file/upload',

}
interface IGetEnv {
    env: string,
    username: string
}

export interface IUploadData {
    id: string;
    url: string;
}
export function api_global_env() {
    return defHttp.get<Result<IGetEnv>>({url: Api.GetEnv});
}

export function api_upload(params: UploadFileParams) {
    return defHttp.uploadFile<Result<IUploadData>>(
        {
            url: Api.upload
        },
        params
    );
}

