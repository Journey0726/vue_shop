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
export function userStateChanged(url) {
  return request({
    method:'put',
    url,
  });
}
export function addUsers(username,password,email,mobile) {
  return request({
    method:'post',
    url:'/users',
    data:{
      username,password,email,mobile
    }
  });
}