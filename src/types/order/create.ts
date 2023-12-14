/** 获取订单信息类型约束 */
// 用户地址约束
export type UserAddressesItem = {
  id: string
  provinceCode: string
  cityCode: string
  countyCode: string
  address: string
  isDefault: number
  receiver: string
  contact: string
  fullLocation: string
  postalCode: string
}
// 商品集合约束
export type GoodsItem = {
  id: string
  name: string
  picture: string
  count: number
  skuId: string
  attrsText: string
  price: number
  payPrice: number
  totalPrice: number
  totalPayPrice: number
}
// 结算信息类型约束
export type SummaryItem = {
  goodsCount: number
  totalPrice: number
  totalPayPrice: number
  postFee: number
  discountPrice: number
}
// 接口结果返回类型约束
export type CreateOrderResult = {
  userAddresses: UserAddressesItem[]
  goods: GoodsItem[]
  summary: SummaryItem
}

/** 提交订单需要的参数类型约束 */
export type GoodsEasyItem = {
  skuId: string
  count: number
}
export type SubmitOrderDataParams = {
  goods: GoodsEasyItem[]
  addressId: string
  deliveryTimeType: number
  buyerMessage: string
  payType: number
  payChannel: number
}
