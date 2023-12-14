import { http } from '@/utils/http'
import type { AddreddParams, GetAddressResult, GetAddressItem } from '@/types/member/address'
/**
 * 新增收货地址的接口请求
 * @param data 需要传递给后端的参数
 * @returns 返回成功的接口
 */
export const postAddMemberAddressAPI = (data: AddreddParams) => {
  return http({
    method: 'POST',
    url: '/member/address',
    data,
  })
}

/**
 * 获取收货地址列表
 * @returns 返回收获地址列表请求结果
 */
export const getMemberAddressListAPI = () => {
  return http<GetAddressResult>({
    method: 'GET',
    url: '/member/address',
  })
}

/**
 * 根据地址 id 获取地址的详情信息
 * @param id 地址 id
 * @returns 返回地址详情信息
 */
export const getMemberAddressDetailByIdAPI = (id: string) => {
  return http<GetAddressItem>({
    method: 'GET',
    url: `/member/address/${id}`,
  })
}

/**
 * 根据地址 id 调用修改收货地址 API
 * @param id 地址 id
 * @param data 需要更改的 form 表单
 * @returns 返回 id
 */
export const putMemberAddressEditByIdAPI = (id: string, data: AddreddParams) => {
  return http({
    method: 'PUT',
    url: `/member/address/${id}`,
    data,
  })
}

/**
 * 删除收货地址 item
 * @param id 地址 id
 * @returns 返回删除的地址 id
 */
export const deleteMemberAddressByIdAPI = (id: string) => {
  return http({
    method: 'DELETE',
    url: `/member/address/${id}`,
  })
}
