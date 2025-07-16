<!-- 代码编辑器  -->
<template>
    <div class="q-code-editor">
        <Teleport to="body" :disabled="!fullScreen">
            <div class="q-code-editor-wrapper" :class="`${fullScreen ? 'full-screen' : ''}`">
                <svg v-if="!fullScreen" t="1701256882326" class="code-edit-full-screen-button" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2319" width="200" height="200" @click="full_screen_handler"><path d="M344 64H120c-30.9 0-56 25.1-56 56v224c0 30.9 25.1 56 56 56s56-25.1 56-56V175.9l168 0.1c30.9 0 56-25.1 56-56s-25.1-56-56-56zM344 848l-168 0.1V680c0-30.9-25.1-56-56-56s-56 25.1-56 56v224c0 30.9 25.1 56 56 56h224c30.9 0 56-25.1 56-56s-25.1-56-56-56zM904 624c-30.9 0-56 25.1-56 56l0.1 168H680c-30.9 0-56 25.1-56 56s25.1 56 56 56h224c30.9 0 56-25.1 56-56V680c0-30.9-25.1-56-56-56zM904 64H680c-30.9 0-56 25.1-56 56s25.1 56 56 56h168.1l-0.1 168c0 30.9 25.1 56 56 56s56-25.1 56-56V120c0-30.9-25.1-56-56-56z" fill="#8a8a8a" p-id="2320"></path></svg>
                <svg v-if="fullScreen" t="1701256780086" class="code-edit-full-screen-button" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4736" width="200" height="200" @click="full_screen_handler"><path d="M358.4 921.6h-76.8v-179.2H102.4v-76.8h256v256z m307.2 0h76.8v-179.2h179.2v-76.8H665.6v256z m25.6-844.8h76.8v179.2h179.2v76.8H691.2V76.8zM332.8 76.8h-76.8v179.2H76.8v76.8h256V76.8z" p-id="4737" fill="#8a8a8a"></path></svg>
                <div ref="codeEditor" class="q-code-editor-content"></div>
            </div>
        </Teleport>
    </div>
</template>

<script lang='ts' setup>
import { onUnmounted, ref, watch } from 'vue';
// import * as monaco from 'monaco-editor'
import {serializeToString} from '@quantum-design/utils';
defineOptions({
    name: 'code-editor'
});

type UnwrapPromise<T> = T extends () => Promise<infer U> ? U : T

let monaco: any = null;
async function loadMonacoEditor() {
    try {
        const p = await import('monaco-editor');
        console.log('monaco-editor', p);
        monaco = p;
        loading.value = true;
        init_editor();
        // 使用 monaco 编辑器
    } catch (error) {
        console.log('skip to load monaco-editor');
        // 处理错误，例如显示一个提示信息
    }
}
loadMonacoEditor();
const props = withDefaults(
    defineProps<{
        value?:any
        language?: string;
        autoSave?: boolean;
        options?: {
            [key: string]: any;
        },
        parse?: <T = any>(schemas: string, language:string) => T
    }>(), {
        value: '',
        autoSave: true,
        language: 'typescript'
    }
);
const emit = defineEmits(['initd', 'save', 'change', 'blur']);

type Momonaco = UnwrapPromise<typeof monaco>['editor']['create'] extends (...args: any) => infer T ? T : any

let vsEditor: Momonaco | null = null;
const codeEditor = ref<HTMLDivElement>();
const fullScreen = ref(false);

const values = ref('');
const loading = ref(false);

const resizeObserver = new globalThis.ResizeObserver(() => {
    setTimeout(() => {
        vsEditor?.layout();
    }, 300);
});

function full_screen_handler() {
    fullScreen.value = !fullScreen.value;
    setTimeout(() => {
        vsEditor?.focus();
        vsEditor?.layout();
    }, 200);
}

const get_editor_value = () => {
    return to_string(vsEditor?.getValue() || '');
};

watch(
    () => props.value,
    (v: string | any, preV: string | any) => {
        if (v && v !== preV) {
            set_editor_value(props.value);
        }
    },
    {
        deep: true,
        immediate: true
    }
);

async function init_editor() {
    if (!codeEditor.value) return;

    const options = {
        value: values.value,
        language: props.language,
        theme: 'vs-dark',
        ...props.options
    };

    try {
        vsEditor = monaco.editor.create(codeEditor.value, options);

        set_editor_value(props.value || '');

        loading.value = false;

        codeEditor.value.addEventListener('keydown', (e) => {
            if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                e.stopPropagation();
                const newValue = get_editor_value();
                values.value = newValue;
                emit('save', props.parse ? props.parse(newValue, props.language) : newValue);
                emit('change', props.parse ? props.parse(newValue, props.language) : newValue);
                emit('blur', props.parse ? props.parse(newValue, props.language) : newValue);
            }
        });

        if (props.autoSave) {
            vsEditor.onDidBlurEditorWidget(() => {
                const newValue = get_editor_value();
                if (values.value !== newValue) {
                    values.value = newValue;
                    emit('save', props.parse ? props.parse(newValue, props.language) : newValue);
                    emit('blur', props.parse ? props.parse(newValue, props.language) : newValue);
                    emit('change', props.parse ? props.parse(newValue, props.language) : newValue);
                }
            });
        }
        resizeObserver.observe(codeEditor.value);
    } catch (error) {
    }
}

function to_string(v: string | any, language: string = props.language.toLocaleLowerCase()) {
    let value = '';
    if (typeof v !== 'string') {
        if (language === 'json') {
            value = JSON.stringify(v, null, 4);
        } else {
            value = serializeToString(v).replace(/"(\w+)":\s/g, '$1: ');
        }
    } else {
        value = v;
    }
    if (['javascript', 'typescript'].includes(language) && value.startsWith('{') && value.endsWith('}')) {
        value = `(${value})`;
    }
    return value;
}

function set_editor_value(value: string | any){
    const lang = props.language.toLocaleLowerCase();
    values.value = to_string(value, lang);

    if (['javascript', 'typescript'].includes(lang) && !(values.value.startsWith('{') && values.value.endsWith('}'))) {
        values.value = values.value.replace(/;/g, '\n');
    }

    return vsEditor?.setValue(values.value);
}

onUnmounted(() => {
    resizeObserver.disconnect();
});

defineExpose({
    values,

    getEditor() {
        return vsEditor;
    },

    set_editor_value,
    get_editor_value,

    focus() {
        vsEditor?.focus();
    }
});

</script>
<style lang='scss'>
.q-code-editor {
    width: 100%;
}
.q-code-editor-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    &.full-screen {
        position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
    }
    .code-edit-full-screen-button {
        cursor: pointer;
        height: 18px;
        width: 18px;
        position: absolute;
        top: 5px;
        right: 10px;
        z-index: 11;
    }
    .q-code-editor-content {
        width: 100%;
        height: 100%;
    }
}

</style>
