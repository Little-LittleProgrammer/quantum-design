export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;
export function check_status(status:string, msg: string, errorMessageMode: ErrorMessageMode = 'message') {
    let errMessage = '';
    switch (status) {
        case '400':
            errMessage = msg;
            break;
        case '401':
            errMessage = '未授权, 请重新登陆';
            break;
        case '403':
            errMessage = '拒绝访问';
            break;
        case '404':
            errMessage = '请求错误,未找到该资源';
            break;
        case '405':
            errMessage = '请求方法未允许';
            break;
        case '408':
            errMessage = '请求超时';
            break;
        case '413':
            errMessage = '数据过大';
            break;
        case '500':
            errMessage = '服务器端出错';
            break;
        case '501':
            errMessage = '网络未实现';
            break;
        case '502':
            errMessage = '网络错误';
            break;
        case '503':
            errMessage = '服务不可用';
            break;
        case '504':
            errMessage = '网络超时';
            break;
        case '505':
            errMessage = 'http版本不支持该请求';
            break;
        default:
            errMessage = '连接错误';
    }
    if (errMessage) {
        if (errorMessageMode === 'modal' ) {
            Modal.error({ title: '错误提示', content: errMessage });
        } else if (errorMessageMode === 'message') {
            message.error({ content: errMessage, key: `global_error_message_status_${status}` });
        }
    }
}
