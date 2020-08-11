import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/CodingRuleValues',
    method: 'post',
    data
  })
}

export function del(codingRuleValuesId) {
  return request({
    url: 'api/CodingRuleValues/' + codingRuleValuesId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/CodingRuleValues',
    method: 'put',
    data
  })
}
