import { http } from '@/utils/http'

import type { CategoryResult } from '@/types/category'

/**
 * 分类列表的请求地址
 * @returns
 */
export const getCategoryTopAPI = () => {
  return http<CategoryResult[]>({
    method: 'GET',
    url: '/category/top',
  })
}
