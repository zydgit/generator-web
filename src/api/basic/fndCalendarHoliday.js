import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/fndCalendarHoliday',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/fndCalendarHoliday',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/fndCalendarHoliday',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/fndCalendarHoliday',
    method: 'put',
    data
  })
}
