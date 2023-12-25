/*
 * @Author: your name
 * @Date: 2020-08-11 09:14:35
 * @LastEditTime: 2020-09-17 17:22:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-project/cli3-antd-single-project/src/assets/js/tools.js
 */
export function deep_copy(obj) { //  深拷贝
    return JSON.parse(JSON.stringify(obj));
}

//  过滤空属性   data为数据     validationField需要过滤的字段 数组形式
export function filter_empty_params(data, validationField) {
    const _newParams = JSON.parse(JSON.stringify(data));
    for (const _param in data) {
        if (_newParams[_param] == undefined || _newParams[_param] == '' || _newParams[_param].length == 0 && (validationField == undefined || validationField.includes(_param))) {
            delete _newParams[_param];
        }
    }
    return _newParams;
}

export function get_uuid(len, radix) { //  指定长度和基数
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

// 设置表格竖项滚动条
export function get_table_scroll_y_height(obj, offset = 0) {
    // 152来源 导航高度48 + main容器上下间距32 + 表格header高度38 + 表格翻页32
    // 根据每个项目可自行设置
    return 'calc(100vh - ' + (obj.$el.offsetTop + 152 + offset) + 'px)';
}

// 数字格式化
export function format_number(strNum) {
    if (String(strNum).length <= 3) {
        return strNum;
    }
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
        return strNum;
    }
    var a = RegExp.$1;
    var b = RegExp.$2;
    var c = RegExp.$3;
    var re = new RegExp();
    re.compile('(\\d)(\\d{3})(,|$)');
    while (re.test(b)) {
        b = b.replace(re, '$1,$2$3');
    }
    return a + '' + b + '' + c;
}