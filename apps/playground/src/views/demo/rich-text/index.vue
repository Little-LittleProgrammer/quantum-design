<template>
    <div class="rich-text-demo">
        <a-card title="基础用法" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="getContent">获取内容</a-button>
                        <a-button @click="setContent">设置内容</a-button>
                        <a-button @click="clearContent">清空内容</a-button>
                        <a-button @click="insertText">插入文本</a-button>
                    </a-space>
                </div>
                <q-rich-text ref="basicEditorRef" v-model:value="basicContent" :height="300" @change="onBasicContentChange" />
            </div>
        </a-card>

        <a-card title="尺寸自定义" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <span>宽度:</span>
                        <a-input-number v-model:value="customWidth" :min="300" :max="1200" style="width: 100px" addon-after="px" />
                        <span>高度:</span>
                        <a-input-number v-model:value="customHeight" :min="200" :max="800" style="width: 100px" addon-after="px" />
                    </a-space>
                </div>
                <q-rich-text v-model:value="sizeContent" :width="customWidth" :height="customHeight" />
            </div>
        </a-card>

        <a-card title="主题模式" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <span>主题:</span>
                        <a-radio-group v-model:value="currentTheme">
                            <a-radio-button value="light">浅色主题</a-radio-button>
                            <a-radio-button value="dark">深色主题</a-radio-button>
                        </a-radio-group>
                    </a-space>
                </div>
                <q-rich-text v-model:value="themeContent" :height="300" :theme-mode="currentTheme" />
            </div>
        </a-card>

        <a-card title="自定义工具栏" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space wrap>
                        <span>选择工具栏:</span>
                        <a-checkbox-group v-model:value="selectedToolbar">
                            <a-checkbox value="undo">撤销</a-checkbox>
                            <a-checkbox value="redo">重做</a-checkbox>
                            <a-checkbox value="bold">粗体</a-checkbox>
                            <a-checkbox value="italic">斜体</a-checkbox>
                            <a-checkbox value="underline">下划线</a-checkbox>
                            <a-checkbox value="strikethrough">删除线</a-checkbox>
                            <a-checkbox value="fontselect">字体</a-checkbox>
                            <a-checkbox value="fontsizeselect">字号</a-checkbox>
                            <a-checkbox value="forecolor">文字颜色</a-checkbox>
                            <a-checkbox value="backcolor">背景色</a-checkbox>
                            <a-checkbox value="alignleft">左对齐</a-checkbox>
                            <a-checkbox value="aligncenter">居中</a-checkbox>
                            <a-checkbox value="alignright">右对齐</a-checkbox>
                            <a-checkbox value="bullist">无序列表</a-checkbox>
                            <a-checkbox value="numlist">有序列表</a-checkbox>
                            <a-checkbox value="link">链接</a-checkbox>
                            <a-checkbox value="image">图片</a-checkbox>
                            <a-checkbox value="table">表格</a-checkbox>
                            <a-checkbox value="code">代码</a-checkbox>
                        </a-checkbox-group>
                    </a-space>
                </div>
                <q-rich-text v-model:value="toolbarContent" :height="300" :toolbar="selectedToolbar" />
            </div>
        </a-card>

        <a-card title="插件配置" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space wrap>
                        <span>选择插件:</span>
                        <a-checkbox-group v-model:value="selectedPlugins">
                            <a-checkbox value="advlist">高级列表</a-checkbox>
                            <a-checkbox value="autolink">自动链接</a-checkbox>
                            <a-checkbox value="lists">列表</a-checkbox>
                            <a-checkbox value="link">链接</a-checkbox>
                            <a-checkbox value="image">图片</a-checkbox>
                            <a-checkbox value="charmap">字符映射</a-checkbox>
                            <a-checkbox value="print">打印</a-checkbox>
                            <a-checkbox value="preview">预览</a-checkbox>
                            <a-checkbox value="searchreplace">查找替换</a-checkbox>
                            <a-checkbox value="fullscreen">全屏</a-checkbox>
                            <a-checkbox value="media">媒体</a-checkbox>
                            <a-checkbox value="table">表格</a-checkbox>
                            <a-checkbox value="code">代码</a-checkbox>
                            <a-checkbox value="help">帮助</a-checkbox>
                            <a-checkbox value="wordcount">字数统计</a-checkbox>
                        </a-checkbox-group>
                    </a-space>
                </div>
                <q-rich-text v-model:value="pluginContent" :height="300" :plugins="selectedPlugins" />
            </div>
        </a-card>

        <a-card title="内容模板" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <span>选择模板:</span>
                        <a-select v-model:value="selectedTemplate" style="width: 150px" @change="loadTemplate">
                            <a-select-option value="article">文章模板</a-select-option>
                            <a-select-option value="news">新闻模板</a-select-option>
                            <a-select-option value="notice">通知模板</a-select-option>
                            <a-select-option value="email">邮件模板</a-select-option>
                        </a-select>
                        <a-button @click="resetTemplate">重置模板</a-button>
                    </a-space>
                </div>
                <q-rich-text v-model:value="templateContent" :height="400" />
            </div>
        </a-card>

        <a-card title="事件监听" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <h4>事件日志:</h4>
                    <div class="event-log">
                        <div v-for="(event, index) in eventLog" :key="index" class="event-item">
                            <span class="event-time">{{ event.time }}</span>
                            <span class="event-type">{{ event.type }}</span>
                            <span class="event-data">{{ event.data }}</span>
                        </div>
                    </div>
                </div>
                <q-rich-text v-model:value="eventContent" :height="250" @change="onEventContentChange" @inited="onEditorInited" @init-error="onEditorInitError" />
            </div>
        </a-card>

        <a-card title="只读模式" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-switch v-model:checked="isReadonly" />
                        <span>只读模式</span>
                    </a-space>
                </div>
                <q-rich-text :value="readonlyContent" :height="300" :readonly="isReadonly" />
            </div>
        </a-card>

        <a-card title="实时预览与导出" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="togglePreview">
                            {{ showPreview ? '隐藏预览' : '显示预览' }}
                        </a-button>
                        <a-button @click="exportHtml">导出HTML</a-button>
                        <a-button @click="exportText">导出纯文本</a-button>
                        <a-button @click="printContent">打印内容</a-button>
                    </a-space>
                </div>
                <div style="display: flex; gap: 16px">
                    <div :style="{ flex: showPreview ? 1 : 2 }">
                        <h5>编辑器</h5>
                        <q-rich-text ref="previewEditorRef" v-model:value="previewContent" :height="400" />
                    </div>
                    <div v-if="showPreview" style="flex: 1">
                        <h5>实时预览</h5>
                        <div class="preview-container" v-html="previewContent"></div>
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { QRichText } from '@quantum-design/vue3-pc-ui';
import { Card as ACard, Button as AButton, Space as ASpace, InputNumber as AInputNumber, RadioGroup as ARadioGroup, RadioButton as ARadioButton, CheckboxGroup as ACheckboxGroup, Checkbox as ACheckbox, Select as ASelect, SelectOption as ASelectOption, Switch as ASwitch, message } from 'ant-design-vue';

