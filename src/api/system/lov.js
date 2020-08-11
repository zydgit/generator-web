import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/lov',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/lov',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/lov',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/lov',
    method: 'put',
    data
  })
}

export function getLovData(code, params = {}) {
  return request({
    url: `api/lov/getLovData/${code}`,
    method: 'get',
    params
  })
}

export function getLovConfig(code) {
  return request({
    url: `api/lov/getLovConfig/` + code,
    method: 'get'
  })
}

export function getLovs() {
  return request({
    url: 'api/lov/all',
    method: 'get'
  })
}
