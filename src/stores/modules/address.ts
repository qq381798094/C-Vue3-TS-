import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GetAddressItem } from '@/types/member/address'

// 定义 store
export const useAddressStore = defineStore('address', () => {
  // 定制选中收货地址的临时变量
  const selectedAddress = ref<GetAddressItem>()
  // 切换选中的收货地址变量值
  const changeSelectedAddress = (val: GetAddressItem) => {
    selectedAddress.value = val
  }
  return {
    selectedAddress,
    changeSelectedAddress,
  }
})
