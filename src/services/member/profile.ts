import { http } from '@/utils/http'
import type { TProfileResult, TProfileParams } from '@/types/member/profile'

/**
 * 获取个人信息 API
 * @returns 返回个人信息的数据对象
 */
export const getMemberProfileAPI = () => {
  return http<TProfileResult>({
    method: 'GET',
    url: '/member/profile',
  })
}

/**
 * 修改个人信息 API
 * @param data
 * @returns
 */
type UpdateProfile = TProfileResult & { token: string }
export const putMemberProfileAPI = (data: TProfileParams) => {
  return http<UpdateProfile>({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
}
