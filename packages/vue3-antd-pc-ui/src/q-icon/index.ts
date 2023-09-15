import { App, Plugin } from 'vue';
import {Icon as QAntdIcon, addIcon} from './src/icon';
import IconPicker from './src/icon-picker.vue';

export type * from './src/types';

// @ts-ignore
QAntdIcon.IconPicker = IconPicker;

// @ts-ignore
QAntdIcon.install = function(app: App) {
    app.component('QAntdIcon', QAntdIcon);
    // @ts-ignore
    app.component(QAntdIcon.IconPicker.name, QAntdIcon.IconPicker);
    return app;
};

export {addIcon, IconPicker as QAntdIconPicker};

export default QAntdIcon as typeof QAntdIcon &
Plugin & {
    // @ts-ignore
    readonly IconPicker: typeof QAntdIcon.IconPicker
};
