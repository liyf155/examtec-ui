import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCheckinRoundsByPage (query) {
  return fetch({
    url: '/checkin/checkin-rounds/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCheckinRound (obj) {
  return fetch({
    url: '/checkin/checkin-rounds',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCheckinRound (id) {
  return fetch({
    url: '/checkin/checkin-rounds/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCheckinRound (id) {
  return fetch({
    url: '/checkin/checkin-rounds/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCheckinRound (obj) {
  return fetch({
    url: '/checkin/checkin-rounds',
    method: 'put',
    data: obj
  })
}
