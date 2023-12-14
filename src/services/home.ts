import { http } from '@/utils/http'
/** 类型约束导入 */
import type { BannerItem, CateGoryMutliItem, HotMutliItem, GuessLikeItem } from '@/types/home'
import type { PageResult, PageParams } from '@/types/global'

/**
 * 首页广告的数据接口
 * @param distributionSite 广告区域展示位置，1 为首页（默认值），2 为商品分类页
 * @returns 返回请求回来的数据
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}
/**
 * 首页前台分类的数据接口
 * @returns
 */
export const getHomeCategoryMutliAPI = () => {
  return http<CateGoryMutliItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}
/**
 * 首页 —— 热门推荐数据接口请求
 * @returns
 */
export const getHomeHotMutliAPI = () => {
  return http<HotMutliItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}
/**
 * 猜你喜欢 —— 数据请求封装
 * @param page 页码 默认1
 * @param pageSize 一页数据大小 默认10
 * @returns
 */
export const getGuessLikeAPI = (data: PageParams) => {
  return http<PageResult<GuessLikeItem>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data,
  })
}
