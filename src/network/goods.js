import { request } from './request.js'

export function getHomeCategoryInfo(type, pagenum, pagesize) {
  return request({
    method: 'get',
    url: '/categories',
    params: {
      type,
      pagenum,
      pagesize
    }
  });
}
export function addCategoryInfo(cat_pid, cat_name, cat_level) {
  return request({
    method: 'post',
    url: '/categories',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  });
}
export function queryCateById(id) {
  return request({
    method: 'get',
    url: '/categories/'+id,
  });
}
export function editCate(id,cat_name) {
  return request({
    method: 'put',
    url: '/categories/'+id,
    data:{
      cat_name
    }
  });
}
export function deleteCateById(id) {
  return request({
    method: 'delete',
    url: '/categories/'+id,
  });
}
export function cateParamsList(id,sel) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params:{
      sel
    }
  });
}
export function AddCateParamsList(id,attr_sel,attr_name) {
  return request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data:{
      attr_sel,attr_name
    }
  });
}
export function deleteParamsById(id,attrid) {
  return request({
    method: 'delete',
    url: `/categories/${id}/attributes/${attrid}`
  });
}
export function queryParamsById(id,attrid) {
  return request({
    method: 'get',
    url: `/categories/${id}/attributes/${attrid}`
  });
}
export function editParamsById(id,attrid,attr_name,attr_sel,attr_vals) {
  return request({
    method: 'put',
    url: `/categories/${id}/attributes/${attrid}`,
    data:{
      attr_name,attr_sel,attr_vals
    }
  });
}
export function getGoodsList(query,pagenum,pagesize) {
  return request({
    method: 'get',
    url: 'goods',
    params:{
      query,pagenum,pagesize
    }
  });
}
export function deleteGoodsById(id) {
  return request({
    method: 'delete',
    url: `goods/${id}`
  });
}
export function getGoodsById(id) {
  return request({
    method: 'get',
    url: `goods/${id}`
  });
}
export function addGoods(goods_name,goods_cat,goods_price,goods_number,goods_weight,goods_introduce,pics,attrs) {
  return request({
    method: 'post',
    url: 'goods',
    data:{
      goods_name,goods_cat,goods_price,goods_number,goods_weight,goods_introduce,pics,attrs
    }
  });
}
export function editGoods(id,goods_name,goods_price,goods_number,goods_weight,goods_introduce) {
  return request({
    method: 'put',
    url: `goods/${id}`,
    data:{
      goods_name,goods_price,goods_number,goods_weight,goods_introduce
    }
  });
}