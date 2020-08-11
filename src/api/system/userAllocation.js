import request from '@/utils/request'

export function getUserAllocation(params) {
  return request({
    url: 'api/UserAllocation',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/UserAllocation',
    method: 'post',
    data
  })
}

export function del(allocationId) {
  return request({
    url: 'api/UserAllocation/' + allocationId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/UserAllocation',
    method: 'put',
    data
  })
}
