import Vue from 'vue';
import {
    Form,
    FormItem,
    Radio, // 单选框
    Checkbox, // 多选框
    Select, // 选择器
    Option,
    Input, // 输入框
    Button, // 按钮
    Table, // 表格
    TableColumn,
    Message,
    Dialog,
    Menu,
    Submenu,
    MenuItem,
    Loading
} from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Radio); // 单选框
Vue.use(Checkbox); // 多选框
Vue.use(Select); // 选择器
Vue.use(Option);
Vue.use(Input); // 输入框
Vue.use(Button); // 按钮
Vue.use(Table); // 表格
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Loading);

// Vue.use(MessageBox); // 

Vue.prototype.$elMessage = Message; //  提示
