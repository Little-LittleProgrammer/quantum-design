/* eslint-disable no-param-reassign */
import { get_storage, is_empty, each, variableType, extend2Lev, extend, get_current_source, get_current_path, get_current_title, encrypt_data, set_storage, querystring } from './utils';
import DataStore from './store';

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
        }
    }
    return fmt;
};

class sa {
    constructor() {
        this.para = {
            name: 'sensors',
            server_url: '',
            max_string_length: 500,
            show_log: !1
        };
        this.queue = [];
        this.getSystemInfoComplete = !1;
        this.is_first_launch = false;
        this.LIB_VERSION = '1.0.0';
        this.LIB_NAME = 'WxMiniApp';
        this.store = new DataStore();
        this.cacheNum = 10;
        this.send_interval_time = 3000;
        this.info = {
            environment: {
                appversion: '', // 应用版本号
                sdkversion: this.LIB_VERSION, // sdk版本号
                channel: '', // 应用渠道号
                devicemodel: '', // 设备机型，包括品牌和型号
                os: '', // 系统平台，如：Android、iOS
                pushtunnel: '',
                osversion: '', // 系统版本号
                resolution: '', // 手机分辨率
                projectname: '', // 应用名称，由统计后台生成，提供给app
                packagename: '', // 应用包名
                battery: '', // 当前手机电量
                access: '', // 网络状态
                brand: '', // 手机厂商
                sdkua: '', // user-agent用于三方媒体反作弊相关
                firstlaunch: '' // 首次使用sdk时间（卸载重装会更新）
            },
            identity: {
                oaid: '',
                imei: '',
                android_id: '',
                wmac: '',
                iccid: '',
                imsi: '',
                serial: '',
                uid: '',
                pushid: ''
            },
            ip:'',
            launchs: []
        };
        this.initialState = {
            queue: [],
            isComplete: false,
            systemIsComplete: false,
            storeIsComplete: false,
            channelComplete: false
        };
    }
    checkIsComplete() {
        if (this.initialState.systemIsComplete && this.initialState.storeIsComplete) {
            this.initialState.isComplete = true;
            if (this.initialState.queue.length > 0) {
                each(this.initialState.queue, (content) => {
                    this[content[0]].apply(this, Array.prototype.slice.call(content[1]));
                });
                this.initialState.queue = [];
            }
        }
    }
    set_para(t) {
        this.para = extend2Lev(this.para, t);
        if (t.cacheNum) {
            this.cacheNum = t.cacheNum;
        }
        if (t.send_interval_time) {
            this.send_interval_time = t.send_interval_time;
        }
        if (t.breadcrumb_max) {
            this.breadcrumb_max = t.breadcrumb_max;
        }
    }
    async init(params) {
        this.store.init(this);
        this.get_system(params);
        // 对所有提供的方法做代理暂存 为了解决获取distinct_id异步的问题
        each(['setProfile', 'pageShow', 'appHide', 'login', 'identify', 'appLaunch', 'setOnceProfile', 'track', 'clearAllRegister', 'quick', 'incrementProfile', 'appendProfile'], (method) => {
            const temp = this[method];
            if (this[method]) {
                this[method] = function () {
                    if (this.initialState.isComplete) {
                        temp.apply(this, arguments);
                    } else {
                        this.initialState.queue.push([method, arguments]);
                    }
                };
            }
        });
    }
    appLaunch(customProps) {
        if (!customProps || !variableType.isObject(customProps)) {
            customProps = {};
        }
        const prop = {};
        // 设置utm的信息
        extend(prop, customProps);
        extend(prop, get_current_source());
        // console.log('$AppStart', this.info);
        this.track('$AppStart', prop, true);
    }
    pageShow(customProps) {
        if (!customProps || !variableType.isObject(customProps)) {
            customProps = {};
        }
        const prop = {};
        prop.url_path = get_current_path();
        // console.log('sensor page', prop.$url_path);
        prop.$title = get_current_title();
        //  app_show_time = (new Date()).getTime();
        extend(prop, get_current_source());
        extend(prop, customProps);
        this.track('$AppViewScreen', prop, true);
    }
    appHide(customProps) {
        if (!customProps || !variableType.isObject(customProps)) {
            customProps = {};
        }
        const prop = {};
        prop.$url_path = get_current_path();
        prop.$title = get_current_title();
        extend(prop, customProps);
        this.track('$AppEnd', prop, true);
    }
    send(t) {
        let url = '';
        t.aggs.map((item) => {
            for (const key in item.params) {
                if (Object.hasOwnProperty.call(item.params, key)) {
                    item.params[key] = '' + item.params[key];
                }
            }
        });
        // console.info('[sensors]', this.para.project, JSON.stringify(t, null, 2));
        if (this.para.server_url.indexOf('?') !== -1) {
            url = `${this.para.server_url}&project=${this.para.project}&data=${encodeURIComponent(encrypt_data(t, this.para.qmkey))}`;
        } else {
            url = `${this.para.server_url}?project=${this.para.project}&data=${encodeURIComponent(encrypt_data(t, this.para.qmkey))}`;
        }
        this.send_request(url);
    }
    send_request(url) {
        uni.request({
            method: 'GET',
            data: 'String',
            url
        })
    }
    get_system(params) {
        const systemInfo = uni.getSystemInfoSync()
        const accountInfo = uni.getAccountInfoSync()
        let queryStr = ''
        try{
            queryStr = querystring(params.query)
        }catch(err){

        }
        this.info.identity.uid = params.unionid
        this.info.identity.openid = params.openid
        this.info.identity.unionid = params.unionid
        this.info.identity.mktparams = queryStr
        // get_current_source 来源没有
        // userId，androidId原值上报
        this.info.identity.android_id = '';
        this.info.identity.wmac = '';
        // 一系列的info赋值
        this.info.environment.appversion = accountInfo.miniProgram.version || systemInfo.appVersion;
        this.info.environment.is_small_project = 1;
        this.info.environment.devicemodel = systemInfo.model;
        this.info.environment.brand = systemInfo.brand;
        this.info.environment.channel = this.para.channel;
        this.info.environment.os = systemInfo.osName;
        this.info.environment.pushtunnel = '';
        this.info.environment.osversion = systemInfo.osVersion;
        this.info.environment.projectname = this.para.project;
        this.info.environment.packagename = systemInfo.appName;
        this.info.environment.access = '';
        this.info.environment.resolution = `${systemInfo.screenWidth}*${systemInfo.screenHeight + systemInfo.statusBarHeight}`;
        let _ua = systemInfo.platform === 'ios' ? systemInfo.osVersion.replace(/\./g,'_') : `${ systemInfo.platform.substring(0,1).toUpperCase() + systemInfo.platform.substring(1) } ${systemInfo.osVersion}-${systemInfo.model}`
        this.info.environment.sdkua = _ua
        this.info.ip = params.ip
        const _data = get_storage('firstlaunch');
        if (_data) {
            this.info.environment.firstlaunch = _data || '';
        }
        const _launchsData = get_storage('launchs') || {}
        this.info.launchs = _launchsData
        this.initialState.systemIsComplete = true;
        this.checkIsComplete();
    }
    identify(id, isSave) {
        if (typeof id === 'number') {
            id = String(id);
        } else if (typeof id !== 'string') {
            return false;
        }
        const firstId = this.store.getFirstId();
        if (isSave === true) {
            if (firstId) {
                this.store.set('first_id', id);
            } else {
                this.store.set('distinct_id', id);
            }
        } else if (firstId) {
            this.store.change('first_id', id);
        } else {
            this.store.change('distinct_id', id);
        }
    }
    async track(e, p, c) {
        // 方便测试
        // uni.showToast({
        //     title: JSON.stringify(e)+'---'+JSON.stringify(p),
        //     icon:'none',
        //     duration:10000
        // })
        // console.log('xxxx', router.getPages());
        if (is_empty(this.para.server_url)) {
            console.error('请设置日志上报地址');
            return;
        }
        if (is_empty(this.para.qmkey)) {
            console.error('请设置日志加密key');
            return;
        }
        if (is_empty(this.para.project)) {
            console.error('请设置日志所属项目');
            return;
        }
        if (c) {
            const sid = (+new Date()).toString();
            this.send({
                ...this.info,
                aggs: [{
                    sid,
                    count: '1',
                    eventid: e,
                    params: p || {},
                    trigger_ts: sid,
                    version: this.info.environment.appversion
                }]
            });
            return;
        }
        this.format_report_data(e, p);
        if (this.queue.length === 0) {
            return;
        }
        this.send_time();
    }
    send_time() {
        if (this.queue && this.queue.length >= this.cacheNum) {
            // 如果队列达到上报次数，直接上报
            this.send({
                ...this.info,
                aggs: this.queue
            });
            this.queue = [];
            clearTimeout(this.timer);
            return;
        }
        if (this.queue) {
            // 如果队列为空，就创建延迟，实现间隔上报
            this.timer = setTimeout(() => {
                if (this.queue.length > 0) {
                    // 修复 如果下载弹窗之类的触发onbforeunload事件 清空队列的bug
                    this.send({
                        ...this.info,
                        aggs: this.queue
                    });
                }
                clearTimeout(this.timer);
                this.queue = [];
            }, this.send_interval_time);
        }
    }
    format_report_data(e, p) {
        const sid = (+new Date()).toString();
        const _format = e + JSON.stringify(p || {}) + this.info.environment.appversion;
        const _find = this.find_repeat(_format, sid);
        if (!_find) {
            this.queue.push({
                sid: this.store.session_id,
                count: '1',
                eventid: e,
                params: p || {},
                trigger_ts: sid,
                version: this.info.environment.appversion
            });
        }
    }
    find_repeat(data, sid) { // 找到重复的日志 聚合
        let _find = false;
        this.queue.forEach((item) => {
            const _queueInfo = item.eventid + JSON.stringify(item.params) + item.version;
            if (data == _queueInfo) {
                _find = true;
                item.count++;
                item.count = item.count.toString();
                item.trigger_ts += `#${sid}`;
            }
        });
        return _find;
    }
    get_rdw() {
        let str = '';
        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let i = 0; i < 10; i++) {
            str += arr[Math.round(Math.random() * (arr.length - 1))];
        }
        let data = get_storage('qm_rid')
        if (data && data !== '') {
            return data
        }
        set_storage('qm_rid', `#${str}`)
        return `#${str}`
    }
    get_params(){
        return {...this.info.environment, ...this.info.identity}
    }
}


export default sa;
