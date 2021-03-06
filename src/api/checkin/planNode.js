import fetch from '@/router/axios'

/**
 * 获取计划配置的考点列表
 * @param query
 */
export function getPlanNodes (planId) {
  return fetch({
    url: '/checkin/plan-nodes/getPlanNodes?planId=' + planId,
    method: 'get'
  })
}
