
import { defineStore } from 'pinia';

type size = 'default' | 'small' | 'large'
// state
const createState = () => {
    const state = {
        formModel: {

        },
        modelSize: 'default' as size, // large 、default 和 small   输入框高度为 40px 32px 和 24px ，默认高度为 32px （全站antd组件size）
        tableSize: 'small' as size, // large 、default 和 small   输入框高度为 40px 32px 和 24px ，默认高度为 32px （antd  table组件size）
        cardSize: 'small' as size, // large 、default 和 small   输入框高度为 40px 32px 和 24px ，默认高度为 32px （antd  table组件size）
        rangePicker: {}, // 日期组件快捷键设置 （通过app.vue中设置）
        defaultPicker: {} // 日期组件默认显示日期
    };
    return state;
};
export type antdState = ReturnType<typeof createState> & {
    modelSize: size,
    tableSize: size
}

const state = createState();

export const useAntdStore = defineStore('antd', {
    state: ():antdState => (state)
});
