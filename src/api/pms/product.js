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
//分组下的属性
export function attrGroupRelationList(data){
  return getRequest(pms + `/pms-attr-attrgroup-relation/attrInfo/${data}`)
}
//移除关联关系
export function delAttrGroupRelation(data){
  return postRequest(pms + `/pms-attr-attrgroup-relation/remove/relation`,data)
}
