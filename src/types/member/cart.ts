/**
 * 获取购物车列表类型约束
 */
export type CartItem = {
  id: string
  name: string
  picture: string
  price: number
  count: number
  skuId: string
  attrsText: string
  selected: boolean
  nowPrice: number
  stock: number
  isCollect: boolean
  discount: number
  isEffective: boolean
}
export type CartResult = CartItem[]
