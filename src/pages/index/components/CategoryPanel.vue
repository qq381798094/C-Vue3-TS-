<script setup lang="ts">
/** API  */
import { defineProps } from 'vue'
/** 类型导入 */
import type { CateGoryMutliItem } from '@/types/home'
/** API 实例化 */
const props = defineProps<{
    categoryList: CateGoryMutliItem[]
}>()
</script>

<template>
    <view class="category">
        <navigator class="category-item" hover-class="none" url="/pages/index/index" v-for="cate in categoryList"
            :key="cate.id">
            <image class="icon" :src="cate.icon" />
            <text class="text">{{ cate.name }}</text>
        </navigator>
    </view>
</template>

<style lang="scss">
/**** 前台类目 */
.category {
    margin: 20rpx 0 0;
    padding: 10rpx 0;
    display: flex;
    flex-wrap: wrap;
    min-height: 328rpx;

    .category-item {
        width: 150rpx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;

        .icon {
            width: 100rpx;
            height: 100rpx;
        }

        .text {
            font-size: 26rpx;
            color: #666;
        }
    }
}
</style>
