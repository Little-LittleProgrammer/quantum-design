import { defHttp } from '../axios';
enum Api {
    GetEnv= '/manage/check/get-env',
    upload= '/sponsor/upload/upload',
    directionSelect= '/common/direction/select',
    directionList= '/common/direction/list',
    citySelect='/common/province/list'
}
interface IGetEnv {
    env: string,
    username: string
}

export type IVersion = Record<'max' | 'min', number>
export type IDuration = Record<'start' | 'end', string>

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
