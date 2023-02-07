import service from "./request";

// 获取文章列表
export function getArticleList() {
    return service.request({
        method: "get",
        url: "/articles",
    });
}

// 获取文章详情
export function getArticleDetail(id) {
    return service.request({
        method: "get",
        url: `/articles/${id}/edit`,
    });
}