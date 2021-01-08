import {request} from './request.js'

export function getHomeAsideInfo() {
  return request({
    method:'get',
    url:'/menus',
  });
}
