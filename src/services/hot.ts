import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotRecommendResult } from '@/types/hot'

/** 热门推荐数据请求 */
type TDataParams = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: TDataParams) => {
  return http<HotRecommendResult>({
    method: 'GET',
    url,
    data,
  })
}
