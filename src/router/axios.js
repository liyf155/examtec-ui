import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import errorCode from '@/const/errorCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import router from '@/router'
import { serialize } from '@/util/util'

// 超时时间
axios.defaults.timeout = 60000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
NProgress.configure({ showSpinner: false })// NProgress Configuration

// HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const isToken = (config.headers || {}).isToken === false
  const token = store.getters.access_token
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }
  // headers中配置serialize为true开启序列化
  if (config.methods === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }
  return config
}, error => {
  return Promise.reject(error)
})
// HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 404) {
    Message({
      timeout: 5,
      message: errorCode[status],
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  if (status === 401 || status === 403 || status === 405) {
    Message({
      timeout: 5,
      message: res.data.msg,
      type: 'warning'
    })
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }

  if (status === 200) {
    // 如果是undefined，则表示系统返回
    if (res.data.code !== undefined) {
      // res.data.code 不为空，则是自定义的异常处理
      if (res.data.code === 0) {
        return res.data
      } else if (res.data.code === 1000001000 || res.data.code === 1000001003) {
        store.dispatch('FedLogOut').then(() => {
          Message({
            timeout: 5,
            message: res.data.msg,
            type: 'warning'
          })
          router.push({ path: '/login' })
        })
        return
      } else {
        // 如果 大于 1，则是业务异常信息提示
        Message({
          timeout: 5,
          message: message,
          type: 'warning'
        })
        return Promise.reject(new Error(message))
      }
    } else {
      return res.data
    }
  }
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
