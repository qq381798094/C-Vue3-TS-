import { http } from '@/utils/http'

import type { LoginResult } from '@/types/login'

type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}
/**
 * 登录的 POST 请求接口
 * @param data
 * @returns 请求结果
 */
export const postLoginAPI = (data: LoginParams) => {
  return http({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}
/**
 * 小程序登录【模拟手机号码】【内测版】
 * @param phoneNumber
 * @returns
 */
export const postSimpleLoginAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}
