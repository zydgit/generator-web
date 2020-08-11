import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/quickQuery',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/quickQuery',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/quickQuery',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/quickQuery',
    method: 'put',
    data
  })
}
