import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/quickQueryLn',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/quickQueryLn',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/quickQueryLn',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/quickQueryLn',
    method: 'put',
    data
  })
}
