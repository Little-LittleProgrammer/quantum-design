import { defHttp } from '@/http/axios';
import { IFlowConf, IFlowListReq, IFlowPolicyReq, IFlowPolicyResHeader, IFlowPolicyResList, IFlowResHeader, IFlowResList, IFlowSelect, IFlowGroupDetail } from './interface';

enum Api {
    flowSelect = '/flow/select', //一级
    flowList = '/flow/list', //一级
    flowPolicyList= '/flow_policy/list', //二级
    flowPolicyStart= '/flow/start', //二级
    flowPolicyStop= '/flow/stop', //二级
    flowPolicyDel= '/flow/delete', //二级
    flowGroupDeatil= '/flow/detail', //三级
    flowGroupSave= '/flow/save', //三级
    flowGroupList= '/flow_adv/list', //三级
    flowGroupUniSave= '/flow_adv/save', //四级
    flowGroupUniStart= '/flow_adv/start', //四级
    flowGroupUniStop= '/flow_adv/stop', //四级
    flowGroupUniDel= '/flow_adv/delete', //四级
    flowGroupSelect='/flow_group/select'
}

// 流量配置筛选框
export function api_flow_select() {
    return defHttp.get<Result<IFlowSelect>>({
        url: Api.flowSelect
    });
}

// 流量配置-列表
export function api_flow_list(params: IFlowListReq & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<IFlowResHeader, IFlowResList>>>({
        url: Api.flowList,
        params
    });
}

// 流量配置策略-list页面
export function api_flow_policy_list(params: IFlowPolicyReq & IApiPageOption) {
    return defHttp.get<Result<IApiTableData<IFlowPolicyResHeader, IFlowPolicyResList>>>({
        url: Api.flowPolicyList,
        params
    });
}

// 流量配置策略-批量开启
export function api_flow_policy_start(params: Record<'flow_id', number[]>) {
    return defHttp.get<Result>({
        url: Api.flowPolicyStart,
        params
    });
}
// 流量配置策略-批量关闭
export function api_flow_policy_stop(params: Record<'flow_id', number[]>) {
    return defHttp.get<Result>({
        url: Api.flowPolicyStop,
        params
    });
}

// 流量配置-单个详情-删除
export function api_flow_policy_delete(params: Record<'flow_id', number>) {
    return defHttp.post<Result>({
        url: Api.flowPolicyDel,
        params
    });
}

// 流量配置 - 流量组保存
export function api_flow_group_save(params:IFlowGroupDetail) {
    return defHttp.post<Result>({
        url: Api.flowGroupSave,
        params
    });
}

// 流量配置-获取单个详情
export function api_flow_group_detail(params: Record<'flow_id', number>) {
    return defHttp.get<Result<IFlowGroupDetail>>({
        url: Api.flowGroupDeatil,
        params
    });
}

// 流量配置-获取整个组
export function api_flow_group_list(params: Record<'flow_group_id', string>) {
    return defHttp.get<Result<IFlowGroupDetail>>({
        url: Api.flowGroupList,
        params
    });
}

// 流量配置 - 单个流量组保存
export function api_flow_group_uni_save(params:IFlowConf) {
    return defHttp.post<Result<Record<'flow_group_id', string>>>({
        url: Api.flowGroupUniSave,
        params
    });
}

// 流量配置-单个详情-更改状态 - 开启
export function api_flow_group_uni_start(params: Record<'flow_adv_id', number[]>) {
    return defHttp.post<Result>({
        url: Api.flowGroupUniStart,
        params
    });
}
// 流量配置-单个详情-更改状态 - 关闭
export function api_flow_group_uni_stop(params: Record<'flow_adv_id', number[]>) {
    return defHttp.post<Result>({
        url: Api.flowGroupUniStop,
        params
    });
}
// 流量配置-单个详情-更改状态
export function api_flow_group_uni_delete(params: Record<'flow_adv_id', number>) {
    return defHttp.post<Result>({
        url: Api.flowGroupUniDel,
        params
    });
}

// 流量配置-单个详情-更改状态
export function api_flow_group_select(params: Record<'ad_unit_id', number[]>) {
    return defHttp.get<Result<Record<'flow_group_list', ISelectOption[]>>>({
        url: Api.flowGroupSelect,
        params
    });
}
