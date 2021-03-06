import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getPeopleRoundRelationsByPage (query) {
  return fetch({
    url: '/checkin/people-round-relations/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addPeopleRoundRelation (obj) {
  return fetch({
    url: '/checkin/people-round-relations',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getPeopleRoundRelation (id) {
  return fetch({
    url: '/checkin/people-round-relations/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delPeopleRoundRelation (id) {
  return fetch({
    url: '/checkin/people-round-relations/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updPeopleRoundRelation (obj) {
  return fetch({
    url: '/checkin/people-round-relations',
    method: 'put',
    data: obj
  })
}
