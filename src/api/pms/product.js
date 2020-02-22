import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { pms } from '../../config/env'

//**商品分类相关接口

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

//新增属性分组
export function callAddAttrGroup(data) {
  return postRequest(pms + `/pms-attr-group/add/`,data)
}
//删除属性分组
export function callDelAttrGroup(data) {
  return deleteRequest(pms + `/pms-attr-group/del/${data}`)
}

//新增属性
export function callAddAttr(data) {
  return postRequest(pms + `/pms-attr-attrgroup-relation/addAttr/`,data)
}

//**商品相关接口

//商品列表
export function loadProductList(current,size,data) {
  return getRequest(pms + `/pms-spu-info/page/${current}/${size}`,data)
}
