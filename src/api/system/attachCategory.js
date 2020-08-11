import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/attachCategory',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/attachCategory',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/attachCategory',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/attachCategory',
    method: 'put',
    data
  })
}

export function getAttachmentById(params) {
  return request({
    url: 'api/sys/file/getByCategoryId',
    method: 'get',
    params
  })
}

export function getAttachmentCategoryTree(params) {
  return request({
    url: 'api/attachCategory/tree',
    method: 'get',
    params
  })
}

export function removeByFileId(fileId) {
  return request({
    url: 'api/sys/file/remove',
    method: 'delete',
    data: fileId
  })
}

export function multiRemoveByFileId(fileIds) {
  return request({
    url: 'api/sys/file/multiRemove',
    method: 'delete',
    data: fileIds
  })
}

export function getFileListBySkAndSt(params) {
  return request({
    url: 'api/sys/file/getBySKAndST',
    method: 'get',
    params
  })
}
