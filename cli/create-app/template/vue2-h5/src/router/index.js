import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: '首页',
    component: (resolve) => require(['../pages/index/index'], resolve),
    meta: {
      title: '首页',
    }
  },
  {
    path: '/error',
    name: '404-1',
    component: (resolve) => require(['../pages/error/404'], resolve),
    meta: {
      title: '七猫小说',
    }
  },
  {
    path: '/*',
    name: '404-2',
    component: (resolve) => require(['../pages/error/404'], resolve),
    meta: {
      title: '七猫小说',
    }
  },

]

export default new Router({
  routes,
  mode: 'history'
})
