/**
 * 通用类型约束
 */

export type IsDefault = 1 | 0
/**
 * 获取地址列表类型约束
 */
export type GetAddressItem = {
  id: string
  receiver: string
  contact: string
  provinceCode: string
  cityCode: string
  countyCode: string
  fullLocation: string
  address: string
  isDefault: IsDefault
}
export type GetAddressResult = GetAddressItem[]

/**
 * 新增地址请求参数的类型约束
 */
export type AddreddParams = {
  receiver: string
  contact: string
  provinceCode: string
  cityCode: string
  countyCode: string
  address: string
  isDefault: IsDefault
}
