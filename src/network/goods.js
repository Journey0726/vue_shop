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
