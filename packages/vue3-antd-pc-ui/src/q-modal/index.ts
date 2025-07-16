import QAntdModal from './src/modal.vue';
export type { ModalProps } from './src/types/modal';

import { useQAntdModal, setDefaultModalProps } from './src/hooks/use-modal';
import type { App } from 'vue';

QAntdModal.install = function(app: App) {
    app.component(QAntdModal.name as string, QAntdModal);
    return app;
};

export default QAntdModal;

export { useQAntdModal, setDefaultModalProps };
