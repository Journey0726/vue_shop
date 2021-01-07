import {request} from './request.js'

export function getLoginInfo(username,password) {
  return request({
    method:'get',
    url:'/login',
    params:{
        username,
        password
    }
  });
}
