import type { App, Plugin } from 'vue';
import QAntdForm from './src/form.vue';
import selectAllVue from './src/components/select-all.vue';

export type * from './src/types';
export type * from './src/types/form';
export type * from './src/types/form-item';

export { useComponentRegister, delComponentRegister } from './src/hooks/use-component-register';
export { useForm } from './src/hooks/use-form';
export { defineSchemas } from './src/hooks/use-schemas';

QAntdForm.selectAll = selectAllVue;

QAntdForm.install = function(app: App) {
    app.component(QAntdForm.name, QAntdForm);
    app.component(QAntdForm.selectAll.name, QAntdForm.selectAll);
    return app;
};

export {selectAllVue as QAntdSelectAll};

export default QAntdForm as typeof QAntdForm &
Plugin & {
    readonly SelectAll: typeof QAntdForm.SelectAll
};