defineOptions({
    name: 'RichTextDemo'
});

// 基础用法
const basicEditorRef = ref();
const basicContent = ref('<p>欢迎使用QRichText富文本编辑器！</p><p>您可以在这里编辑内容，支持<strong>粗体</strong>、<em>斜体</em>、<u>下划线</u>等格式。</p>');

// 尺寸自定义
const customWidth = ref(800);
const customHeight = ref(300);
const sizeContent = ref('<p>这是一个自定义尺寸的富文本编辑器。</p><p>您可以调整宽度和高度来适配您的需求。</p>');

// 主题模式
const currentTheme = ref('light');
const themeContent = ref('<h2>主题模式示例</h2><p>这里演示了不同主题模式下的富文本编辑器效果。</p><ul><li>浅色主题：适合日间使用</li><li>深色主题：适合夜间使用，保护眼睛</li></ul>');

// 自定义工具栏
const selectedToolbar = ref(['undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'fontselect', 'fontsizeselect', 'forecolor', 'backcolor', 'alignleft', 'aligncenter', 'alignright', 'bullist', 'numlist', 'link', 'image', 'table', 'code']);
const toolbarContent = ref('<p>这是一个自定义工具栏的富文本编辑器。</p><p>您可以选择需要的工具来定制您的编辑体验。</p>');

// 插件配置
const selectedPlugins = ref(['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'searchreplace', 'fullscreen', 'media', 'table', 'code', 'help', 'wordcount']);
const pluginContent = ref('<p>这里展示了富文本编辑器的插件配置功能。</p><p>不同的插件提供不同的功能扩展。</p>');

// 内容模板
const selectedTemplate = ref('article');
const templateContent = ref('');

const templates = {
    article: `
        <h1>文章标题</h1>
        <p><em>发布时间：${new Date().toLocaleDateString()}</em></p>
        <h2>引言</h2>
        <p>这里是文章的引言部分，简要介绍文章的主要内容和观点。</p>
        <h2>正文</h2>
        <p>这里是文章的正文内容。您可以在这里详细阐述您的观点和论据。</p>
        <ul>
            <li>要点一：描述第一个重要观点</li>
            <li>要点二：描述第二个重要观点</li>
            <li>要点三：描述第三个重要观点</li>
        </ul>
        <h2>结论</h2>
        <p>这里是文章的结论部分，总结前面的内容并给出最终观点。</p>
    `,
    news: `
        <h1>新闻标题</h1>
        <p><strong>记者：</strong>张三 <strong>时间：</strong>${new Date().toLocaleString()}</p>
        <p><strong>【导语】</strong>这里是新闻的导语部分，简要概括新闻的核心内容。</p>
        <p><strong>【正文】</strong></p>
        <p>据了解，这里是新闻的详细内容。记者从相关部门获悉...</p>
        <p>相关负责人表示："这里可以插入引用内容，增加新闻的可信度。"</p>
        <p>截至发稿时，事件的最新进展是...</p>
        <p><strong>【编辑：李四】</strong></p>
    `,
    notice: `
        <h1 style="text-align: center;">通知</h1>
        <p><strong>发布单位：</strong>XXX部门</p>
        <p><strong>发布时间：</strong>${new Date().toLocaleDateString()}</p>
        <p><strong>通知对象：</strong>全体员工</p>
        <h2>通知内容</h2>
        <p>根据公司相关规定，现就以下事项通知如下：</p>
        <ol>
            <li>第一项通知内容...</li>
            <li>第二项通知内容...</li>
            <li>第三项通知内容...</li>
        </ol>
        <p><strong>特此通知，请各部门认真执行。</strong></p>
        <p style="text-align: right;">XXX部门<br/>${new Date().toLocaleDateString()}</p>
    `,
    email: `
        <p><strong>收件人：</strong>张三</p>
        <p><strong>发件人：</strong>李四</p>
        <p><strong>主题：</strong>关于项目进度的汇报</p>
        <p><strong>时间：</strong>${new Date().toLocaleString()}</p>
        <hr/>
        <p>张总，您好！</p>
        <p>这里是邮件的正文内容。我想就以下几个方面向您汇报：</p>
        <h3>项目进度</h3>
        <ul>
            <li>已完成的工作内容</li>
            <li>正在进行的工作</li>
            <li>下一步计划</li>
        </ul>
        <h3>遇到的问题</h3>
        <p>在项目执行过程中，我们遇到了以下问题...</p>
        <h3>需要的支持</h3>
        <p>希望能够得到以下支持...</p>
        <p>以上是本周的工作汇报，如有问题请随时联系我。</p>
        <p>此致<br/>敬礼！</p>
        <p style="text-align: right;">李四<br/>${new Date().toLocaleDateString()}</p>
    `
};

// 事件监听
const eventContent = ref('<p>在此编辑内容，查看事件触发情况。</p>');
const eventLog = ref<Array<{ time: string; type: string; data: string }>>([]);

// 只读模式
const isReadonly = ref(true);
const readonlyContent = `
    <h2>只读模式示例</h2>
    <p>这是一个只读模式的富文本编辑器，您无法编辑内容。</p>
    <p>只读模式通常用于展示内容，如文章阅读、公告展示等场景。</p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
            <th style="padding: 8px; background-color: #f5f5f5;">功能</th>
            <th style="padding: 8px; background-color: #f5f5f5;">描述</th>
        </tr>
        <tr>
            <td style="padding: 8px;">内容保护</td>
            <td style="padding: 8px;">防止意外修改重要内容</td>
        </tr>
        <tr>
            <td style="padding: 8px;">展示模式</td>
            <td style="padding: 8px;">专注于内容展示而非编辑</td>
        </tr>
    </table>
`;

// 实时预览与导出
const showPreview = ref(false);
const previewEditorRef = ref();
const previewContent = ref(`
    <h1>实时预览功能</h1>
    <p>这里演示了富文本编辑器的实时预览功能。您在左侧编辑器中的修改会实时反映在右侧预览区域。</p>
    <h2>功能特点</h2>
    <ul>
        <li><strong>实时同步：</strong>编辑内容立即在预览区显示</li>
        <li><strong>所见即所得：</strong>预览效果与最终输出一致</li>
        <li><strong>便于校对：</strong>可以边编辑边查看效果</li>
    </ul>
    <p>您还可以使用导出功能将内容保存为HTML或纯文本格式。</p>
`);

// 初始化模板
loadTemplate();

// 监听自定义工具栏变化
watch(
    selectedToolbar,
    () => {
        console.log('工具栏配置已更改:', selectedToolbar.value);
    },
    { deep: true }
);

// 监听插件配置变化
watch(
    selectedPlugins,
    () => {
        console.log('插件配置已更改:', selectedPlugins.value);
    },
    { deep: true }
);

function loadTemplate() {
    templateContent.value = templates[selectedTemplate.value];
}

function resetTemplate() {
    templateContent.value = '<p>模板已重置，请选择一个模板开始编辑。</p>';
}

function onBasicContentChange(content: string) {
    console.log('基础内容已更改:', content.length, '字符');
}

function getContent() {
    const content = basicEditorRef.value?.getContent() || basicContent.value;
    message.info(`当前内容长度: ${content.length} 字符`);
    console.log('当前内容:', content);
}

function setContent() {
    const newContent = '<h2>设置的新内容</h2><p>这是通过程序设置的新内容。</p><p>时间：' + new Date().toLocaleString() + '</p>';
    if (basicEditorRef.value) {
        basicEditorRef.value.setContent(newContent);
    } else {
        basicContent.value = newContent;
    }
    message.success('内容已更新');
}

function clearContent() {
    if (basicEditorRef.value) {
        basicEditorRef.value.setContent('');
    } else {
        basicContent.value = '';
    }
    message.info('内容已清空');
}

function insertText() {
    const textToInsert = '<p><strong>插入的文本：</strong>' + new Date().toLocaleString() + '</p>';
    if (basicEditorRef.value) {
        basicEditorRef.value.insertContent(textToInsert);
    }
    message.success('文本已插入');
}

function onEventContentChange(content: string) {
    addEventLog('change', `内容长度: ${content.length} 字符`);
}

function onEditorInited(editor: any) {
    addEventLog('inited', '编辑器初始化完成');
    console.log('编辑器实例:', editor);
}

function onEditorInitError(error: any) {
    addEventLog('init-error', '编辑器初始化失败');
    console.error('编辑器初始化错误:', error);
}

function addEventLog(type: string, data: string) {
    const now = new Date();
    const time = now.toLocaleTimeString();
    eventLog.value.unshift({ time, type, data });

    // 只保留最近10条记录
    if (eventLog.value.length > 10) {
        eventLog.value = eventLog.value.slice(0, 10);
    }
}

function togglePreview() {
    showPreview.value = !showPreview.value;
}

function exportHtml() {
    const content = previewContent.value;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rich-text-content.html';
    a.click();
    URL.revokeObjectURL(url);
    message.success('HTML文件已导出');
}

function exportText() {
    const content = previewContent.value.replace(/<[^>]*>/g, '');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rich-text-content.txt';
    a.click();
    URL.revokeObjectURL(url);
    message.success('文本文件已导出');
}

function printContent() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>打印内容</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1, h2, h3 { color: #333; }
                        table { border-collapse: collapse; width: 100%; }
                        td, th { border: 1px solid #ddd; padding: 8px; }
                    </style>
                </head>
                <body>
                    ${previewContent.value}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    message.info('打印窗口已打开');
}
</script>

<style lang="scss" scoped>
.rich-text-demo {
    padding: 16px;
}

.editor-section {
    padding: 16px 0;
}

h4,
h5 {
    margin: 8px 0;
    color: #333;
    font-weight: 500;
}

.event-log {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 8px;
    background: #fafafa;
}

.event-item {
    display: flex;
    gap: 12px;
    padding: 4px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 12px;

    &:last-child {
        border-bottom: none;
    }
}

.event-time {
    color: #666;
    min-width: 80px;
}

.event-type {
    color: #1890ff;
    min-width: 60px;
    font-weight: 500;
}

.event-data {
    color: #333;
    flex: 1;
}

.preview-container {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 16px;
    height: 400px;
    overflow-y: auto;
    background: #fff;

    :deep(h1),
    :deep(h2),
    :deep(h3) {
        color: #333;
        margin-top: 0;
    }

    :deep(table) {
        border-collapse: collapse;
        width: 100%;
    }

    :deep(td),
    :deep(th) {
        border: 1px solid #ddd;
        padding: 8px;
    }

    :deep(th) {
        background-color: #f5f5f5;
    }
}
</style>
