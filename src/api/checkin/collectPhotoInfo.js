import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCollectPhotoInfosByPage (query) {
  return fetch({
    url: '/checkin/collect-photo-infos/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCollectPhotoInfo (obj) {
  return fetch({
    url: '/checkin/collect-photo-infos',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCollectPhotoInfo (id) {
  return fetch({
    url: '/checkin/collect-photo-infos/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCollectPhotoInfo (id) {
  return fetch({
    url: '/checkin/collect-photo-infos/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCollectPhotoInfo (obj) {
  return fetch({
    url: '/checkin/collect-photo-infos',
    method: 'put',
    data: obj
  })
}
