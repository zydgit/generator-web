import request from '@/utils/request'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function download(url, params) {
  return request({
    url: url,
    method: 'get',
    responseType: 'blob',
    params
  })
}
