/** 订单详情信息类型约束 */
export type PropertiesItem = {
  propertyMainName: string
  propertyValueName: string
}
export type SkusItem = {
  id: string
  spuId: string
  name: string
  quantity: string
  image: string
  realPay: number
  curPrice: number
  properties: PropertiesItem[]
  attrsText: string
}
export type OrderDetailResult = {
  id: string
  createTime: string
  payType: number
  orderState: number
  payLatestTime: number
  countdown: number
  postFee: string
  payMoney: string
  payChannel: number
  totalMoney: string
  totalNum: string
  deliveryTimeType: number
  receiverContact: string
  receiverMobile: string
  receiverAddress: string
  payTime: string
  consignTime: string
  arrivalEstimatedTime: string
  endTime: string
  closeTime: string
  evaluationTime: string
  skus: (SkusItem & { totalMoney: number })[]
}

/**
 * 订单物流的类型约束
 */
export type LogisticsListItem = {
  id: string
  text: string
  time: string
}
export type LogisticsResult = {
  picture: string
  count: number
  company: {
    name: string
    number: string
    tel: string
  }
  list: LogisticsListItem[]
}

/**
 * 订单列表类型约束
 * */
export type OrderListDataParams = {
  page?: number
  pageSize?: number
  orderState?: number
}
export type OrderListItem = {
  id: string
  createTime: string
  payType: number
  orderState: number
  payLatestTime: string
  countdown: number
  postFee: number
  payMoney: number
  totalMoney: number
  totalNum: string
  skus: SkusItem[]
}
export type OrderListResult = {
  counts: number
  pageSize: string
  pages: string
  page: string
  items: OrderListItem[]
}
