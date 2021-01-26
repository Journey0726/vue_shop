import { request } from './request.js'
export function getChartData() {
    return request({
        method: 'get',
        url: '/reports/type/1'
    });
}