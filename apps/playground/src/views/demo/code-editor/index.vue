<template>
    <div class="code-editor-demo">
        <a-card title="基础用法" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <span>语言:</span>
                        <a-select v-model:value="basicLanguage" style="width: 120px" @change="onLanguageChange">
                            <a-select-option value="javascript">JavaScript</a-select-option>
                            <a-select-option value="typescript">TypeScript</a-select-option>
                            <a-select-option value="python">Python</a-select-option>
                            <a-select-option value="java">Java</a-select-option>
                            <a-select-option value="css">CSS</a-select-option>
                            <a-select-option value="html">HTML</a-select-option>
                            <a-select-option value="json">JSON</a-select-option>
                        </a-select>
                        <a-button @click="formatCode">格式化代码</a-button>
                        <a-button @click="getCode">获取代码</a-button>
                    </a-space>
                </div>
                <q-code-editor class="demo-code-editor" ref="basicEditorRef" v-model:value="basicCode" :language="basicLanguage" :height="300" @change="onBasicCodeChange" />
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
                <q-code-editor class="demo-code-editor" v-model:value="readonlyCode" language="typescript" :height="250" :readonly="isReadonly" />
            </div>
        </a-card>

        <a-card title="主题切换" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <span>主题:</span>
                        <a-radio-group v-model:value="currentTheme" @change="onThemeChange">
                            <a-radio-button value="vs">浅色主题</a-radio-button>
                            <a-radio-button value="vs-dark">深色主题</a-radio-button>
                            <a-radio-button value="hc-black">高对比度</a-radio-button>
                        </a-radio-group>
                    </a-space>
                </div>
                <q-code-editor class="demo-code-editor" ref="themeEditorRef" v-model:value="themeCode" language="javascript" :height="300" :theme="currentTheme" />
            </div>
        </a-card>

        <a-card title="自定义编辑器选项" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-row :gutter="16">
                        <a-col :span="6">
                            <a-space direction="vertical">
                                <div>
                                    <a-switch v-model:checked="editorOptions.minimap.enabled" />
                                    <span style="margin-left: 8px">显示小地图</span>
                                </div>
                                <div>
                                    <a-switch v-model:checked="editorOptions.lineNumbers" />
                                    <span style="margin-left: 8px">显示行号</span>
                                </div>
                                <div>
                                    <a-switch v-model:checked="editorOptions.wordWrap" />
                                    <span style="margin-left: 8px">自动换行</span>
                                </div>
                            </a-space>
                        </a-col>
                        <a-col :span="6">
                            <a-space direction="vertical">
                                <div>
                                    <span>字体大小:</span>
                                    <a-input-number v-model:value="editorOptions.fontSize" :min="12" :max="24" style="width: 80px" />
                                </div>
                                <div>
                                    <span>Tab大小:</span>
                                    <a-input-number v-model:value="editorOptions.tabSize" :min="2" :max="8" style="width: 80px" />
                                </div>
                            </a-space>
                        </a-col>
                    </a-row>
                </div>
                <q-code-editor class="demo-code-editor" ref="customEditorRef" v-model:value="customCode" language="typescript" :height="350" :options="editorOptions" />
            </div>
        </a-card>

        <a-card title="多语言代码示例" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <a-tabs v-model:activeKey="activeTab" @change="onTabChange">
                        <a-tab-pane key="javascript" tab="JavaScript">
                            <q-code-editor class="demo-code-editor" v-model:value="codeExamples.javascript" language="javascript" :height="300" :readonly="true" />
                        </a-tab-pane>
                        <a-tab-pane key="python" tab="Python">
                            <q-code-editor class="demo-code-editor" v-model:value="codeExamples.python" language="python" :height="300" :readonly="true" />
                        </a-tab-pane>
                        <a-tab-pane key="java" tab="Java">
                            <q-code-editor class="demo-code-editor" v-model:value="codeExamples.java" language="java" :height="300" :readonly="true" />
                        </a-tab-pane>
                        <a-tab-pane key="css" tab="CSS">
                            <q-code-editor class="demo-code-editor" v-model:value="codeExamples.css" language="css" :height="300" :readonly="true" />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </a-card>

        <a-card title="代码比较" class="g-mt">
            <div class="editor-section">
                <div style="margin-bottom: 16px">
                    <h4>左侧 (原始代码) vs 右侧 (修改后代码)</h4>
                </div>
                <div style="display: flex; gap: 16px">
                    <div style="flex: 1">
                        <h5>原始代码</h5>
                        <q-code-editor class="demo-code-editor" v-model:value="originalCode" language="javascript" :height="300" />
                    </div>
                    <div style="flex: 1">
                        <h5>修改后代码</h5>
                        <q-code-editor class="demo-code-editor" v-model:value="modifiedCode" language="javascript" :height="300" />
                    </div>
                </div>
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
                <q-code-editor class="demo-code-editor" v-model:value="eventCode" language="javascript" :height="200" @change="onEventCodeChange" @blur="onEditorBlur" @focus="onEditorFocus" />
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { QCodeEditor } from '@quantum-design/vue3-pc-ui';
import { Card as ACard, Button as AButton, Space as ASpace, Select as ASelect, SelectOption as ASelectOption, Switch as ASwitch, RadioGroup as ARadioGroup, RadioButton as ARadioButton, Row as ARow, Col as ACol, InputNumber as AInputNumber, Tabs as ATabs, TabPane as ATabPane, message } from 'ant-design-vue';

