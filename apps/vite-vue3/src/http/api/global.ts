import { defHttp } from '../axios';
enum Api {
    GetEnv= '/check/env',
    upload= '/common/file/upload',
    directionSelect= '/common/direction/select',
    directionList= '/common/direction/list',
    citySelect='/common/province/list',

}
interface IGetEnv {
    env: string,
    username: string
}

export interface IUploadData {
    id: string;
    url: string;
}

export type IVersion = Record<'max' | 'min', number>
export type IDuration = Record<'start' | 'end', string>

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

/**
 * pixiu.MediaAppVersion，媒体版本
 */
export interface IMediaAppVersion {
    android_version?: IAppVersion |IAppVersion[];
    ios_version?: IAppVersion |IAppVersion[];
    media_id?: number | string;
}

/**
 * pixiu.AppVersion
 */
export interface IAppVersion {
    max?: number;
    min?: number;
}
