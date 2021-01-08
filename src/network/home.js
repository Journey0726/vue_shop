import {request} from './request.js'

export function getHomeAsideInfo() {
  return request({
    method:'get',
    url:'/menus',
  });
}
export function getUsersInfo(query , pagenum , pagesize) {
  return request({
    method:'get',
    url:'/users',
    params:{
      query,pagenum,pagesize
    }
  });
}
