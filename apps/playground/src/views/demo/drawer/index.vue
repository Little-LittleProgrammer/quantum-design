<template>
    <div class="drawer-demo">
        <a-card title="基础用法" class="g-mt">
            <div class="demo-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="openBasicDrawer">打开基础抽屉</a-button>
                        <a-button @click="openLeftDrawer">左侧抽屉</a-button>
                        <a-button @click="openTopDrawer">顶部抽屉</a-button>
                        <a-button @click="openBottomDrawer">底部抽屉</a-button>
                    </a-space>
                </div>
                <p>基本的抽屉组件，支持不同的弹出位置。</p>
            </div>
        </a-card>

        <a-card title="尺寸配置" class="g-mt">
            <div class="demo-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="openSmallDrawer">小尺寸 (400px)</a-button>
                        <a-button @click="openMediumDrawer">中等尺寸 (600px)</a-button>
                        <a-button @click="openLargeDrawer">大尺寸 (800px)</a-button>
                        <a-button @click="openFullDrawer">全屏抽屉</a-button>
                    </a-space>
                </div>
                <p>支持自定义抽屉的宽度和高度。</p>
            </div>
        </a-card>

        <a-card title="功能配置" class="g-mt">
            <div class="demo-section">
                <div style="margin-bottom: 16px">
                    <a-space wrap>
                        <a-button type="primary" @click="openDrawerWithLoading">加载状态抽屉</a-button>
                        <a-button @click="openDrawerNoFooter">无底部按钮</a-button>
                        <a-button @click="openDrawerCustomFooter">自定义底部</a-button>
                        <a-button @click="openDrawerNoMaskClose">禁用遮罩关闭</a-button>
                    </a-space>
                </div>
                <p>支持各种功能配置，如加载状态、底部按钮、遮罩关闭等。</p>
            </div>
        </a-card>

        <a-card title="详情模式" class="g-mt">
            <div class="demo-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="openDetailDrawer">详情抽屉</a-button>
                        <a-button @click="openDetailWithBackDrawer">带返回按钮的详情</a-button>
                    </a-space>
                </div>
                <p>详情模式适用于展示详细信息，通常占满整个容器。</p>
            </div>
        </a-card>

        <a-card title="表单编辑抽屉" class="g-mt">
            <div class="demo-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="openFormDrawer">新增用户</a-button>
                        <a-button @click="openEditFormDrawer">编辑用户</a-button>
                    </a-space>
                </div>
                <p>结合表单使用，常用于新增和编辑操作。</p>
            </div>
        </a-card>

        <a-card title="内容丰富的抽屉" class="g-mt">
            <div class="demo-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="openRichContentDrawer">丰富内容抽屉</a-button>
                        <a-button @click="openTableDrawer">表格抽屉</a-button>
                        <a-button @click="openStepsDrawer">步骤抽屉</a-button>
                    </a-space>
                </div>
                <p>展示复杂内容，如表格、步骤条、图表等。</p>
            </div>
        </a-card>

        <!-- 基础抽屉 -->
        <q-antd-drawer @register="registerBasic" title="基础抽屉" width="500">
            <div class="drawer-content">
                <h3>基础抽屉内容</h3>
                <p>这是一个基础的抽屉组件示例。</p>
                <a-divider />
                <p>抽屉组件是一个从屏幕边缘滑出的浮层面板，常用于：</p>
                <ul>
                    <li>快速查看详细信息</li>
                    <li>表单填写和编辑</li>
                    <li>辅助功能面板</li>
                    <li>多级信息展示</li>
                </ul>
            </div>
        </q-antd-drawer>

        <!-- 位置抽屉 -->
        <q-antd-drawer @register="registerLeft" title="左侧抽屉" placement="left" width="400">
            <div class="drawer-content">
                <a-result status="info" title="左侧抽屉" sub-title="从左侧滑出的抽屉" />
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerTop" title="顶部抽屉" placement="top" height="300">
            <div class="drawer-content">
                <a-result status="info" title="顶部抽屉" sub-title="从顶部滑出的抽屉" />
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerBottom" title="底部抽屉" placement="bottom" height="300">
            <div class="drawer-content">
                <a-result status="info" title="底部抽屉" sub-title="从底部滑出的抽屉" />
            </div>
        </q-antd-drawer>

        <!-- 尺寸抽屉 -->
        <q-antd-drawer @register="registerSmall" title="小尺寸抽屉" width="400">
            <div class="drawer-content">
                <h3>小尺寸抽屉 (400px)</h3>
                <p>适合简单的信息展示和操作。</p>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerMedium" title="中等尺寸抽屉" width="600">
            <div class="drawer-content">
                <h3>中等尺寸抽屉 (600px)</h3>
                <p>适合表单编辑和中等复杂度的内容。</p>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerLarge" title="大尺寸抽屉" width="800">
            <div class="drawer-content">
                <h3>大尺寸抽屉 (800px)</h3>
                <p>适合复杂的表单和详细信息展示。</p>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerFull" title="全屏抽屉" width="100%">
            <div class="drawer-content">
                <h3>全屏抽屉</h3>
                <p>占据整个屏幕宽度，适合复杂的页面内容。</p>
            </div>
        </q-antd-drawer>

        <!-- 功能配置抽屉 -->
        <q-antd-drawer @register="registerLoading" title="加载状态抽屉" width="500" :confirmLoading="loadingState" @ok="handleLoadingOk">
            <div class="drawer-content">
                <h3>加载状态演示</h3>
                <p>点击确定按钮查看加载效果。</p>
                <a-alert message="提示" description="确定按钮会显示loading状态3秒钟" type="info" show-icon />
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerNoFooter" title="无底部按钮抽屉" width="500" :showFooter="false">
            <div class="drawer-content">
                <h3>无底部按钮</h3>
                <p>这个抽屉没有底部的确定和取消按钮。</p>
                <div style="margin-top: 20px">
                    <a-button type="primary" @click="closeNoFooterDrawer">关闭抽屉</a-button>
                </div>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerCustomFooter" title="自定义底部抽屉" width="500">
            <div class="drawer-content">
                <h3>自定义底部按钮</h3>
                <p>可以自定义底部按钮的文字、类型和行为。</p>
            </div>
            <template #insterFooter>
                <a-button type="dashed">自定义按钮1</a-button>
            </template>
            <template #centerFooter>
                <a-button type="primary" ghost>自定义按钮2</a-button>
            </template>
            <template #appendFooter>
                <a-button danger>自定义按钮3</a-button>
            </template>
        </q-antd-drawer>

        <q-antd-drawer @register="registerNoMaskClose" title="禁用遮罩关闭" width="500" :maskClosable="false">
            <div class="drawer-content">
                <h3>禁用遮罩关闭</h3>
                <p>点击遮罩层无法关闭此抽屉，只能通过按钮关闭。</p>
                <a-alert message="注意" description="点击抽屉外的遮罩区域无法关闭此抽屉" type="warning" show-icon />
            </div>
        </q-antd-drawer>

        <!-- 详情模式抽屉 -->
        <q-antd-drawer @register="registerDetail" title="用户详情" :isDetail="true" :showDetailBack="false">
            <div class="drawer-content">
                <a-descriptions title="用户信息" bordered :column="1">
                    <a-descriptions-item label="姓名">张三</a-descriptions-item>
                    <a-descriptions-item label="年龄">28</a-descriptions-item>
                    <a-descriptions-item label="邮箱">zhangsan@example.com</a-descriptions-item>
                    <a-descriptions-item label="电话">138****8888</a-descriptions-item>
                    <a-descriptions-item label="部门">技术部</a-descriptions-item>
                    <a-descriptions-item label="职位">前端工程师</a-descriptions-item>
                    <a-descriptions-item label="入职时间">2022-01-15</a-descriptions-item>
                    <a-descriptions-item label="工作地点">北京市海淀区</a-descriptions-item>
                </a-descriptions>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerDetailWithBack" title="用户详情" :isDetail="true" :showDetailBack="true" @close="handleDetailBack">
            <div class="drawer-content">
                <a-descriptions title="用户信息" bordered :column="1">
                    <a-descriptions-item label="姓名">李四</a-descriptions-item>
                    <a-descriptions-item label="年龄">32</a-descriptions-item>
                    <a-descriptions-item label="邮箱">lisi@example.com</a-descriptions-item>
                    <a-descriptions-item label="电话">139****9999</a-descriptions-item>
                    <a-descriptions-item label="部门">产品部</a-descriptions-item>
                    <a-descriptions-item label="职位">产品经理</a-descriptions-item>
                </a-descriptions>

                <a-divider />

                <h4>工作经历</h4>
                <a-timeline>
                    <a-timeline-item>2022-01 至 现在：产品经理</a-timeline-item>
                    <a-timeline-item>2020-06 至 2021-12：高级产品专员</a-timeline-item>
                    <a-timeline-item>2018-03 至 2020-05：产品专员</a-timeline-item>
                </a-timeline>
            </div>
        </q-antd-drawer>

        <!-- 表单抽屉 -->
        <q-antd-drawer @register="registerForm" title="新增用户" width="600" @ok="handleFormSubmit" :confirmLoading="formLoading">
            <div class="drawer-content">
                <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="姓名" name="name">
                                <a-input v-model:value="formData.name" placeholder="请输入姓名" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="年龄" name="age">
                                <a-input-number v-model:value="formData.age" placeholder="请输入年龄" style="width: 100%" :min="18" :max="65" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="邮箱" name="email">
                                <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="电话" name="phone">
                                <a-input v-model:value="formData.phone" placeholder="请输入电话" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-form-item label="部门" name="department">
                        <a-select v-model:value="formData.department" placeholder="请选择部门">
                            <a-select-option value="tech">技术部</a-select-option>
                            <a-select-option value="product">产品部</a-select-option>
                            <a-select-option value="design">设计部</a-select-option>
                            <a-select-option value="operation">运营部</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="职位" name="position">
                        <a-input v-model:value="formData.position" placeholder="请输入职位" />
                    </a-form-item>

                    <a-form-item label="入职日期" name="joinDate">
                        <a-date-picker v-model:value="formData.joinDate" placeholder="请选择入职日期" style="width: 100%" />
                    </a-form-item>

                    <a-form-item label="备注" name="remark">
                        <a-textarea v-model:value="formData.remark" placeholder="请输入备注信息" :rows="4" />
                    </a-form-item>
                </a-form>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerEditForm" title="编辑用户" width="600" @ok="handleFormSubmit">
            <div class="drawer-content">
                <a-form :model="editFormData" layout="vertical">
                    <a-form-item label="姓名">
                        <a-input v-model:value="editFormData.name" />
                    </a-form-item>
                    <a-form-item label="年龄">
                        <a-input-number v-model:value="editFormData.age" style="width: 100%" />
                    </a-form-item>
                    <a-form-item label="邮箱">
                        <a-input v-model:value="editFormData.email" />
                    </a-form-item>
                    <a-form-item label="状态">
                        <a-switch v-model:checked="editFormData.active" />
                        <span style="margin-left: 8px">
                            {{ editFormData.active ? '激活' : '停用' }}
                        </span>
                    </a-form-item>
                </a-form>
            </div>
        </q-antd-drawer>

        <!-- 丰富内容抽屉 -->
        <q-antd-drawer @register="registerRichContent" title="项目统计" width="800">
            <div class="drawer-content">
                <a-row :gutter="16" style="margin-bottom: 16px">
                    <a-col :span="6">
                        <a-statistic title="总项目数" :value="112893" />
                    </a-col>
                    <a-col :span="6">
                        <a-statistic title="进行中" :value="12" suffix="个" />
                    </a-col>
                    <a-col :span="6">
                        <a-statistic title="已完成" :value="93" suffix="个" />
                    </a-col>
                    <a-col :span="6">
                        <a-statistic title="完成率" :value="88.6" precision="1" suffix="%" :value-style="{ color: '#3f8600' }" />
                    </a-col>
                </a-row>

                <a-divider />

                <h4>最近项目</h4>
                <a-list :data-source="projectList" item-layout="horizontal">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <template #actions>
                                <a>查看</a>
                                <a>编辑</a>
                            </template>
                            <a-list-item-meta :title="item.name" :description="item.description">
                                <template #avatar>
                                    <a-avatar :style="{ backgroundColor: item.color }">
                                        {{ item.name.charAt(0) }}
                                    </a-avatar>
                                </template>
                            </a-list-item-meta>
                            <div>{{ item.status }}</div>
                        </a-list-item>
                    </template>
                </a-list>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerTable" title="用户列表" width="900">
            <div class="drawer-content">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-input-search placeholder="搜索用户" style="width: 200px" @search="onSearch" />
                        <a-button type="primary">新增用户</a-button>
                        <a-button>导出数据</a-button>
                    </a-space>
                </div>

                <a-table :columns="tableColumns" :data-source="tableData" :pagination="{ pageSize: 5 }" size="small">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'status'">
                            <a-tag :color="record.status === '激活' ? 'green' : 'red'">
                                {{ record.status }}
                            </a-tag>
                        </template>
                        <template v-else-if="column.key === 'action'">
                            <a-space>
                                <a>编辑</a>
                                <a>删除</a>
                            </a-space>
                        </template>
                    </template>
                </a-table>
            </div>
        </q-antd-drawer>

        <q-antd-drawer @register="registerSteps" title="项目创建向导" width="700">
            <div class="drawer-content">
                <a-steps :current="currentStep" style="margin-bottom: 24px">
                    <a-step title="基本信息" description="填写项目基本信息" />
                    <a-step title="项目配置" description="配置项目参数" />
                    <a-step title="团队成员" description="添加团队成员" />
                    <a-step title="完成" description="确认并创建项目" />
                </a-steps>

                <div class="steps-content">
                    <div v-if="currentStep === 0">
                        <h4>基本信息</h4>
                        <a-form layout="vertical">
                            <a-form-item label="项目名称">
                                <a-input placeholder="请输入项目名称" />
                            </a-form-item>
                            <a-form-item label="项目描述">
                                <a-textarea placeholder="请输入项目描述" :rows="3" />
                            </a-form-item>
                            <a-form-item label="项目类型">
                                <a-select placeholder="请选择项目类型">
                                    <a-select-option value="web">Web应用</a-select-option>
                                    <a-select-option value="mobile">移动应用</a-select-option>
                                    <a-select-option value="desktop">桌面应用</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                    </div>

                    <div v-if="currentStep === 1">
                        <h4>项目配置</h4>
                        <a-form layout="vertical">
                            <a-form-item label="技术栈">
                                <a-checkbox-group>
                                    <a-checkbox value="vue">Vue.js</a-checkbox>
                                    <a-checkbox value="react">React</a-checkbox>
                                    <a-checkbox value="angular">Angular</a-checkbox>
                                    <a-checkbox value="typescript">TypeScript</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item label="开发环境">
                                <a-radio-group>
                                    <a-radio value="dev">开发环境</a-radio>
                                    <a-radio value="test">测试环境</a-radio>
                                    <a-radio value="prod">生产环境</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-form>
                    </div>

                    <div v-if="currentStep === 2">
                        <h4>团队成员</h4>
                        <p>添加项目团队成员...</p>
                    </div>

                    <div v-if="currentStep === 3">
                        <a-result status="success" title="项目创建完成" sub-title="恭喜！项目已成功创建，您可以开始开发了。" />
                    </div>
                </div>

                <div class="steps-action" style="margin-top: 24px">
                    <a-space>
                        <a-button v-if="currentStep > 0" @click="prevStep">上一步</a-button>
                        <a-button v-if="currentStep < 3" type="primary" @click="nextStep"> 下一步 </a-button>
                        <a-button v-if="currentStep === 3" type="primary" @click="finishSteps"> 完成 </a-button>
                    </a-space>
                </div>
            </div>
        </q-antd-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { QAntdDrawer, useDrawer } from '@quantum-design/vue3-antd-pc-ui';
