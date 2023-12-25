
const baseUrl = import.meta.env.VITE_BASE_URL;
const HTTP_STATUS = {
    SUCCESS: 200,
    NOTFOUND: 404,
    ERROR: 400,
    RELOAD: 307,
    LOGIN: 401,
    TIMEOUT: 408
};

const base_options = (params, method) => {
    return new Promise((resolve, reject) => {
        let { url, data, header } = params;
        const contentType = params.contentType || 'application/json';
        if (!/^https/.test(url)) {
            url = baseUrl + url;
        }
        const option = {
            url,
            data,
            method: method || 'POST',
            header: {
                'content-type': contentType,
                ...header
            },
            timeout: 10000,
            success: (response) => {
                const { code, msg, data } = response.data;
                if (code === HTTP_STATUS.SUCCESS) {
                    resolve(data);
                    return;
                }
                if (code === HTTP_STATUS.LOGIN) {
                    // uni.navigateTo({
                    //     url: '/pages/login/index'
                    // })
                    return;
                }
                if (code === HTTP_STATUS.TIMEOUT) {
                    uni.showToast({
                        title: '请求超时',
                        icon: 'none',
                        duration: 3000
                    });
                }
                if (code === HTTP_STATUS.ERROR) {
                    uni.showToast({
                        title: msg || '网络错误',
                        icon: 'none',
                        duration: 3000
                    });
                }
                reject(response.data);
            },
            fail: (err) => {
                uni.showToast({
                    title: err.errMsg || '网络错误',
                    icon: 'none',
                    duration: 3000
                });
                reject(err);
            }
        };
        uni.request(option);
    });
};

export function get(url, params = {}, header = {}) {
    const option = { url, data: params, header };
    return base_options(option, 'GET');
}

export function post(url, params = {}, header = {}) {
    const option = { url, data: params, header };
    return base_options(option, 'POST');
}
