// 读取组件实例文件夹
const _req = require.context('~/docs/examples', true, /\.vue$/);
// 获取实例对应的元信息，获取所有导航数据
var _arr = _req.keys().map(_f => {
    const _name = _f.split('/').reverse()[0].replace(/.vue/g, '') || '暂无';
    return {
        label: _req(_f).default.cName || _req(_f).default.name || _name,
        value: _name,
        filePath: _f.replace(/.\//, '').split('/'),
        type: 'vue',
        level: 1,
        component: `md-${_name}`
    };
});
// 构建层级导航
let menuList = [];
const _menuObj = {}; // 存放文件夹对象，主要目的是利用js对象的引用特性
_arr.forEach(_m => {
    if (_m.filePath.length == 1) { // 不存在层级结构
        menuList.push(_m);
    } else { // 存在层级结构
        if (!_menuObj[_m.filePath[0]]) {
            _menuObj[_m.filePath[0]] = {
                label: _m.filePath[0],
                value: _m.filePath[0],
                type: 'folder',
                level: 1,
                unfold: true,
                children: []
            };
            menuList.push(_menuObj[_m.filePath[0]]);
        }
        set_children(_menuObj[_m.filePath[0]], _m.filePath.slice(1), _m);
    }
});
// 递归设置层级
function set_children (obj, filePath, menuItem){
    if (filePath[0].includes('.vue')) {
        menuItem.level = obj.level + 1;
        obj.children.push(menuItem);
    } else {
        if (!_menuObj[`${obj.value}${filePath[0]}`]) {
            _menuObj[`${obj.value}${filePath[0]}`] = {
                label: filePath[0],
                value: `${obj.value}${filePath[0]}`,
                type: 'folder',
                unfold: true,
                level: obj.level + 1,
                children: []
            };
            obj.children.push(_menuObj[`${obj.value}${filePath[0]}`]);
        }
        set_children(_menuObj[`${obj.value}${filePath[0]}`], filePath.slice(1), menuItem);
    }
}
// 排序
menuList = menuList.sort((_n, _p) => { return _n.label.localeCompare(_p.label); });

export default menuList;
