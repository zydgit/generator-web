import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/CodingRules',
    method: 'post',
    data
  })
}

export function del(codingRuleId) {
  return request({
    url: 'api/CodingRules/' + codingRuleId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/CodingRules',
    method: 'put',
    data
  })
}
