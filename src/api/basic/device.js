import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function listByPage (query) {
  return fetch({
    url: '/basic/devices/page',
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
    url: '/basic/devices',
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
    url: '/basic/devices/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function removeById (id) {
  return fetch({
    url: '/basic/devices/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function update (obj) {
  return fetch({
    url: '/basic/devices',
    method: 'put',
    data: obj
  })
}
