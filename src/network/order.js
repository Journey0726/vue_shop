import { request } from './request.js'

export function getOrdersInfo(query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr) {
    return request({
        method: 'get',
        url: '/orders',
        params: {
            query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr
        }
    });
}
export function getLocalInfo(id) {
    return request({
        method: 'get',
        url: `/kuaidi/${id}`,
    });
}