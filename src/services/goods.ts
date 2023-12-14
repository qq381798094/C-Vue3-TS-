import { http } from '@/utils/http'
import type { GoodsInfoResult } from '@/types/goods'

/**
 * 通过商品id请求商品详情信息请求
 * @param id  goods->id
 * @returns 商品详情数据
 */
export const getGoodsInfoByIdAPI = (id: string) => {
  return http<GoodsInfoResult>({
    method: 'GET',
    url: '/goods',
    data: {
      id,
    },
  })
}