import {
    Card as ACard,
    Button as AButton,
    Space as ASpace,
    Divider as ADivider,
    Result as AResult,
    Alert as AAlert,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Timeline as ATimeline,
    TimelineItem as ATimelineItem,
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    InputNumber as AInputNumber,
    Select as ASelect,
    SelectOption as ASelectOption,
    DatePicker as ADatePicker,
    Textarea as ATextarea,
    Switch as ASwitch,
    Row as ARow,
    Col as ACol,
    Statistic as AStatistic,
    List as AList,
    ListItem as AListItem,
    ListItemMeta as AListItemMeta,
    Avatar as AAvatar,
    Table as ATable,
    Tag as ATag,
    InputSearch as AInputSearch,
    Steps as ASteps,
    Step as AStep,
    Checkbox as ACheckbox,
    CheckboxGroup as ACheckboxGroup,
    Radio as ARadio,
    RadioGroup as ARadioGroup,
    message
} from 'ant-design-vue';

defineOptions({
    name: 'DrawerDemo'
});

// 基础抽屉
const [registerBasic, { openDrawer: openBasicDrawer }] = useDrawer();

// 位置抽屉
const [registerLeft, { openDrawer: openLeftDrawer }] = useDrawer();
const [registerTop, { openDrawer: openTopDrawer }] = useDrawer();
const [registerBottom, { openDrawer: openBottomDrawer }] = useDrawer();

