/*
 * vuex 状态管理，非必需功能，如果不需要使用可以删除store文件夹
 */

import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import axios from '../http/index'
import api from '../http/api'

Vue.use(Vuex)

let state = {
  loadingPageStatus: 0,       //全屏loading状态 0隐藏  1显示
  toast: {
    isShow: 0,
    params: {
      type: '',
      title: '',
      text: '',
      delay: 2000,
    }
  },
  domain: 'https://xiaoshuo.km.com',
}
let mutations = {
  SET_LOADING_BEGIN(state, data) {
    state.loadingPageStatus = 1;
  },
  SET_LOADING_END(state, data) {
    state.loadingPageStatus = 0;
  },
  TOAST_SHOW(state, params) {
    state.toast.isShow = 1;
    state.toast.params.title = params.title ? params.title : '';
    state.toast.params.text = params.text ? params.text : '';
    state.toast.params.type = params.type ? params.type : '';
  },
  TOAST_HIDE(state, params) {
    state.toast.isShow = 0;
    state.toast.params.delay = 2000;
  },
}
let actions = {
  getRequest(store, params) {
    return axios.get(api[params.type] + '?t=' + Date.now(), params.params)
  },
  postRequest(store, params) {
    return axios.post(api[params.type] + '?t=' + Date.now(), params.params)
  }
}
let getters = {

}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
