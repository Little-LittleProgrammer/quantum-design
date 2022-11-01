import { isArray, isNull, isObject, offset } from '@qmfront/utils';
import { ColumnsType } from 'ant-design-vue/lib/table';
import { GetComponentProps } from 'ant-design-vue/lib/vc-table/interface';
import { nextTick } from 'vue';

type IOptionsTable = {
    alignData?: Record<string, 'left' | 'right' | 'center'>,
    widthData?: Record<string, string | number>,
    fixedData?: Record<string, 'left' | 'right'>,
    sortData?: string[] | Record<string, Fn>,
    customTitle?: string[],
    customCell?: Record<string, GetComponentProps<any>>
}
/**
 * 设置表格头
 * @param headerObj 服务端返回的表格头
 * @param options 配置项, 详细参考 antd-table
 * @param list 如传入会, 自动根据list计算 合并行, 不会计算合并列
 * @returns 返回适用于antd的表格头
 *
 * ```js
 * const _options = {
 *      alignData: {
 *          'ad_id': 'left',
 *          'ad_title'
 *      },
 *      widthData: {
 *          all: '120'
 *      },
 *      sortData: ['ad_id']
 * }
 * ```
 */
export function get_table_header_columns<T extends Record<string, any>>(headerObj: T, options: IOptionsTable = {}, list?: any) {
    const { alignData = {}, widthData = {}, sortData = [], customTitle = [], customCell = {}} = options;
    const fixedData:Record<string, 'left' | 'right'> = {
        action: 'right',
        ...options.fixedData
    };
    function dfs<T extends Record<string, any>>(headerObj: T): ColumnsType {
        const _resObj:ColumnsType = [];
        let _rowSpan:any = {};
        if (isArray(list)) {
            _rowSpan = get_custom_cell(headerObj, list);
        }
        for (const _key in headerObj) {
            let _temObj = {};
            if (headerObj[_key].children) {
                _temObj = {
                    title: customTitle.indexOf(_key) > 1 ? undefined : headerObj[_key].title,
                    children: dfs(headerObj[_key].children)
                };
            } else {
                _temObj = {
                    ..._temObj,
                    title: customTitle.indexOf(_key) > 1 ? undefined : headerObj[_key],
                    key: _key,
                    dataIndex: _key,
                    width: widthData[_key] ?? (widthData.all ?? ''),
                    align: alignData[_key] ?? (alignData.all ?? 'center'),
                    fixed: fixedData[_key] ?? '',
                    sorter: isObject(sortData) ? (sortData as Record<string, Fn>)[_key] : (sortData as string[]).indexOf(_key) > -1,
                    customCell: customCell[_key]
                        ? customCell[_key]
                        : Object.keys(_rowSpan).length > 0
                            ? (_: any, index: number) => ({
                                rowSpan: !isNull(_rowSpan) ? _rowSpan[_key][index as number] : 1
                            })
                            : null
                };
            }
            _resObj.push(_temObj);
        }
        return _resObj;
    }
    return dfs(headerObj);
}

/**
 *  合并单元格, 将相同的元素合并至一行
 * @param list 服务端返回的list
 * @returns  Record<keyof T, number[]>
 */
export function get_custom_cell<T extends Record<string, any>>(headerObj:T, list: Partial<T>[]): Record<keyof T, number[]> | null {
    type Ikey = keyof T
    const _n = list.length;
    if (_n === 0) return null;
    const _keyObj: Record<Ikey, any> = {} as any;
    const _resObj: Record<Ikey, number[]> = {} as Record<Ikey, number[]>;
    // 初始化 colspan
    for (const key of Object.keys(headerObj)) {
        _resObj[key as Ikey] = new Array(_n).fill(1);
    }
    for (const key of Object.keys(headerObj)) {
        _keyObj[key as Ikey] = list[0][key];
    }
    let _res = 1;
    let _start = 0;
    for (const key of Object.keys(headerObj)) {
        for (let i = 1; i < _n; i++) {
            // 对比是否相等
            if (_keyObj[key as Ikey] === list[i][key]) {
                _res++;
            }
            // 如果不相等, 将 start赋值为 res
            if ((_keyObj[key as Ikey] !== list[i][key])) {
                _resObj[key as Ikey][_start] = _res;
                for (let j = _start + 1; j < i; j++) {
                    _resObj[key as Ikey][j] = 0;
                }
                _res = 1;
                _start = i;
            } else if (i === _n - 1) {
                // 处理特殊情况, 最后一项
                _resObj[key as Ikey][_start] = _res;
                for (let j = _start + 1; j <= i; j++) {
                    _resObj[key as Ikey][j] = 0;
                }
                _res = 1;
                _start = i;
            }
            _keyObj[key as Ikey] = list[i][key];
        }
        _start = 0;
    }

    return _resObj;
}

/**
 * @description 不同页面。计算表格的高度
 * @param {string} tableClass 表格的类名，用来取表格上部高度来计算表格的整体高度
 * @param {number} subHeight 需要减去的高度
 */
export function set_table_height(tableClass: string, subHeight: number = 0) {
    return new Promise<string>((resolve) => {
        nextTick(() => {
            const $dom = document.querySelector(`.${tableClass} .ant-table-tbody`);
            const offsetHeight = offset($dom as unknown as Element & HTMLElement).top;
            console.log('offsetHeight', offsetHeight, 'document.body.offsetHeight', document.body.offsetHeight);
            // 28是 表格卡片化时留下的padding
            resolve(document.body.offsetHeight - offsetHeight - subHeight - 28 + 'px');
        });
    });
}
