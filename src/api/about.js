import service from "./request";

// 获取个人信息
export function getAbout() {
    return service.request({
        method: "get",
        url: `/about`,
    });
}