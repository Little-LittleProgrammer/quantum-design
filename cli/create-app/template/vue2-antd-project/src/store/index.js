import Vue from 'vue';
import Vuex from 'vuex';
import global from './modules/global';
import antd from './modules/antd';
import systemManagement from './modules/systemManagement';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        global,
        antd,
        systemManagement
    }
});
