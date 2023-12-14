/** 商品详情页面类型约束 */

// SellItem
export type SellItem = {
  id: string
  picture: string
  name: string
  price: string
  desc: string
  orderNum: number
  discount: null
}

// DetailItem
export type DetailItem = {
  name: string
  value: string
}

// CategoriesItem
export type CateParentObj = {
  id: string
  name: string
  layer: number
  parent: null
}
export type CategoriesItem = {
  id: string
  name: string
  layer: number
  parent: CateParentObj | null
}

// SkusItem
export type SkusSpecsItem = {
  name: string
  valueName: string
}
export type SkusItem = {
  id: string
  skuCode: string
  price: string
  oldPrice: string
  inventory: number
  picture?: string
  specs: SkusSpecsItem[]
}

// SpecsItem
export type SpecsValuesItem = {
  name: string
  picture: string | null
  available?: boolean
  desc: string
}
export type SpecsItem = {
  id: string
  name: string
  values: SpecsValuesItem[]
}

export type GoodsInfoResult = {
  id: string
  name: string
  spuCode: string
  desc: string
  price: string
  oldPrice: string
  discount: number
  inventory: number
  brand: {
    id: string
    name: string
    nameEn: string
    picture: string
    logo: string
    type: null
    desc: null
    place: null
  }
  salesCount: number
  commentCount: number
  collectCount: number
  mainVideos: string[]
  videoScale: number
  mainPictures: string[]
  specs: SpecsItem[]
  skus: SkusItem[]
  categories: CategoriesItem[]
  details: {
    properties: DetailItem[]
    pictures: string[]
  }
  isPreSale: boolean
  isCollect: null
  recommends: null
  userAddresses: null
  evaluationInfo: null
  similarProducts: SellItem[]
  hotByDay: SellItem[]
}
