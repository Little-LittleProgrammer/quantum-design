import {createAxios} from '@wuefront/http';
import { router } from '@/router';
import { useViteEnv } from '@/hooks/settings/use-vite-env';
import { useGlobalStore } from '@/store/modules/global';
import { ContentTypeEnum } from '@wuefront/shared/enums';
import { get_format_decimals_values, set_format_decimals_values } from '@/hooks/specific/use-values-deal';

let _requestNum = 0; // 请求数量
let _requestPageUrl = ''; // 请求地址所在页面

const env = useViteEnv();

function custom_request(config: any) {
    // 切换页面请求数归零 防止loading无法消失bug
    if (_requestPageUrl != router.currentRoute.value.path){ // 切换页面请求数归零 防止loading无法消失bug
        _requestPageUrl = router.currentRoute.value.path;
        _requestNum = 0;
    }
    if (!config.url.includes('/site/get-env')){ // 记录请求数
        if (_requestNum < 0){
            _requestNum = 0;
        }
        _requestNum++;
    }
    if (config.requestOptions.notDeal) { // 如果不需要进行数据处理, 直接返回
        return config;
    }
    if (config.data) {
        config.data = set_format_decimals_values(config.data); // 处理浮点数
    } else {
        config.params = set_format_decimals_values(config.params); // 处理浮点数
    }

    return config;
}

function custom_request_error(error:any) {
    const globalStore = useGlobalStore();
    if (error.config != undefined && !error.config?.url?.includes('/site/get-env')){
        _requestNum--;
        if (_requestNum <= 0){
            if (globalStore.dataLoading){
                globalStore.dataLoading = false;
            }
            if (globalStore.pageLoading){
                globalStore.pageLoading = false;
            }
        }
    }
}

function custom_response(res: any) {
    const globalStore = useGlobalStore();
    if (!res.config.url!.includes('/site/get-env')){
        _requestNum--;
        if (_requestNum <= 0){
            if (globalStore.dataLoading){
                globalStore.dataLoading = false;
            }
            if (globalStore.pageLoading){
                globalStore.pageLoading = false;
            }
        }
    }
    globalStore.date = res.headers.date ? new Date(res.headers.date) : new Date();
    if (!res.config.requestOptions.notDeal) {
        res.data.data = get_format_decimals_values(res.data.data);
    }
    return res;
}

function custom_response_error(error:any) {
    const globalStore = useGlobalStore();
    if (error.code === 'ERR_CANCELED' || (error.config != undefined && !error.config?.url?.includes('/site/get-env'))){
        _requestNum--;
        if (_requestNum <= 0){
            if (globalStore.dataLoading){
                globalStore.dataLoading = false;
            }
            if (globalStore.pageLoading){
                globalStore.pageLoading = false;
            }
        }
    }
}

function get_env() {
    const globalStore = useGlobalStore();
    return globalStore.environmentData.env || '1';
}

export const defHttp = createAxios({
    customTransform: {
        customRequest: custom_request,
        customRequestError: custom_request_error,
        customResponse: custom_response,
        customResponseError: custom_response_error
    },
    headers: {'Content-Type': ContentTypeEnum.JSON},
    requestOptions: {
        // 接口地址
        apiUrl: env.apiUrl,
        // 接口拼接地址
        urlPrefix: env.urlPrefix,
        uploadUrl: env.uploadUrl,
        env: get_env
    }
});
