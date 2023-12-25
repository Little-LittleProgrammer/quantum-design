/*
 * @Author: your name
 * @Date: 2020-08-05 11:09:04
 * @LastEditTime: 2020-08-20 13:19:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-project/cli3-antd-single-project/src/antd.js
 */
import Vue from 'vue';
import Moment from 'moment';
import {
    ConfigProvider, // 全局化配置
    Icon, // 图标
    Layout, // 布局
    Row, // 布局
    Col, // 布局
    Menu, // 导航菜单
    DatePicker, // 日期选择框
    FormModel, // 表单
    Radio, // 单选框
    Checkbox, // 多选框
    Select, // 选择器
    Input, // 输入框
    Button, // 按钮
    Table, // 表格
    Tabs, // 标签页
    Tag, // 标签
    Tree, //树
    Spin, // 加载中
    Modal, // 对话框
    Message, // 全局提示
    Upload, // 上传
    Tooltip, // 文字提示气泡框
    Popconfirm, // 气泡确认框
    Popover, // 气泡卡片
    // Breadcrumb, // 面包屑
    // Switch, // 开关
    // AutoComplete, // 自动完成
    // Descriptions, // 描述列表
    // PageHeader, // 页头
    // Divider, // 分割线
    // Badge, // 徽标数
    // Cascader, // 级联选择
    // Result, // 结果
} from 'ant-design-vue';

Vue.use(ConfigProvider); // 全局化配置
Vue.use(Icon); // 图标
Vue.use(Layout); // 布局
Vue.use(Row); // 布局
Vue.use(Col); // 布局
Vue.use(Menu); // 导航菜单
Vue.use(DatePicker); // 日期选择框
Vue.use(FormModel); // 表单
Vue.use(Radio); // 单选框
Vue.use(Checkbox); // 多选框
Vue.use(Select); // 选择器
Vue.use(Input); // 输入框
Vue.use(Button); // 按钮
Vue.use(Table); // 表格
Vue.use(Tabs); // 标签页
Vue.use(Tag); // 标签
Vue.use(Tree); // 树
Vue.use(Spin); // 加载中
Vue.use(Modal); // 对话框
Vue.use(Upload); // 上传
Vue.use(Tooltip); // 文字提示气泡框
Vue.use(Popconfirm); // 气泡确认框
Vue.use(Popover); // 气泡卡片

// Vue.use(Breadcrumb); // 面包屑
// Vue.use(Switch); // 开关
// Vue.use(AutoComplete); // 自动完成
// Vue.use(Descriptions); // 描述列表
// Vue.use(PageHeader); // 页头
// Vue.use(Divider); // 分割线
// Vue.use(Badge); // 徽标数
// Vue.use(Cascader); // 级联选择
// Vue.use(Popover); // 气泡卡片
// Vue.use(Result); // 结果

Vue.prototype.$antdModal = Modal; //  对话框
Vue.prototype.$antdMessage = Message; //  提示
Vue.prototype.$antdMoment = Moment; //  时间格式化
// ant Design 国际化配置
Vue.use(ConfigProvider);
