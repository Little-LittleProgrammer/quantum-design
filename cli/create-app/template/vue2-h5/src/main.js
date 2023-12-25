import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import fastClick from 'fastclick'
import 'lib-flexible'
import store from './store'
// import '@style/reset.scss'
// import '@style/base.scss'
// import '@style/layout.scss'

import '@/style/global.scss'


/* 使用懒加载 */
Vue.use(VueLazyload)

Vue.config.productionTip = false

fastClick.attach(document.body)

router.beforeEach((to, from, next) => {
  /* 路由中添加meta.title字段可在路由切换时切换浏览器title */
  store.commit('SET_LOADING_BEGIN');
  
  document.title = to.meta.title
  next()
})

router.afterEach((to, from, next) => {
  // document.title = to.meta.title
  // next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
