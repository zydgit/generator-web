import request from '@/utils/request'

export function login(username, password, code, uuid, allocationId) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid,
      allocationId
    }
  })
}

export function loginRole(allocationId) {
  return request({
    url: 'auth/loginRole',
    method: 'post',
    data: {
      allocationId
    }
  })
}

export function getUserIndentify(params) {
  return request({
    url: 'auth/user/indentify',
    method: 'get',
    params
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'auth/vCode',
    method: 'get'
  })
}
