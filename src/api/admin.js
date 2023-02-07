import service from "./request";

const data = {
    userName: "admin",
    password: "123456",
};

export function getToken() {
    return service.request({
        method: "post",
        url: "/admin/login",
        data,
    });
}