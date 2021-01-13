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
export function queryUserInfo(id) {
  return request({
    method:'get',
    url:'/users/'+id
  });
}
export function changeUserInfo(id,email,mobile) {
  return request({
    method:'put',
    url:'/users/'+id,
    data:{
      email,
      mobile
    }
  });
}
export function deleteUserInfo(id) {
  return request({
    method:'delete',
    url:'/users/'+id
  });
}
export function getAllRoles() {
  return request({
    method:'get',
    url:'/roles'
  });
}
export function saveRolesInfo(id,rid) {
  return request({
    method:'put',
    url:`/users/${id}/role`,
    data:{
      rid
    }
  });
}