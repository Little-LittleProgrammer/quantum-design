import { defineAsyncComponent } from 'vue';

export type {
    QCodeEditor as CodeEditor
};

const QCodeEditor = defineAsyncComponent(() => import('./src/code-editor.vue'));

// const QCodeEditor = component_with_install(CodeEditor);

export default QCodeEditor;
