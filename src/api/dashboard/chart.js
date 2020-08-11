import request from '@/utils/request'

// 我的任务数据
export function getMyMission() {
  return request({
    url: 'api/chart/myMission',
    method: 'get'
  })
}

// 业务增长数据
export function getBusinessGrowthData(params) {
  return request({
    url: 'api/chart/businessGrowthData',
    method: 'get',
    params
  })
}

// 制证类型分布
export function getJeTypeDistrData(params) {
  return request({
    url: 'api/chart/jeTypeDistrData',
    method: 'get',
    params
  })
}

// 凭证来源系统
export function getJeSourceData(params) {
  return request({
    url: 'api/chart/jeSourceData',
    method: 'get',
    params
  })
}

// 过账统计
export function getPortStatisticsData() {
  return request({
    url: 'api/chart/portStatistics',
    method: 'get'
  })
}
