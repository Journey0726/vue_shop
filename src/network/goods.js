import {request} from './request.js'

export function getHomeCategoryInfo(type,pagenum,pagesize) {
  return request({
    method:'get',
    url:'/categories',
    params:{
        type,
        pagenum,
        pagesize
    }
  });
}