// 尺寸抽屉
const [registerSmall, { openDrawer: openSmallDrawer }] = useDrawer();
const [registerMedium, { openDrawer: openMediumDrawer }] = useDrawer();
const [registerLarge, { openDrawer: openLargeDrawer }] = useDrawer();
const [registerFull, { openDrawer: openFullDrawer }] = useDrawer();

// 功能配置抽屉
const [registerLoading, { openDrawer: openDrawerWithLoading }] = useDrawer();
const [registerNoFooter, { openDrawer: openDrawerNoFooter, closeDrawer: closeNoFooterDrawer }] = useDrawer();
const [registerCustomFooter, { openDrawer: openDrawerCustomFooter }] = useDrawer();
const [registerNoMaskClose, { openDrawer: openDrawerNoMaskClose }] = useDrawer();

// 详情模式抽屉
const [registerDetail, { openDrawer: openDetailDrawer }] = useDrawer();
const [registerDetailWithBack, { openDrawer: openDetailWithBackDrawer }] = useDrawer();

// 表单抽屉
const [registerForm, { openDrawer: openFormDrawer }] = useDrawer();
const [registerEditForm, { openDrawer: openEditFormDrawer }] = useDrawer();

// 丰富内容抽屉
const [registerRichContent, { openDrawer: openRichContentDrawer }] = useDrawer();
const [registerTable, { openDrawer: openTableDrawer }] = useDrawer();
const [registerSteps, { openDrawer: openStepsDrawer }] = useDrawer();

