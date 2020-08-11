import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/CodingRuleDetails',
    method: 'post',
    data
  })
}

export function del(codingRuleLineId) {
  return request({
    url: 'api/CodingRuleDetails/' + codingRuleLineId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/CodingRuleDetails',
    method: 'put',
    data
  })
}
