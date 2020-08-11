import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/Message',
    method: 'post',
    data
  })
}

export function del(messageId) {
  return request({
    url: 'api/Message/' + messageId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/Message',
    method: 'put',
    data
  })
}
