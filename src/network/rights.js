import {request} from './request.js'

export function getRightsInfo(type) {
  return request({
    method:'get',
    url:'/rights'+type,
  });
}
export function getRolesInfo() {
  return request({
    method:'get',
    url:'/roles',
  });
}
export function addRoles(roleName,roleDesc) {
  return request({
    method:'post',
    url:'/roles',
    data:{
      roleName,
      roleDesc
    }
  });
}
export function searchRolesInfo(id) {
  return request({
    method:'get',
    url:'/roles/'+id,
  });
}
export function changeRolesInfo(id,roleName,roleDesc) {
  return request({
    method:'put',
    url:'/roles/'+id,
    data:{
      roleName,
      roleDesc
    }
  });
}
export function deleteRolesInfo(id) {
  return request({
    method:'delete',
    url:'/roles/'+id,
  });
}