<template>
  <!-- 首页头部导航栏 -->
  <custom-navbar />
  <scroll-view class="scroll-view" scroll-y @scrolltolower="onScrollToLower" refresher-enabled
    :refresher-triggered="isTrigger" @refresherrefresh="refreshEventOn">
    <Skeleton v-if="isLoading" />
    <template v-else>
      <!-- 轮播图 -->
      <XtxSwiper :bannerList="bannerList" />
      <!-- 前台类目 -->
      <category-panel :categoryList="categoryMutliList" />
      <!-- 热门推荐 -->
      <hot-panel :hotList="hotMutliList" />
      <!-- 猜你喜欢 -->
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
/** vue API 导入 */
import { ref } from 'vue'
/** Hooks 导入 */
import { onLoad } from '@dcloudio/uni-app'
/** 页面导入 */
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import Skeleton from './components/Skeleton.vue'
/** 接口导入 */
import { getHomeBannerAPI, getHomeCategoryMutliAPI, getHomeHotMutliAPI } from '@/services/home'
/** 类型约束导入 */
import type { BannerItem, CateGoryMutliItem, HotMutliItem } from '@/types/home'
/** 自定义 hooks 导入 */
import { useGetGuessMoreList } from '@/composables'

/** 接口数据获取 */
// 获取广告接口数据
const bannerList = ref<BannerItem[]>([]) //存储广告接口数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
// 获取前台类目数据
const categoryMutliList = ref<CateGoryMutliItem[]>([]) //存储前台类目数据
const getCategoryMutliData = async () => {
  const res = await getHomeCategoryMutliAPI()
  categoryMutliList.value = res.result
}
// 获取首页热门推荐数据
const hotMutliList = ref<HotMutliItem[]>([])
const getHotMutliData = async () => {
  const res = await getHomeHotMutliAPI()
  hotMutliList.value = res.result
}

/** 脚本方法 */
let isLoading = ref<boolean>(false) // flag数据：骨架屏和首页数据的显示切换
// 控制骨架屏和首页数据的显示切换
const changeLoadingFunction = () => {
  isLoading.value = !isLoading.value
}

/** 生命周期 Hooks —— 小程序的 */
onLoad(async () => {
  changeLoadingFunction()
  // 调用广告接口数据获取接口 && 调用前台类目数据 && 调用首页热门推荐数据
  await Promise.all([getHomeBannerData(), getCategoryMutliData(), getHotMutliData()])
  changeLoadingFunction()
})

/** 底部触底刷新数据逻辑 */
const { guessRef, onScrollToLower } = useGetGuessMoreList()

// 自定义下拉刷新被触发
let isTrigger = ref<boolean>(false) // 控制下拉刷新动画的开始与结束
const refreshEventOn = async () => {
  isTrigger.value = true
  // 首先对推荐组件数据进行初始化
  guessRef.value?.resetData()
  // 重新加载首页的所有数据
  await Promise.all([
    getHomeBannerData(),
    getCategoryMutliData(),
    getHotMutliData(),
    guessRef.value?.getMore(),
  ])
  // 关闭动画
  isTrigger.value = false
}
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
