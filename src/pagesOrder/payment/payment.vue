<script setup lang="ts">
/** API */
import { defineProps } from 'vue'
/** 钩子导入 */
import { useGetGuessMoreList } from '@/composables'

/** API 实例化 */
const query = defineProps<{
    id: string
}>()

/** 猜你喜欢环节 */
const { guessRef, onScrollToLower } = useGetGuessMoreList()
</script>

<template>
    <scroll-view class="viewport" scroll-y @scrolltolower="onScrollToLower">
        <!-- 订单状态 -->
        <view class="overview">
            <view class="status icon-checked">支付成功</view>
            <view class="buttons">
                <navigator class="button navigator" hover-class="none" url="/pages/index/index" open-type="switchTab">返回首页
                </navigator>
                <navigator class="button navigator" hover-class="none" :url="`/pagesOrder/detail/detail?id=${query.id}`"
                    open-type="redirect">查看订单</navigator>
            </view>
        </view>

        <!-- 猜你喜欢 -->
        <XtxGuess ref="guessRef" />
    </scroll-view>
</template>

<style lang="scss">
page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.viewport {
    background-color: #f7f7f8;
}

.overview {
    line-height: 1;
    padding: 50rpx 0;
    color: #fff;
    background-color: #29ba9b;

    .status {
        font-size: 36rpx;
        font-weight: 500;
        text-align: center;

        &::before {
            display: block;
            font-size: 110rpx;
            margin-bottom: 20rpx;
        }
    }

    .buttons {
        height: 60rpx;
        line-height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 60rpx;
    }

    .button {
        text-align: center;
        margin: 0 10rpx;
        font-size: 28rpx;
        color: #fff;

        &:first-child {
            width: 200rpx;
            border-radius: 64rpx;
            border: 1rpx solid #fff;
        }
    }
}
</style>
