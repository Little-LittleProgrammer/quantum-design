import { Button, ConfigProvider, Space, StyleProvider, Table, theme as antdTheme,Form, createCache, extractStyle, Pagination, Input } from 'ant-design-vue';
import fsExtra from 'fs-extra'
import { Fragment, createVNode } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { globalThemeConfig } from '../config/project-setting';

const blackList = ['AConfigProvider', 'AGrid', 'ATour', 'ASelectOptGroup', 'ASelectOption', 'AMentionsOption', 'ATreeNode', 'ATreeSelectNode', 'ALocaleProvider'];

const pickerMap: Record<string, any> = {
    AMonthPicker: 'month',
    AWeekPicker: 'week',
    AQuarterPicker: 'quarter'
};
const compChildNameMap: Record<string, any>  = {
    AMenuDivider: 'Menu',
    AMenuItem: 'Menu',
    AMenuItemGroup: 'Menu',
    ASubMenu: 'Menu',
    ATableColumn: 'Table',
    ATableColumnGroup: 'Table',
    ATableSummary: 'Table',
    ATableSummaryRow: 'Table',
    ATableSummaryCell: 'Table',
    ATabPane: 'Tabs',
    ATimelineItem: 'Timeline'
};

// 需要预加载样式的组件
const needComp = [Button, Table, Space, Pagination, Input, Form]

export const gen_antd_style = async () => {
    const _cache = createCache();
    const _childrenNode = createVNode(Fragment, null, [needComp.filter(comp => !blackList.includes(comp.name)).map(comp => {
        const _compName = comp.name
        if (_compName === 'Dropdown') {
            return createVNode(comp, {
              "key": _compName,
              "menu": {
                items: []
              }
            }, {
              default: () => [createVNode("div", null, null)]
            });
        }
        if (_compName === 'Anchor') {
            return createVNode(comp, {
              "key": _compName,
              "items": []
            }, null);
        }
        if (comp.name! in pickerMap) {
            const _comp = needComp.find(item => item.name === 'DatePicker')!;
            const _type = pickerMap[_compName];
            return createVNode(_comp, {
              "key": _compName,
              "picker": _type
            }, null);
        }
        if (_compName in compChildNameMap) {
            const _parentComp = needComp.find(item => item.name ===compChildNameMap[_compName])!;
            return createVNode(_parentComp, null, {
              default: () => [createVNode(comp, null, null)]
            });
        }
        if (_compName === 'QRCode' || _compName === 'Segmented') {
            return createVNode(comp, {
              "key": _compName,
              "value": ''
            }, {
              default: () => [createVNode("div", null, null)]
            });
        }
        return createVNode(comp, {
            "key": _compName
        }, null);
        })
    ])
    const _vnode1 = createVNode(ConfigProvider, { // 白天模式
        theme: {
            algorithm: globalThemeConfig.algorithm,
            token: globalThemeConfig.token
        }
    }, [[_childrenNode]])
    // const _vnode2 = createVNode(ConfigProvider, { // 暗黑模式
    //     theme: {
    //         algorithm: antdTheme.darkAlgorithm,
    //         token: globalThemeConfig.token
    //     }
    // }, [[_childrenNode]])
    await renderToString(createVNode(StyleProvider, {
        "cache": _cache
    }, {
        default: () => [_vnode1]
    }));
    const _styleText = extractStyle(_cache, true);
    await fsExtra.outputFile('public/css/antd.css', _styleText, 'utf8')
}

gen_antd_style()
