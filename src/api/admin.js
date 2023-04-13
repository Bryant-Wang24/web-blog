import axios from "axios";
import service from "./request";

const data = {
    username: "admin",
    password: "123456",
};

export function getToken() {
    return service.request({
        method: "post",
        url: "/admin/login",
        data,
    });
}

// 登录接口
export function login(params={username: "admin", password: "123456"}) {
    return service.request({
        method: "post",
        url: "/admin/login",
        data: params,
    });
}

// 注册接口
export function register(params){
    return service.request({
        method: "post",
        url: "/admin/register",
        data: params,
    });
}

// 请求网上公开的接口
export function getSentence() {
    return axios.get(
        "https://v1.hitokoto.cn/"
    );
}

// 获取用户信息
export function getUserInfo(code='') {
    return service.request({
        method: "get",
        url: "/admin/userInfo?code=" + code,
    });
}