defineOptions({
    name: 'CodeEditorDemo'
});

// 基础用法
const basicEditorRef = ref();
const basicLanguage = ref('javascript');
const basicCode = ref(`function hello() {
    console.log("Hello, World!");
    return "Welcome to QCodeEditor";
}`);

// 只读模式
const isReadonly = ref(true);
const readonlyCode = ref(`interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

class UserService {
    private users: User[] = [];
    
    addUser(user: Omit<User, 'id'>): User {
        const newUser = {
            ...user,
            id: Date.now()
        };
        this.users.push(newUser);
        return newUser;
    }
    
    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }
}`);

// 主题切换
const themeEditorRef = ref();
const currentTheme = ref('vs');
const themeCode = ref(`// 主题切换示例代码
const themes = {
    light: 'vs',
    dark: 'vs-dark',
    highContrast: 'hc-black'
};

function switchTheme(themeName) {
    const editor = monaco.editor.getEditors()[0];
    if (editor) {
        monaco.editor.setTheme(themes[themeName]);
    }
}`);

// 自定义编辑器选项
const customEditorRef = ref();
const editorOptions = reactive({
    fontSize: 14,
    tabSize: 4,
    lineNumbers: true,
    wordWrap: false,
    minimap: {
        enabled: true
    }
});

const customCode = ref(`/**
 * 自定义编辑器选项示例
 * 可以调整字体大小、Tab大小、行号显示等
 */

interface EditorOptions {
    fontSize?: number;
    tabSize?: number;
    lineNumbers?: boolean;
    wordWrap?: boolean;
    minimap?: {
        enabled: boolean;
    };
}

export class CodeEditor {
    private options: EditorOptions;
    
    constructor(options: EditorOptions = {}) {
        this.options = {
            fontSize: 14,
            tabSize: 4,
            lineNumbers: true,
            wordWrap: false,
            minimap: { enabled: true },
            ...options
        };
    }
    
    updateOptions(newOptions: Partial<EditorOptions>) {
        this.options = { ...this.options, ...newOptions };
    }
}`);

