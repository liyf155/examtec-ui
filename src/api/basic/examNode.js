import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function listByPage (query) {
  return fetch({
    url: '/basic/examnodes/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function save (obj) {
  return fetch({
    url: '/basic/examnodes',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getById (id) {
  return fetch({
    url: '/basic/examnodes/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function removeById (id) {
  return fetch({
    url: '/basic/exam-nodes/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function update (obj) {
  return fetch({
    url: '/basic/examnodes',
    method: 'put',
    data: obj
  })
}

/**
 * 获取所有考点名称
 * @param obj
 */
export function getNodeNameList (cityId) {
  return fetch({
    url: '/basic/examnodes/getNodeName/' + cityId,
    method: 'get'
  })
}
