import request from '@/utils/request'

// 新增成品
export function createProduct(data) {
    return request({
        url: '/pnw/products/',
        method: 'post',
        data
    })
}

// 删除成品 硬删除
export function deleteProduct(id) {
    return request({
        url: `/pnw/products/${id}/`,
        method: 'delete'
    })
}

// 批量删除成品 硬删除
export function deleteProducts(ids) {
    return request({
        url: '/pnw/products/',
        method: 'delete',
        data: { 'ids': ids }
    })
}


// 修改成品
export function updateProduct(id, data) {
    return request({
        url: `/pnw/products/${id}/`,
        method: 'put',
        data
    })
}

// 成品数据部分更新
export function updateProduct2(id, data) {
    return request({
        url: `/pnw/products/${id}/`,
        method: 'patch',
        data
    })
}

// 获取成品列表
export function getProducts(data) {
    return request({
        url: '/pnw/products/',
        method: 'get',
        params: data
    })
}

// 获取成品详情
export function getProduct(id) {
    return request({
        url: `/pnw/products/${id}/`,
        method: 'get'
    })
}
