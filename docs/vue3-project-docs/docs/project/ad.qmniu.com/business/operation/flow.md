# 流量配置

## 定义
1. 对不同合作模式下的不同的联盟方定义请求顺序和出价
2. 合作模式: PDB(保价保量)、PD(保价单阶, 保价多阶)、RTB(实时竞价)、联盟ADN
3. PD和ADN走轮训逻辑, 判断价格由客服端进行比价
4. RTB由服务端进行比价
5. PDB为权限最高的广告, 一旦有pdb的广告,直接展示
6. 全部请求完都请求不到广告, 则走兜底广告


## 前端实现

### 复杂功能

**流量下发组**

1. 要根据`广告类型(cooperation_mode_arr)`和`请求顺序(request_order)` 将编辑的单条分配到具体的分组中
具体代码
```js
    const _id1 = get_uuid(5);
    const _id2 = get_uuid(5);
    const _values = getFieldsValue();
    if (record.id) { // 编辑时的删除
        del_row(record, _values, 'adv_list');
    }
    if (record.key) { // 新增时的删除
        del_row(record, _values, 'adv_list', 'key');
    }
    //      新增
    let _resNum = 0;
    console.log('values', _values);
    if (_values.adv_list && _values.adv_list.length > 0) {
        // 已有新增, 只需找正确位置
        const _allCoop = _values.adv_list.map((item:IFlowAdvList, index:number) => {
            return {
                cooperation_mode: item.cooperation_mode_arr || [],
                request_order: item.request_order,
                index
            };
        });
        const _index = _allCoop.filter((key: any) => key.cooperation_mode.includes(record.cooperation_mode));
        console.log(_allCoop, _index);
        if (_index && _index.length > 0) {
            // 如果 cooperation_mode 存在且为特殊关系, 则继续判断请求排序
            if ([2, 3, 4].includes(record.cooperation_mode || 0)) {
                let _addIndex = -1;
                _allCoop.forEach((item:any, i:number) => {
                    if (item.cooperation_mode.includes(record.cooperation_mode) && item.request_order === record.request_order) {
                        _addIndex = i;
                    }
                });
                if (_addIndex !== -1) {
                    _values.adv_list[_addIndex].children?.push({...record, key: _id2});
                } else {
                    _resNum = 1;
                }
            } else { // cooperation_mode为普通字段, 直接推送;
                _values.adv_list[_index[0].index].children?.push({ ...record, key: _id2});
            }
        } else {
            _resNum = 1;
        }
    }
    if (_resNum === 1) {
        const _length = _values.adv_list.length;
        _values.adv_list.splice(_length - 1, 0, {
            key: _id1,
            request_order: record.request_order,
            name: cooperationEnums[record.cooperation_mode || 1],
            cooperation_mode: record.cooperation_mode,
            cooperation_mode_arr: [2, 3, 4].includes(record.cooperation_mode!) ? [2, 3, 4] : [record.cooperation_mode],
            children: [{...record, key: _id2}],
            floor_price: record.floor_price,
            reserve_price: 0
        });
    }
    await resetFields();
    await setFieldsValue({
        adv_list: _values.adv_list
    });
```