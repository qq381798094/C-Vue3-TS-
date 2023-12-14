/** 首页——广告轮播数据类型约束 */
export type BannerItem = {
  hrefUrl: string
  id: string
  imgUrl: string
  type: number
}

/** 前台类目类型约束 */
export type CateGoryMutliItem = {
  id: string
  name: string
  icon: string
}

/*** 首页 —— 热门推荐类型约束 */
export type HotMutliItem = {
  id: string
  alt: string
  pictures: string[]
  target: string
  title: string
  type: string
}

/** 首页 —— 猜你喜欢类型约束 */
export type GuessLikeItem = {
  id: string
  name: string
  desc: string
  price: number
  picture: string
  discount: number
  orderNum: number
}
