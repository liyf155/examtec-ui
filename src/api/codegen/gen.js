import fetch from '@/router/axios'
import { Message } from 'element-ui'

/**
 * 获取表列表
 * @param {查询条件} query
 */
export function fetchList (query) {
  return fetch({
    url: '/gen/generator/page',
    method: 'get',
    params: query
  })
}

export function fetchDatabases () {
  return fetch({
    url: '/gen/generator/databases',
    method: 'get'
  })
}

/**
 * 生成代码并下载
 * @param {表名} table
 */
export function generateAndDownload (tables) {
  return fetch({
    url: '/gen/generator/code',
    method: 'post',
    data: tables,
    responseType: 'blob'
  }).then(res => { // 处理返回的文件流
    const fileReader = new FileReader()
    fileReader.onload = function (e) {
      try {
        const resData = JSON.parse(e.target.result)
        Message({
          timeout: 3,
          message: resData.msg,
          type: 'warning'
        })
      } catch (err) {
        const blob = new Blob([res], { type: 'application/zip' })
        const filename = 'codegen.zip'
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        window.setTimeout(function () {
          URL.revokeObjectURL(blob)
          document.body.removeChild(link)
        }, 0)
      }
    }
    fileReader.readAsText(res)
  })
}
