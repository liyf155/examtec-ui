import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import VueMoment from 'vue-moment'
import VueAxios from 'vue-axios'
// import ElementUI from 'element-ui'
import axios from './router/axios'
import './permission' // 权限
import './errorLog' // 错误日志
import './icons' // 图标
import * as filters from './filters' // 全局filter
import './styles/common.scss'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import { loadStyle } from './util/util'
import './plugins/element.js'
// import Viewer from 'v-viewer'

Vue.config.productionTip = false
// Vue.use(ElementUI)
Vue.use(VueMoment)
Vue.use(VueAxios, axios)

Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
