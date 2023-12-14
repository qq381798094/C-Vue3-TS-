import { http } from '@/utils/http'
import type { CreateOrderResult, SubmitOrderDataParams } from '@/types/order/create'
import type {
  OrderDetailResult,
  LogisticsResult,
  OrderListResult,
  OrderListDataParams,
} from '@/types/order/order'

type BuyNowDataParams = {
  skuId: string
  count: string
  addressId?: string
}
/**
 * 填写订单-获取立即购买订单
 * @param data skuId | count | addressId
 * @returns 用户地址列表[]、商品集合[]、结算信息[]
 */
export const getBuyNowOrderPreAPI = (data: BuyNowDataParams) => {
  return http<CreateOrderResult>({
    method: 'GET',
    url: '/member/order/pre/now',
    data,
  })
}

/**
 * 提交订单
 * @param data 需要提交的订单信息对象
 * @returns 订单 id
 */
export const postMemberOrderAPI = (data: SubmitOrderDataParams) => {
  return http<{ id: string }>({
    method: 'POST',
    url: '/member/order',
    data,
  })
}

/**
 * 获取订单详情
 * @param id 订单 id
 * @returns
 */
export const getMemberOrderByIdAPI = (id: string) => {
  return http<OrderDetailResult>({
    method: 'GET',
    url: `/member/order/${id}`,
  })
}

/**
 * 模拟发货-内测版
 * @param id 订单id
 * @returns msg 提示语
 */
export const getMemberOrderConsignmentByIdAPI = (id: string) => {
  return http({
    method: 'GET',
    url: `/member/order/consignment/${id}`,
  })
}

/**
 * 确认收货
 * @param id 订单 id
 * @returns 订单详情对象
 */
export const putMemberOrderReceiptByIdAPI = (id: string) => {
  return http<OrderDetailResult>({
    method: 'PUT',
    url: `/member/order/${id}/receipt`,
  })
}

/**
 * 获取订单物流
 * @param id 订单编号
 * @returns
 */
export const getMemberOrderLogisticsByIdAPI = (id: string) => {
  return http<LogisticsResult>({
    method: 'GET',
    url: `/member/order/${id}/logistics`,
  })
}

/**
 * 删除订单
 * @param data 订单 id 集合
 * @returns msg 提示语
 */
type IdsParams = {
  ids: string[]
}
export const deleteMemberOrderAPI = (data: IdsParams) => {
  return http({
    method: 'DELETE',
    url: '/member/order',
    data,
  })
}

/**
 * 获取订单列表
 * @param data OrderListDataParams
 * @returns 订单列表信息
 */

export const getMemberOrderListByParamsAPI = (data: OrderListDataParams) => {
  return http<OrderListResult>({
    method: 'GET',
    url: '/member/order',
    data,
  })
}
