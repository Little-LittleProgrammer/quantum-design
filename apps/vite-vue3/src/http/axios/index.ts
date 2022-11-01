import {createAxios} from '@qmfront/http';
import { router } from '@/router';
import { useViteEnv } from '@/hooks/settings/use-vite-env';
import { useGlobalStore } from '@/store/modules/global';
import { ContentTypeEnum } from '@qmfront/shared/enums';

let _requestNum = 0; // 请求数量
let _requestPageUrl = ''; // 请求地址所在页面
let _pageLoadTime = ''; // 页面时间戳

const env = useViteEnv();

function custom_request(config: any) {
    // 切换页面请求数归零 防止loading无法消失bug
    if (_requestPageUrl != router.currentRoute.value.path || (_requestPageUrl == router.currentRoute.value.path && _pageLoadTime != router.currentRoute.value.query.t)){ // 切换页面请求数归零 防止loading无法消失bug
        _requestPageUrl = router.currentRoute.value.path;
        _pageLoadTime = router.currentRoute.value.query.t + '';
        _requestNum = 0;
    }
    if (!config.url.includes('/site/get-env')){ // 记录请求数
        if (_requestNum < 0){
            _requestNum = 0;
        }
        _requestNum++;
    }

    return config;
}

function custom_request_error(error:any) {
    const globalStore = useGlobalStore();
    if (error.response?.config != undefined && !error.response?.config?.url?.includes('/site/get-env')){
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

function custom_response_error(error:any) {
    const globalStore = useGlobalStore();
    if (error.response?.config != undefined && !error.response?.config?.url?.includes('/site/get-env')){
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
    globalStore.date = new Date(res.headers.date);
    return res;
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
