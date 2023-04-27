import service from "./request";

// 获取文章列表
export function getArticleList(page = 1,pageSize = 20,categories = '',tags = '') {
    return service.request({
        method: "get",
        url: `/articles?page=${page}&pageSize=${pageSize}&status=1&categories=${categories}&tags=${tags}`,
    });
}

// 获取文章详情
export function getArticleDetail(id,from = 'web') {
    return service.request({
        method: "get",
        url: `/articles/${id}/edit?type=${from}`,
    });
}

// 点赞
export function postArticleLike({userId,articleId}) {
    return service.request({
        method: "post",
        url: `/articles/like`,
        data: {
            userId,
            articleId
        }
    });
}

// 收藏
export function postArticleCollect({userId,articleId}) {
    return service.request({
        method: "post",
        url: `/articles/collect`,
        data: {
            userId,
            articleId
        }
    });
}