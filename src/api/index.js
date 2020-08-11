/**
 * 通用的一些查询
 */
import request from '@/utils/request'

export default function quickQuery(code, params = {}) {
  return request({
    url: 'api/cm/quick/query/' + code,
    method: 'get',
    params
  })
}
