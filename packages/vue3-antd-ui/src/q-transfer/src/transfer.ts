export interface ICity {
    title: string,
    key: string,
    children?: ICity[],
    disabled?: boolean
}

export interface IFieldNames {
    title: string,
    key: string,
    children: string,
}

// 检查 选择框是选择还是未选择
export function handle_tree_data(list: ICity[], targetKeys:string[] = []):ICity[] {
    list.forEach(item => {
        item['disabled'] = targetKeys.includes(item.key);
        if (item.children) {
            handle_tree_data(item.children, targetKeys);
        }
    });
    return list;
}

// 检查 选择框是选择还是未选择
export function is_checked(selectedKeys: string[], eventKey: string | number) {
    return selectedKeys.indexOf(eventKey as string) !== -1;
}

export function render_title(record: ICity) {
    return record.title;
}

// 过滤左右侧数据
/* eslint-disable*/
export function filter_tree_data(treeData: ICity[], selectedkeys: string[], direction: 'left' | 'right') {
    const _flag = direction === 'right' ? '' : '!'
    let _result:ICity[] = []
    treeData.forEach((item) => {
        if (!item.children) {
            // right，向右移，已选中的包含treeData遍历的key（将选中的赋值到右边）；；；left向左移， 已选中的不包含treeData遍历的key（将选中的从右边移出）
            if (
                eval(_flag + '(selectedkeys.indexOf(item.key) !== -1)')
            ) {
                const _data = {
                    key: item.key,
                    title: item.title
                }
                _result = [..._result, _data]
            }
        } else {
            let _resultChild:ICity[] = []
            // 筛选第二层菜单，不用filter是因为，filter的数据会带上disabled
            item.children.forEach((e) => {
                if (
                    eval(_flag + '(selectedkeys.indexOf(e.key) !== -1)')
                ) {
                    _resultChild = [
                        ..._resultChild,
                        {
                            key: e.key,
                            title: e.title
                        }
                    ]
                }
            })
            const _child = {
                key: item.key,
                title: item.title,
                children: _resultChild
            }
            if (
                item.children.filter((e) =>
                    eval(_flag + '(selectedkeys.indexOf(e.key) !== -1)')
                ).length !== 0
            ) {
                _result = [..._result, _child]
            }
        }
    })
    return _result
}

export function dfs(list: any[], fieldNames: IFieldNames) {
    const _key = fieldNames.key || 'key';
    const _children = fieldNames.children || 'children';
    const _title = fieldNames.title || 'title';
    if (list.length === 0) {
        return [];
    }
    const _res:ICity[] = [];
    for (const ele of list) {
        const _obj:ICity = {
            key: ele[_key],
            title: ele[_title]
        };
        if (ele.disabled) {
            _obj.disabled = ele.disabled;
        }
        if (ele[_children]) {
            _obj.children = dfs(ele[_children], fieldNames);
        }
        _res.push(_obj);
    }
    return _res;
}

export function get_parent_keys(targetKeys: string[], list: ICity[]) {
    if (targetKeys.length === 0) {
        return []
    }
    let parentKeys:string[]= []
    for (let item of list) {
        if (item.children) {
            for (let child of item.children) {
                if (targetKeys.includes(child.key) && !parentKeys.includes(item.key)) {
                    parentKeys.push(item.key);
                    break;
                }
            }
        }
    }
    return parentKeys
}