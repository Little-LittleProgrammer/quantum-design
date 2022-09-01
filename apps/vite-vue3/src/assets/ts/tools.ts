import { Recordable } from '@qmfront/shared/types/global';
import { offset } from '@qmfront/shared/utils';
import { ColumnsType } from 'ant-design-vue/lib/table';
import { nextTick } from 'vue';

/**
 * 设置表格头
 * @param headerObj 服务端返回的表格头
 * @param options 配置项, 详细参考 antd-table
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
 type IOptionsTable = {
    alignData?: Record<string, 'left' | 'right' | 'center'>,
    widthData?: Record<string, string | number>,
    fixedData?: Record<string, 'left' | 'right'>,
    sortData?: string[],
    customTitle?: string[],
}
export function get_table_header_columns<T extends Recordable<string>>(headerObj: T, options: IOptionsTable = {}) {
    const { alignData = {}, widthData = {}, fixedData = {}, sortData = [], customTitle = []} = options;
    const _resObj:ColumnsType = [];
    for (const _key in headerObj) {
        const _temObj = {
            title: customTitle.indexOf(_key) > 1 ? undefined : headerObj[_key],
            key: _key,
            dataIndex: _key,
            width: widthData[_key] ?? (widthData.all ?? ''),
            align: alignData[_key] ?? (alignData.all ?? 'center'),
            fixed: fixedData[_key] ?? '',
            sorter: sortData.indexOf(_key) > -1
        };
        _resObj.push(_temObj);
    }
    return _resObj;
}

/**
 * @description 不同页面。计算表格的高度
 * @param {string} tableClass 表格的类名，用来取表格上部高度来计算表格的整体高度
 * @param {number} subHeight 需要减去的高度
 */
export function set_table_height(tableClass: string, subHeight = 0) {
    return new Promise((resolve) => {
        nextTick(() => {
            const $dom = document.querySelector(`.${tableClass} .ant-table-tbody`);
            const offsetHeight = offset($dom as unknown as Element & HTMLElement).top;
            console.log('offsetHeight', offsetHeight, 'document.body.offsetHeight', document.body.offsetHeight);
            // 28是 表格卡片化时留下的padding
            resolve(document.body.offsetHeight - offsetHeight - subHeight - 28 + 'px');
        });
    });
}
