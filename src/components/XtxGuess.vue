<script setup lang="ts">
/** API */
import { onMounted, ref, defineExpose } from 'vue'
/** 接口导入 */
import { getGuessLikeAPI } from '@/services/home'
/** 类型导入 */
import type { GuessLikeItem } from '@/types/home'
import type { PageParams } from '@/types/global'

/** 数据获取 */
// 获取猜你喜欢的数据
// 初始化页面数据、页码
const pageParams: Required<PageParams> = {
    page: 1,
    pageSize: 10,
}
let finish = ref<boolean>(false) // 数据是否加载完成的 flag
const guessLikeList = ref<GuessLikeItem[]>([]) // 存储列表数据
// 异步获取数据
const getGuessLikeData = async () => {
    // 检查当前页码是否越过总页码
    if (finish.value) {
        return uni.showToast({ icon: 'none', title: '暂无更多数据!' })
    }
    // 异步获取数据
    const res = await getGuessLikeAPI(pageParams)
    // 延时加载
    setTimeout(() => {
        // 数组追加
        guessLikeList.value.push(...res.result.items)
        // 判断是否越过总页码
        if (pageParams.page < res.result.pages) {
            // 页码++
            pageParams.page++
        } else {
            finish.value = true
        }
    }, 500)
}
// 下拉刷新重置数据
const resetData = () => {
    // 清空数组
    guessLikeList.value = []
    // 页码归1
    pageParams.page = 1
    // 加载 flag 还原
    finish.value = false
}

/** API实例化 */
// 挂载 Hooks
onMounted(() => {
    // 因为是通用组件，所以选择在 DOM 树被挂载后才接收数据请求，避免不必要的性能浪费
    // 获取猜你喜欢数据
    getGuessLikeData()
})

// 对外暴露子组件的方法
defineExpose({
    resetData,
    getMore: getGuessLikeData,
})
</script>

<template>
    <!-- 猜你喜欢 -->
    <view class="caption">
        <text class="text">猜你喜欢</text>
    </view>
    <view class="guess">
        <navigator class="guess-item" v-for="guess in guessLikeList" :key="guess.id"
            :url="`/pages/goods/goods?id=${guess.id}`">
            <image class="image" mode="aspectFill" :src="guess.picture" />
            <view class="name">{{ guess.name }}</view>
            <view class="price">
                <text class="small">￥</text>
                <text>{{ guess.price }}</text>
            </view>
        </navigator>
    </view>
    <view class="loading-text">{{ finish ? '全部加载' : '正在加载...' }}</view>
</template>

<style lang="scss">
// ?
:host {
    display: block;
}

/** 分类标题 */
.caption {
    display: flex;
    justify-content: center;
    line-height: 1;
    padding: 36rpx 0 40rpx;
    font-size: 32rpx;
    color: #262626;

    .text {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 28rpx 0 30rpx;

        &::before,
        &::after {
            content: '';
            width: 20rpx;
            height: 20rpx;
            background-image: url(@/static/images/bubble.png);
            background-size: contain;
            margin: 0 10rpx;
        }
    }
}

// 猜你喜欢
.guess {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20rpx;

    .guess-item {
        width: 345rpx;
        padding: 24rpx 20rpx 20rpx;
        margin-bottom: 20rpx;
        border-radius: 10rpx;
        overflow: hidden;
        background-color: #fff;
    }

    .image {
        width: 304rpx;
        height: 304rpx;
    }

    .name {
        height: 75rpx;
        margin: 10rpx 0;
        font-size: 26rpx;
        color: #262626;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .price {
        line-height: 1;
        padding-top: 4rpx;
        color: #cf4444;
        font-size: 26rpx;
    }

    .small {
        font-size: 80%;
    }
}

// 加载提示文字
.loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
}
</style>
