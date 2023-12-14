import type { PageResult, GoodsItem } from './global'

/** 热门推荐商品数据类型约束 */
export type SubTypesItem = {
  id: string
  title: string
  goodsItems: PageResult<GoodsItem>
}
export type HotRecommendResult = {
  title: string
  id: string
  bannerPicture: string
  subTypes: SubTypesItem[]
}
