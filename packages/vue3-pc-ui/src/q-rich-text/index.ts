import { defineAsyncComponent } from 'vue';

export type {
    QRichText as RichText
};

const QRichText = defineAsyncComponent(() => import('./src/rich-text.vue'));

// const QCodeEditor = component_with_install(CodeEditor);

export default QRichText;
