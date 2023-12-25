const state = {
    formModel: {
        
    },
    modelSize: 'default', // large 、default 和 small   输入框高度为 40px 32px 和 24px ，默认高度为 32px （全站antd组件size）
    tableSize: 'small', // large 、default 和 small   输入框高度为 40px 32px 和 24px ，默认高度为 32px （antd  table组件size）
    rangePicker: {}, // 日期组件快捷键设置 （通过app.vue中设置）
    defaultPicker: {} // 日期组件默认显示日期
};

const getters = {
};

const mutations = {
    SET_ANTD_RANGE_PICKER_DATA(state, data) { // 设置日期组件快捷键
        state.rangePicker = data;
    },
    SET_ANTD_DEFAULT_PICKER_DATA(state, data) { // 设置日期组件默认显示日期
        state.defaultPicker = data;
    }
};
const actions = {};

export default {
    state,
    getters,
    actions,
    mutations
};
