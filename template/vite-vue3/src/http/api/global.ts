import { defHttp } from '../axios';
enum Api {
    GetEnv= '/manage/check/get-env',
    upload= '/sponsor/upload/upload'
}
interface IGetEnv {
    env: string,
    username: string
}

export function api_global_env() {
    return defHttp.get<Result<IGetEnv>>({url: Api.GetEnv});
}

export function api_upload(params: UploadFileParams) {
    return defHttp.uploadFile<Result>(
        {
            url: Api.upload
        },
        params
    );
}