// 多语言代码示例
const activeTab = ref('javascript');
const codeExamples = reactive({
    javascript: `// JavaScript 示例
class Calculator {
    add(a, b) {
        return a + b;
    }
    
    multiply(a, b) {
        return a * b;
    }
    
    calculate(expression) {
        try {
            return eval(expression);
        } catch (error) {
            console.error('计算错误:', error);
            return null;
        }
    }
}

const calc = new Calculator();
console.log(calc.add(2, 3)); // 5`,

    python: `# Python 示例
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def multiply(self, a, b):
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def get_history(self):
        return self.history

# 使用示例
calc = Calculator()
print(calc.add(2, 3))  # 5
print(calc.multiply(4, 5))  # 20`,

    java: `// Java 示例
import java.util.ArrayList;
import java.util.List;

public class Calculator {
    private List<String> history;
    
    public Calculator() {
        this.history = new ArrayList<>();
    }
    
    public double add(double a, double b) {
        double result = a + b;
        history.add(a + " + " + b + " = " + result);
        return result;
    }
    
    public double multiply(double a, double b) {
        double result = a * b;
        history.add(a + " * " + b + " = " + result);
        return result;
    }
    
    public List<String> getHistory() {
        return new ArrayList<>(history);
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(2, 3)); // 5.0
    }
}`,

    css: `/* CSS 样式示例 */
.calculator {
    max-width: 300px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: 'Arial', sans-serif;
}

.calculator h2 {
    text-align: center;
    margin-bottom: 20px;
    font-weight: 300;
}

.calculator-display {
    width: 100%;
    height: 60px;
    font-size: 24px;
    text-align: right;
    padding: 0 15px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    backdrop-filter: blur(10px);
}

.calculator-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 20px;
}

.calculator-button {
    height: 50px;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.calculator-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}`
});

// 代码比较
const originalCode = ref(`function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}`);

const modifiedCode = ref(`function calculateTotal(items) {
    return items.reduce((total, item) => {
        return total + (item.price || 0);
    }, 0);
}`);

// 事件监听
const eventCode = ref(`// 修改此处代码，查看事件触发情况
console.log("Hello, QCodeEditor!");`);

const eventLog = ref<Array<{ time: string; type: string; data: string }>>([]);

// 监听编辑器选项变化
watch(
    editorOptions,
    () => {
        if (customEditorRef.value) {
            customEditorRef.value.updateOptions(editorOptions);
        }
    },
    { deep: true }
);

function onLanguageChange() {
    // 根据语言设置示例代码
    const examples = {
        javascript: `function greet(name) {
    return \`Hello, \${name}!\`;
}`,
        typescript: `interface Person {
    name: string;
    age: number;
}

function greet(person: Person): string {
    return \`Hello, \${person.name}!\`;
}`,
        python: `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
        java: `public class Greeter {
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
        css: `.greeting {
    color: #1890ff;
    font-size: 16px;
}`,
        html: `<!DOCTYPE html>
<html>
<head>
    <title>Greeting</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
        json: `{
    "greeting": "Hello, World!",
    "language": "JSON"
}`
    };

    basicCode.value = examples[basicLanguage.value] || '// 示例代码';
}

function formatCode() {
    if (basicEditorRef.value) {
        basicEditorRef.value.formatDocument();
        message.success('代码格式化完成');
    }
}

function getCode() {
    message.info(`当前代码长度: ${basicCode.value.length} 字符`);
    console.log('当前代码:', basicCode.value);
}

function onBasicCodeChange(value: string) {
    console.log('代码已更改:', value);
}

function onThemeChange() {
    if (themeEditorRef.value) {
        themeEditorRef.value.setTheme(currentTheme.value);
    }
}

function onTabChange(key: string) {
    console.log('切换到标签:', key);
}

function onEventCodeChange(value: string) {
    addEventLog('change', `代码长度: ${value.length}`);
}

function onEditorBlur() {
    addEventLog('blur', '编辑器失去焦点');
}

function onEditorFocus() {
    addEventLog('focus', '编辑器获得焦点');
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
</script>

<style lang="scss" scoped>
.demo-code-editor {
    height: 300px;
}

.code-editor-demo {
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
</style>
