/**
 * 节流函数
 * @param {*} callback  回调
 * @param {*} delay     延迟
 * @param {*} immediate 是否立即执行
 * @returns
 */
export function js_tools_throttle (callback, delay, immediate = true) {
    var timer;
    var context;
    var iNow;
    var firstTime = +new Date();
    var args = [];
    return function () {
        clearTimeout(timer);
        context = this;
        iNow = +new Date();
        args = Array.prototype.slice.call(arguments);
        if (immediate) {
            immediate = false;
            callback.apply(context, args);
        } else {
            if (iNow - firstTime > delay) {
                firstTime = iNow;
                callback.apply(context, args);
            } else {
                timer = setTimeout(function () {
                    callback.apply(context, args);
                }, delay);
            }
        }
    };
}

/**
 * 新窗口打开
 * @param {*} url       链接地址
 * @param {*} isBlank   是否新窗口打开 默认true
 * @returns
 */
export function js_tools_open_win (url, isBlank = true) {
    const _aLink = document.createElement('a');
    _aLink.setAttribute('href', url);
    _aLink.setAttribute('target', isBlank ? '_blank' : '');
    _aLink.setAttribute('id', 'camnpr');
    document.body.appendChild(_aLink);
    _aLink.click();
    _aLink.parentNode.removeChild(_aLink);
}

// 获取免费小说app系统版本号
export function js_tools_get_app_version (ua) {
    if (ua.toLowerCase().match(/webviewversion\/(\S*)/)) {
        return parseInt(ua.toLowerCase().match(/webviewversion\/(\S*)/)[1]);
    }
    return '';
}

// 获取系统类型
export function js_tools_get_system (ua) {
    if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
        return 'android';
    } else if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return 'ios';
    } else {
        return '';
    }
}

// 获取uuid
export function js_tools_get_uuid (len, radix) { //  指定长度和基数
    const _chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const _uuid = [];
    let i;
    radix = radix || _chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) _uuid[i] = _chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        _uuid[8] = _uuid[13] = _uuid[18] = _uuid[23] = '-';
        _uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!_uuid[i]) {
                r = 0 | Math.random() * 16;
                _uuid[i] = _chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return _uuid.join('');
}

// 数组数据随机排列
export function js_tools_array_shuffle (arr) {
    let _i = arr.length;
    while (_i) {
        const _j = Math.floor(Math.random() * _i--);
        [arr[_j], arr[_i]] = [arr[_i], arr[_j]];
    }
    return arr;
}

// 移除class类名
export function js_tools_remove_class (obj, classname){
    obj.className = obj.className.replace(classname, '');
}

// 是否有class类名
export function js_tools_has_class (obj, classname){
    return obj.className.split(' ').includes(classname);
}

// 添加class类名
export function js_tools_add_class (obj, classname){
    if (obj.className){
        obj.className = obj.className + ' ' + classname;
    } else {
        obj.className = classname;
    }
}
