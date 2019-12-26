import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function listByPage (query) {
  return fetch({
    url: '/basic/administratives/page',
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
    url: '/basic/administratives',
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
    url: '/basic/administratives/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function removeById (id) {
  return fetch({
    url: '/basic/administratives/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function update (obj) {
  return fetch({
    url: '/basic/administratives',
    method: 'put',
    data: obj
  })
}

/**
 * 获取行政地区树形结构
 * @param
 */
export function getAdministrativeTree () {
  return fetch({
    url: '/basic/administratives/tree',
    method: 'get'
  })
}

/**
 * 获取省市下拉框
 * @param parentCode 父级行政代码
 */
export function getAdministrativeSelect (parentCode) {
  return fetch({
    url: '/basic/administratives/parents/' + parentCode,
    method: 'get'
  })
}

