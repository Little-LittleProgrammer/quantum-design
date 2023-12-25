import { Message } from 'element-ui';
import axios from 'axios';
import qs from 'qs';
let _requestNum = 0; // 请求数量
let _requestPageUrl = ''; // 请求地址所在页面
let _pageLoadTime = ''; // 页面时间戳

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
export const service = axios.create({
    baseURL: process.env.BASE_URL, // 填写域名
    timeout: 5000
});

export default ({ store, app: { $axios, router } }) => {
    service.interceptors.request.use(
        config => {
            if (_requestPageUrl != router.app._route.path || (_requestPageUrl == router.app._route.path && _pageLoadTime != router.app._route.query.t)){ // 切换页面请求数归零 防止loading无法消失bug
                _requestPageUrl = router.app._route.path;
                _pageLoadTime = router.app._route.query.t;
                _requestNum = 0;
            }
            if (!config.url.includes('/site/get-env')){ // 记录请求数
                if (_requestNum < 0){
                    _requestNum = 0;
                }
                _requestNum++;
            }
            if (!(config.url.match(/^http/) != null || config.url.match(/^\/\//) != null)){
                config.url = '/api' + config.url; //  配置转发
            }
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            if (config.method != 'get'){
                if (config.data) {
                    config.data.env = store.state.global.environmentData.env;
                } else {
                    config.data = { env: store.state.global.environmentData.env};
                }
            }
            config.data = qs.stringify(config.data);
            return config;
        },
        err => {
            Promise.reject(err);
        }
    );
    service.interceptors.response.use(res => res_data(store, router, res), err => err_data(store, err));
    // 上传功能 请求返回
    axios.interceptors.response.use(res => res_data(store, router, res), err => err_data(store, err));
};

// 响应拦截器即异常处理
function res_data(store, router, res){
    if (!res.config.url.includes('/site/get-env')){
        _requestNum--;
        if (_requestNum <= 0){
            if (store.state.global.dataLoading){
                store.commit('SET_DATA_LOADING_STATUS', false);
            }
        }
    }
    store.commit('SET_DATE', new Date(res.headers.date));
    if (res.data.code == 404){
        router.replace({
            path: '/backend/error'
        });
    } else if (res.data.code == 400){
        Message.error(res.data.msg);
    } else if (res.data.code == 403){
        window.location.reload();
    }
    return res.data;
}

function err_data(store, err){
    if (err && err.response) {
        if (err.response.config != undefined && !err.response.config.url.includes('/site/get-env')){
            _requestNum--;
            if (_requestNum <= 0){
                if (store.state.global.dataLoading){
                    store.commit('SET_DATA_LOADING_STATUS', false);
                }
                if (store.state.global.pageLoading){
                    store.commit('SET_PAGE_LOADING_STATUS', false);
                }
            }
        }
        if (err && err.response) {
            const erroMes = {
                '400': '错误请求',
                '401': '未授权，请重新登录',
                '403': '拒绝访问',
                '404': '请求错误,未找到该资源',
                '405': '请求方法未允许',
                '408': '请求超时',
                '500': '服务器端出错',
                '501': '网络未实现',
                '502': '网络错误',
                '503': '服务不可用',
                '504': '网络超时',
                '505': 'http版本不支持该请求'
            };
            Message.error(erroMes[err.response.status] ? erroMes[err.response.status] : `连接错误${err.response.status}`);
        } else {
            Message.error('连接到服务器失败');
        }
        return Promise.reject(err.response);
    }
}
