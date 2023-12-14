import { http } from '@/utils/http'
import type { CartResult } from '@/types/member/cart'

/**
 * 添加商品进入购物车
 * @param data id 以及 商品数量
 * @returns
 */
type PostCart = {
  skuId: string
  count: number
}
export const postMemberCartAPI = (data: PostCart) => {
  return http({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}

/**
 * 获取购物车列表
 * @returns 返回购物车列表数据
 */
export const getMemberCartAPI = () => {
  return http<CartResult>({
    method: 'GET',
    url: '/member/cart',
  })
}

/**
 * 删除/清空购物车
 * @param data 请求参数体，内容为 skuId的集合【数组】
 * @returns msg 【提示语句】
 */
export const deleteMemberCartAPI = (data: { ids: string[] }) => {
  return http({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })
}

/**
 * 修改购物车单品
 * @param skuId
 * @param data selected:选中状态 || count:商品数量
 * @returns 返回商品详情对象
 */
type DataParams = {
  selected?: boolean
  count?: number
}
export const putMemberCartBySkuIdAPI = (skuId: string, data: DataParams) => {
  return http({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data,
  })
}

/**
 * 购物车全选/取消全选
 * @param data selected:是否选中
 * @returns null
 */
export const putMemberCartSelectedAllAPI = (data: { selected: boolean }) => {
  return http({
    method: 'PUT',
    url: '/member/cart/selected',
    data,
  })
}
