import service from "./request";

// 获取分类列表
export function getCategoryList() {
    return service.request({
        method: "get",
        url: "/categories",
    });
}