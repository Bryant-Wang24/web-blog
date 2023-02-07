import axios from 'axios'
import { getToken } from './admin'

//  创建axios实例
const service = axios.create({
    baseURL: '/api/v1',
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('token'),
    }
})

//  请求拦截器
service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        // 提示错误信息
        console.log(error)
        return Promise.reject(error)
    }
)

//  响应拦截器
service.interceptors.response.use(
    response => {
        //  对响应数据做点什么
        console.log('response: ', response)
        // 如果token过期或则为空，重新获取token
        if (response.data.code === 401 || response.data.code === 100) {
            getToken().then(res => {
                console.log('res: ', res)
                localStorage.setItem('token', res.data.token)
                axios.defaults.headers.common['Authorization'] = res.data.token
                // 刷新页面
                window.location.reload()
            })
        }
        return response.data
    },
    error => {
        //  对响应错误做点什么
        return Promise.reject(error)
    }
)

export default service
