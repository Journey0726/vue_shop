import axios from 'axios'
export function request(config) {
    const instance = new axios.create({
        baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
        timeout: 5000
    });

    // 请求拦截器
    instance.interceptors.request.use(config => {
        //拦截后需要将拦截下来的请求数据返回发送
        return config;
    }, err => {
        console.log(err);
    })

    // 响应拦截器
    instance.interceptors.response.use(res => {
        // 拦截后需要将拦截下来处理成的结果返回
        return res.data
    }, err => {
        console.log(err)
    })

    return instance(config)
}