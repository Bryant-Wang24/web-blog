import service from "./request";

// 获取文章列表
export function getArticleList(page = 1,pageSize = 20,categories = '') {
    return service.request({
        method: "get",
        url: `/articles?page=${page}&pageSize=${pageSize}&categories=${categories}`,
    });
}

// 获取文章详情
export function getArticleDetail(id,from = 'web') {
    return service.request({
        method: "get",
        url: `/articles/${id}/edit?type=${from}`,
    });
}