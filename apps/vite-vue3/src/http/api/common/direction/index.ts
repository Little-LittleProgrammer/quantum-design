import { defHttp } from '../../../axios';
import { IDirectionList, IDirectionSelect } from './interface';
enum Api {
    directionSelect= '/common/direction/select',
    directionList= '/common/direction/list',
    citySelect='/common/province/list'
}

export function api_get_direction_select() {
    return defHttp.get<Result<IDirectionSelect>>({
        url: Api.directionSelect
    }, {
        cancelToken: false
    });
}

export function api_get_direction_list(params: Record<'direction_id', number[]>) {
    return defHttp.get<Result<IDirectionList>>({
        url: Api.directionList,
        params
    });
}

export function api_get_city_select() {
    return defHttp.get<Result<Record<'list', ISelectOption[]>>>({
        url: Api.citySelect
    });
}
