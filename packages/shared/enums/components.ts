interface IMatcher {
    pattern: RegExp
    styleDir: string
}

// 注意只维护带样式的
export const matchComponents: IMatcher[] = [
    // default
    {
        pattern: /^QLoading/,
        styleDir: 'q-loading'
    },
    {
        pattern: /^QTag/,
        styleDir: 'q-tag'
    },
    {
        pattern: /^QTreeTable/,
        styleDir: 'q-tree-table'
    },
    {
        pattern: /^QWatermark/,
        styleDir: 'q-watermark'
    },
    {
        pattern: /^QBreadcrumb/,
        styleDir: 'q-breadcrumb'
    },
    // antd
    {
        pattern: /^QAntdShrinkCard/,
        styleDir: 'q-card'
    },
    {
        pattern: /^QAntdDrawer/,
        styleDir: 'q-drawer'
    },
    {
        pattern: /^QAntdForm|^QAntdSelectAll/,
        styleDir: 'q-form'
    },
    {
        pattern: /^QAntdIconPicker/,
        styleDir: 'q-icon'
    },
    {
        pattern: /^QAntdKeepAliveTabs/,
        styleDir: 'q-keep-alive-tabs'
    },
    {
        pattern: /^QAntdSetting/,
        styleDir: 'q-setting'
    },
    {
        pattern: /^QAntdTable|^QAntdTableAction|^QAntdTablePagination|^QAntdTableImg/,
        styleDir: 'q-table'
    },
    {
        pattern: /^QAntdTransfer/,
        styleDir: 'q-transfer'
    },

    {
        pattern: /^QAntdUpload/,
        styleDir: 'q-upload'
    }
];
