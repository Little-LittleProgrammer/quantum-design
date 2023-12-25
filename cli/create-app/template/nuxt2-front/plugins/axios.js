import qs from 'qs';
export default function ({ store, redirect, req, router, app: { $axios } }) {
    $axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';
    $axios.interceptors.request.use(
        (config) => {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            config.data = qs.stringify(config.data);
            return config;
        },
        (err) => {
            Promise.reject(err);
        }
    );
    //   $axios.interceptors.request.use()
    // response拦截器，数据返回后，可以先在这里进行一个简单的判断
    $axios.interceptors.response.use(
        (response) => {
            // return response
            if (response.data.code === 401) {
                redirect('/login');
            }
            //   } else if (response.data.code === 404) {
            //         // 重定向到404页面
            //     redirect('/')
            //   } else {
            //         // 请求接口数据正常，返回数据
            //     return response
            //   }
            //   if (response.data.code === 403 || response.data.code === 400) {
            //     Message.error(response.data.msg)
            //   }
            return response;
        },
        (error) => {
            // console.log(11111, error.response);
            // if (error.response.status === 500) {
            //       // http状态500，服务器内部错误，重定向到500页面
            //   redirect('/500.htm')
            // }
            // if (error.response.status === 404) {
            //       // http状态500，请求API找不到，重定向到404页面
            //   redirect('/404.html')
            // }
            return Promise.reject(error); // 返回接口返回的错误信息
        }
    );
}
