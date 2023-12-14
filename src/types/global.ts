/** 通用的分页数据类型约束 */
export type PageResult<T> = {
  counts: number
  pageSize: number
  pages: number
  page: number
  items: T[]
}

/** 通用分页变量类型约束 */
export type PageParams = {
  page?: number
  pageSize?: number
}

/** 通用商品类型 */
export type GoodsItem = {
  id: string
  name: string
  desc: string
  price: number
  picture: string
}
