import service from "./request";

// 获取标签列表
export function getTagList(page = 1,pageSize = 9999) {
    return service.request({
        method: "get",
        url: `/tags?page=${page}&pageSize=${pageSize}`,
    });
}