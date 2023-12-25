import axios from 'axios'
import qs from 'qs'
import store from '../store'
import router from '../router'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
let axiosInstance = axios.create()


axiosInstance.interceptors.request.use(config => {
    /* 拦截请求，可以设置请求头信息，添加统一toast提示loading等 */
    // if (process.env.NODE_ENV === 'development') {
    //     /* 开发模式自动为接口添加api字段，/config/index.js中的proxyTable可自动匹配，如果后端接口有api字段则可以取消判断。 */
    //     config.url = '/api' + config.url
    // }

    if (config.method === 'post' || config.method === 'put') {
        config.data = qs.stringify(config.data)
    }
    return config
})

axiosInstance.interceptors.response.use(res => {

    store.commit('SET_LOADING_END');
    // if(res.data.code == 404){
    //     router.replace({
    //         path: '/app-h5/freebook/error'
    //     })
    // }
            
    return res.data;

}, err => {
    let code = err.response.status
    if (code === 404) {
        return Promise.reject('接口未找到')
    } else if (code === 500) {
        return Promise.reject('服务器错误')
    } else if (code === 301 || code === 302) {
        return Promise.reject('页面跳转')
    }
})

export default {
    get(url, params) {
        return axiosInstance.get(url, {params})
    },
    post(url, params) {
        return axiosInstance.post(url, params)
    },
    put(url, params) {
        return axiosInstance.put(url, params)
    },
    delete(url, params) {
        return axiosInstance.delete(url, {params})
    }
}
