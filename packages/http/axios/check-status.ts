import { isFunction } from "@quantum-design/utils";
import { gResultEnum } from '@quantum-design/shared/enums';

export async function check_status(status:string, msg: string, cb?: Fn) {
    let errMessage = '';
    switch (status) {
        case gResultEnum.ERROR:
            errMessage = msg;
            break;
        case gResultEnum.LOGIN:
            errMessage = '登录认证过期，请重新登录后继续。';
            break;
        case gResultEnum.PROMISE:
            errMessage = '禁止访问, 您没有权限访问此资源。';
            break;
        case gResultEnum.NOTFOUND:
            errMessage = '未找到, 请求的资源不存在。';
            break;
        case gResultEnum.NOALLOW:
            errMessage = '请求方法未允许';
            break;
        case gResultEnum.TIMEOUT:
            errMessage = '请求超时，请稍后再试。';
            break;
        case '413':
            errMessage = '数据过大';
            break;
        case gResultEnum.SERVERERROR:
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
        if (cb && isFunction(cb)) {
            cb(status, errMessage);
        }
    }
}
