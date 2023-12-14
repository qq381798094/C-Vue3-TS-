import { http } from '@/utils/http'
import type { CreateOrderResult } from '@/types/order/create'

/**
 * 填写订单-获取预付订单
 * @returns 用户地址列表[]、商品集合[]、结算信息[]
 */
export const getMemberOrderAPI = () => {
  return http<CreateOrderResult>({
    method: 'GET',
    url: '/member/order/pre',
  })
}
