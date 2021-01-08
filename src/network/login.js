import {request} from './request.js'

export function getLoginInfo(username,password) {
  return request({
    method:'post',
    url:'/login',
    data:{
        username,
        password
    }
  });
}