// 状态管理
const loadingState = ref(false);
const formLoading = ref(false);
const currentStep = ref(0);

// 表单数据
const formRef = ref();
const formData = reactive({
    name: '',
    age: undefined,
    email: '',
    phone: '',
    department: undefined,
    position: '',
    joinDate: undefined,
    remark: ''
});

const editFormData = reactive({
    name: '王五',
    age: 30,
    email: 'wangwu@example.com',
    active: true
});

const formRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
    department: [{ required: true, message: '请选择部门', trigger: 'change' }],
    position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
};

// 项目列表数据
const projectList = ref([
    {
        name: '前端重构项目',
        description: '使用Vue3重构现有系统',
        status: '进行中',
        color: '#1890ff'
    },
    {
        name: '移动端开发',
        description: '开发移动端应用',
        status: '已完成',
        color: '#52c41a'
    },
    {
        name: '数据可视化',
        description: '构建数据分析看板',
        status: '计划中',
        color: '#faad14'
    }
]);

// 表格数据
const tableColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '状态', key: 'status' },
    { title: '操作', key: 'action' }
];

const tableData = ref([
    {
        key: '1',
        name: '张三',
        age: 28,
        email: 'zhangsan@example.com',
        department: '技术部',
        status: '激活'
    },
    {
        key: '2',
        name: '李四',
        age: 32,
        email: 'lisi@example.com',
        department: '产品部',
        status: '激活'
    },
    {
        key: '3',
        name: '王五',
        age: 25,
        email: 'wangwu@example.com',
        department: '设计部',
        status: '停用'
    }
]);

