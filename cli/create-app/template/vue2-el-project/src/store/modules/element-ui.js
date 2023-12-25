const state = {
    formModel: {
        
    },
    modelSize: 'small', // medium、small、mini   输入框高度为 40px 32px 和 24px ，默认高度为 32px
    tableSize: 'mini', // medium、small、mini   输入框高度为 40px 32px 和 24px ，默认高度为 32px
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
