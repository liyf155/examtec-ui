import fetch from '@/router/axios'

/**
 * 分页获取数据
 * @param query
 */
export function getCheckinPlansByPage (query) {
  return fetch({
    url: '/checkin/checkin-plans/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加对象
 * @param obj
 */
export function addCheckinPlan (obj) {
  return fetch({
    url: '/checkin/checkin-plans',
    method: 'post',
    data: obj
  })
}

/**
 * 通过ID获取对象
 * @param id
 */
export function getCheckinPlan (id) {
  return fetch({
    url: '/checkin/checkin-plans/' + id,
    method: 'get'
  })
}

/**
 * 通过ID删除对象
 * @param row
 */
export function delCheckinPlan (id) {
  return fetch({
    url: '/checkin/checkin-plans/' + id,
    method: 'delete'
  })
}

/**
 * 更新对象
 * @param obj
 */
export function updCheckinPlan (obj) {
  return fetch({
    url: '/checkin/checkin-plans',
    method: 'put',
    data: obj
  })
}

/**
 * 获取计划列表 （查询下拉框）
 * @param
 */
export function getPlanIdList () {
  return fetch({
    url: '/checkin/checkin-plans/getPlanIdList',
    method: 'get'
  })
}

/**
 * 获取计划列表
 * @param
 */
export function getPlanList () {
  return fetch({
    url: '/checkin/checkin-plans/list',
    method: 'get'
  })
}
