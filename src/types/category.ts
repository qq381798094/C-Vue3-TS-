import type { GoodsItem } from '@/types/global'

/** 列表分类 */
// 二级分类约束
export type CategoryChildren = {
  id: string
  name: string
  picture: string
  parentId: null
  parentName: null
  categories: null
  brands: null
  saleProperties: null
  goods: (GoodsItem & { discount: null; orderNum: number })[]
}

// 一级分类约束
export type CategoryResult = {
  id: string
  name: string
  picture: string
  imageBanners: string[]
  children: CategoryChildren[]
}
