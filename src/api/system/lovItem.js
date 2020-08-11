import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/lovItem',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/lovItem',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/lovItem',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/lovItem',
    method: 'put',
    data
  })
}

export function updateFromQuickQuery(params) {
  return request({
    url: 'api/lovItem/copyFromQuickQueryLn',
    method: 'get',
    params
  })
}

