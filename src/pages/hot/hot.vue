<script setup lang="ts">
/** API引入 */
import { defineProps, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getHotRecommendAPI } from '@/services/hot'
/** 类型引入 */
import type { SubTypesItem } from '@/types/hot'

/** API实例化 */
// 属性接收
const query = defineProps<{
    type: string
}>()
// onLoad
onLoad(() => {
    // 动态设置标题
    setTitleFunction()
    // 获取页面数据
    getHotRecommendData()
})

// 存储热门推荐标题和url
const hotMap = [
    { type: '1', title: '特惠推荐', url: '/hot/preference' },
    { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
    { type: '3', title: '一站买全', url: '/hot/oneStop' },
    { type: '4', title: '新鲜好物', url: '/hot/new' },
]

/** 接口数据请求 */
const bannerPicture = ref<string>('') // 保存热门推荐数据 —— 封面图
const subTypes = ref<(SubTypesItem & { finish?: boolean })[]>()
const getHotRecommendData = async () => {
    const res = await getHotRecommendAPI(setTitleFunction()!.url)
    bannerPicture.value = res.result.bannerPicture
    subTypes.value = res.result.subTypes
}

/** 脚本方法 */
// 动态设置标题
const setTitleFunction = () => {
    // 根据 type 类型查找数组
    const titleMap = hotMap.find((item) => item.type === query.type)
    // @ts-ignore
    uni.setNavigationBarTitle({ title: titleMap!.title })
    // 返回titleMap
    return titleMap
}

// 动态切换 tab 页
const currentIndex = ref<number>(0)
const changeTabPage = (index: number) => {
    currentIndex.value = index
}
// scroll-view 事件： 下拉到底部触发该事件
const onScrollToLower = async () => {
    // 获取当前选项
    const currentTab = subTypes.value![currentIndex.value]
    // 判断页码是否大于最大值
    if (currentTab.goodsItems.page > currentTab.goodsItems.pages) {
        // 设置结束标记，方便底部文字渲染
        currentTab.finish = true
        return uni.showToast({ icon: 'none', title: '没有更多数据啦' })
    }
    // 当前页码累加
    currentTab.goodsItems.page++
    // 调用 API 传参
    const res = await getHotRecommendAPI(setTitleFunction()!.url, {
        subType: currentTab.id,
        page: currentTab.goodsItems.page,
        pageSize: currentTab.goodsItems.pageSize,
    })
    // 当前数组追加
    const newItem = res.result.subTypes[currentIndex.value].goodsItems.items
    currentTab.goodsItems.items.push(...newItem)
}
</script>

<template>
    <view class="viewport">
        <!-- 封面推荐图 -->
        <view class="cover">
            <image :src="bannerPicture" />
        </view>
        <!-- 推荐选项 -->
        <view class="tabs">
            <text v-for="(tab, index) in subTypes" :key="tab.id" class="text" :class="{ active: index === currentIndex }"
                @tap="changeTabPage(index)">{{ tab.title }}</text>
        </view>
        <!-- 推荐列表 -->
        <scroll-view v-for="(tab, index) in subTypes" :key="tab.id" v-show="index === currentIndex" scroll-y
            class="scroll-view" @scrolltolower="onScrollToLower">
            <view class="goods">
                <navigator hover-class="none" class="navigator" v-for="goods in tab.goodsItems.items" :key="goods.id"
                    :url="`/pages/goods/goods?id=`">
                    <image class="thumb" :src="goods.picture" />
                    <view class="name ellipsis">{{ goods.name }}</view>
                    <view class="price">
                        <text class="symbol">￥</text>
                        <text class="number">{{ goods.price }}</text>
                    </view>
                </navigator>
            </view>
            <view class="loading-text">{{ tab.finish ? '全部数据' : '正在加载...' }}</view>
        </scroll-view>
    </view>
</template>

<style lang="scss">
page {
    height: 100%;
    background: #f4f4f4;
}

.viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 100rpx 0 0;
    position: relative;
}

.cover {
    width: 750rpx;
    height: 225rpx;
    border-radius: 0 0 40rpx 40rpx;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
}

.scroll-view {
    flex: 1;
}

.tabs {
    display: flex;
    justify-content: space-evenly;
    height: 100rpx;
    line-height: 90rpx;
    margin: 0 20rpx;
    font-size: 28rpx;
    border-radius: 10rpx;
    box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
    color: #333;
    background-color: #fff;
    position: relative;
    z-index: 9;

    .text {
        margin: 0 20rpx;
        position: relative;
    }

    .active {
        &::after {
            content: '';
            width: 40rpx;
            height: 4rpx;
            transform: translate(-50%);
            background-color: #27ba9b;
            position: absolute;
            left: 50%;
            bottom: 24rpx;
        }
    }
}

.goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20rpx 20rpx;

    .navigator {
        width: 345rpx;
        padding: 20rpx;
        margin-top: 20rpx;
        border-radius: 10rpx;
        background-color: #fff;
    }

    .thumb {
        width: 305rpx;
        height: 305rpx;
    }

    .name {
        height: 88rpx;
        font-size: 26rpx;
    }

    .price {
        line-height: 1;
        color: #cf4444;
        font-size: 30rpx;
    }

    .symbol {
        font-size: 70%;
    }

    .decimal {
        font-size: 70%;
    }
}

.loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0 50rpx;
}
</style>
