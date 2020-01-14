import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { pms } from '../../config/env'

// 分类树菜单
export function catagoryTree() {
  return getRequest(pms + `/pms-category/tree`)
}
//分类下分组查询，根据分类id
export function attrGroupPage(data) {
  return getRequest(pms + `/pms-attr-group/page/${data}`)
}

// 获取用户列表数据
export function getUserListData(data) {
  return postRequest(pms + '/account/all', data)
}

/* 导出全部数据*/
export function getAll() {
  return postRequest(pms + '/account/all')
}

// 编辑用户
export function editUser(data) {
  return postRequest(pms + '/account/edit', data)
}

// 新增用户
export function addUser(params) {
  return postRequest(pms + '/account/add', params)
}

/* 禁用，启用用户*/
export function disableUser(param) {
  return postRequest(pms + '/account/disable', param)
}

// 删除
export function delUser(id) {
  return deleteRequest(pms + '/account/' + id)
}
