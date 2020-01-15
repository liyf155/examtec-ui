import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import { formatRoutes } from '@/util/util'

Vue.use(VueRouter)

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
// 布局
import Layout from '@/page/index/index'

const constantRouterMap = [{
  path: '/',
  // name: '主页',
  redirect: '/wel'
}, {
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '主页',
    component: () => import('@/page/wel.vue'),
    meta: { title: '主页', icon: 'el-icon-s-data', breadcrumb: true }
  }]
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}, {
  path: '/login',
  name: '登录页',
  component: () => import('@/page/login/index.vue')
}, {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [
    {
      path: 'index',
      name: '个人信息',
      component: () => import('@/views/admin/user/info')
    },
    {
      path: 'passwd',
      name: '修改密码',
      component: () => import('@/views/admin/user/passwd')
    }
  ]
}, {
  path: '/404',
  component: () => import('@/components/error-page/404'),
  name: '404'
}, {
  path: '/403',
  component: () => import('@/components/error-page/403'),
  name: '403'
}, {
  path: '/500',
  component: () => import('@/components/error-page/500'),
  name: '500'
}]

export default new VueRouter({
  // mode: 'history',
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [].concat(...formatRoutes(store.state.user.menu), constantRouterMap)
})
