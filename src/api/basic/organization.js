import request from '@/utils/request'


export function get(params) {
  return request({
    url: 'api/organization',
    method: 'get',
    params
  })
}

export function getAll() {
  return request({
    url: 'api/organization/all',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: 'api/organization/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/organization',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/organization',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/organization',
    method: 'put',
    data
  })
}
