import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPositionsByPage (query) {
  return fetch({
    url: '/checkin/positions/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPosition (obj) {
  return fetch({
    url: '/checkin/positions',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPosition (id) {
  return fetch({
    url: '/checkin/positions/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPosition (id) {
  return fetch({
    url: '/checkin/positions/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPosition (obj) {
  return fetch({
    url: '/checkin/positions',
    method: 'put',
    data: obj
  })
}

/**
 * 获取所有工作人员列表
 */
export function getPostNameList () {
  return fetch({
    url: '/checkin/positions/getPostName',
    method: 'get'
  })
}
