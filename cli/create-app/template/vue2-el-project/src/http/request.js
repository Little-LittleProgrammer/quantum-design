import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import router from '@/router';
import { Message } from 'element-ui';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 填写域名
    timeout: 5000
});

let _requestNum = 0; // 请求数量
let _requestPageUrl = ''; // 请求地址所在页面
let _pageLoadTime = ''; // 页面时间戳

// http request 拦截器
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
        if (process.env.NODE_ENV == 'development'){
            if (!(config.url.match(/^http/) != null || config.url.match(/^\/\//) != null)){
                config.url = '/api' + config.url; //  配置转发
            }
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
        // if (store.state.global.dataLoading){
        //     store.commit('SET_DATA_LOADING_STATUS', false);
        // }
        // if (store.state.global.pageLoading){
        //     store.commit('SET_PAGE_LOADING_STATUS', false);
        // }
        Promise.reject(err);
    }
);

// 响应拦截器即异常处理
function res_data(res){
    if (!res.config.url.includes('/site/get-env')){
        _requestNum--;
        if (_requestNum <= 0){
            if (store.state.global.dataLoading){
                store.commit('SET_DATA_LOADING_STATUS', false);
            }
            if (store.state.global.pageLoadingObj.visible){
                store.commit('SET_PAGE_LOADING_STATUS', false);
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

function err_data(err){
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
service.interceptors.response.use(res => res_data(res), err => err_data(err));

// 上传功能 请求返回
axios.interceptors.response.use(res => res_data(res), err => err_data(err));

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function get(url, params) {
    if (params) params.t = Date.now();
    else params = { t: Date.now() };
    return service.get(url, { params });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
    url += '?t=' + Date.now();
    return service.post(url, data);
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data) {
    return service.patch(url, data);
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data) {
    return service.put(url, data);
}

/**
 * @description 上传文件 单独封装解决文件上传 http头问题
 * @param {string} url 接口地址
 * @param {Object} data 发送数据
 * @returns {Promise}
 */
export function upload(url, data) {
    url = (process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASE_API + '/api' + url : url;
    return axios.post(url, data);
}
