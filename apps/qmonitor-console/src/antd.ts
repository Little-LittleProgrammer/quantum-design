import type { App } from 'vue';
// import { Icon } from './Icon';
import {
    ConfigProvider, // 全局化配置
    Layout, // 布局
    Row, // 布局
    Col, // 布局
    DatePicker, // 日期选择框
    Form, // 表单
    Radio, // 单选框
    Checkbox, // 多选框
    Cascader, // 联机选择器
    Select, // 选择器
    Switch, // 开关
    Input, // 输入框
    Button, // 按钮
    Table, // 表格
    Tabs, // 标签页
    Tag, // 标签
    Tree, // 树
    Modal, // 对话框
    Upload, // 上传
    Tooltip, // 文字提示气泡框
    Popconfirm, // 气泡确认框
    Popover, // 气泡卡片
    InputNumber, // 数字输入框
    Steps, // 步骤
    Statistic, // 数据展示
    Transfer, // 穿梭框
    Card, // 卡片模块,
    Pagination, // 分页
    Empty, // 空状态
    BackTop,
    Menu,
    TreeSelect,
    TimePicker,
    // AutoComplete, // 自动完成
    // Descriptions, // 描述列表
    // PageHeader, // 页头
    // Divider, // 分割线
    // Badge, // 徽标数
    // Cascader, // 级联选择
    Result // 结果
} from 'ant-design-vue';

export function register_glob_comp(app: App) {
    app.use(Input).use(Button).use(Layout).use(ConfigProvider).use(Row)
        .use(Col).use(Menu).use(DatePicker).use(Form).use(Radio).use(Checkbox)
        .use(Select).use(Switch).use(Table).use(Tag).use(Tabs).use(Tree).use(Modal)
        .use(Upload).use(Tooltip).use(Popconfirm).use(Popover).use(InputNumber).use(Steps)
        .use(Statistic).use(Transfer).use(Card).use(Result).use(Pagination).use(Empty).use(BackTop).use(Cascader).use(TreeSelect).use(TimePicker);
}

