import axios from 'axios'
//加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function request(config) {
    const instance = new axios.create({
        baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
        timeout: 5000
    });

    // 请求拦截器
    instance.interceptors.request.use(config => {
        //拦截后需要将拦截下来的请求数据返回发送
        config.headers.Authorization = window.sessionStorage.getItem('token')
        //在请求拦截器中展示进度条
        NProgress.start();
        return config;
    }, err => {
        console.log(err);
    })

    // 响应拦截器
    instance.interceptors.response.use(res => {
        // 拦截后需要将拦截下来处理成的结果返回
        //在响应拦截器中关闭进度条
        NProgress.done()
        return res.data
    }, err => {
        console.log(err)
    })

    return instance(config)
}