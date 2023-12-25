import Vue from 'vue';
import Vuex from 'vuex';
import global from './modules/global';
import elementUi from './modules/element-ui';
import systemManagement from './modules/system-management';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        global,
        elementUi,
        systemManagement
    }
});