// 事件处理函数
function handleLoadingOk() {
    loadingState.value = true;
    setTimeout(() => {
        loadingState.value = false;
        message.success('操作完成！');
    }, 3000);
}

function handleDetailBack() {
    message.info('点击了返回按钮');
}

function handleFormSubmit() {
    if (formRef.value) {
        formRef.value
            .validate()
            .then(() => {
                formLoading.value = true;
                setTimeout(() => {
                    formLoading.value = false;
                    message.success('提交成功！');
                    Object.assign(formData, {
                        name: '',
                        age: undefined,
                        email: '',
                        phone: '',
                        department: undefined,
                        position: '',
                        joinDate: undefined,
                        remark: ''
                    });
                }, 2000);
            })
            .catch(() => {
                message.error('请检查表单信息');
            });
    } else {
        message.success('编辑成功！');
    }
}

function onSearch(value: string) {
    console.log('搜索:', value);
    message.info(`搜索关键词: ${value}`);
}

function nextStep() {
    currentStep.value++;
}

function prevStep() {
    currentStep.value--;
}

function finishSteps() {
    currentStep.value = 0;
    message.success('项目创建完成！');
}
</script>

<style lang="scss" scoped>
.drawer-demo {
    padding: 16px;
}

.demo-section {
    padding: 16px 0;
}

.drawer-content {
    padding: 16px 0;

    h3,
    h4 {
        margin: 8px 0;
        color: #333;
        font-weight: 500;
    }

    ul {
        margin: 16px 0;
        padding-left: 20px;

        li {
            margin: 4px 0;
        }
    }
}

.steps-content {
    min-height: 200px;
    margin: 16px 0;
    padding: 24px;
    background: #fafafa;
    border-radius: 6px;
}

.steps-action {
    text-align: center;
}
</style>
