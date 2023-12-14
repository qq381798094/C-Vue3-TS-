import { http } from '@/utils/http'

/**
 * 获取微信支付参数
 * @param data orderId 订单编号
 * @returns 返回支付信息对象
 */
type WxPayDataParams = {
  orderId: string
}
export const getWxPayAPI = (data: WxPayDataParams) => {
  return http<WechatMiniprogram.RequestPaymentOption>({
    method: 'GET',
    url: '/pay/wxPay/miniPay',
    data,
  })
}

/**
 * 模拟支付-内测版
 * @param data orderId 订单编号
 * @returns 返回支付信息对象
 */
export const getPayMockAPI = (data: WxPayDataParams) => {
  return http({
    method: 'GET',
    url: '/pay/mock',
    data,
  })
}
