import { service } from '@/plugins/axios';

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
    return service.post(url, data);
}
