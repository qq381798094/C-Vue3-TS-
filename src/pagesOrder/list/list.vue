<script setup lang="ts">
/** API  */
import { ref, defineProps } from 'vue'
/** 组件导入 */
import OrderList from './components/OrderList.vue'

/** 获取页面参数 */
const query = defineProps<{
    type: string
}>()

/********** tabs 顶部逻辑处理 **********/
// tabs 数据
const orderTabs = ref([
    { orderState: 0, title: '全部' },
    { orderState: 1, title: '待付款' },
    { orderState: 2, title: '待发货' },
    { orderState: 3, title: '待收货' },
    { orderState: 4, title: '待评价' },
])
// 高亮下标： 根据传递过来的 type 类型， 判断 tabs 里是否含有指定的类型数据，有就找出它的下标，没有则返回 -1
const activeIndex = ref(orderTabs.value.findIndex((item) => item.orderState === Number(query.type)))
</script>

<template>
    <view class="viewport">
        <!-- tabs -->
        <view class="tabs">
            <text class="item" v-for="(order, index) in orderTabs" :key="order.orderState" @tap="activeIndex = index">{{
                order.title }}</text>
            <!-- 游标： 自定义 style 方便计算左边的距离 -->
            <view class="cursor" :style="{ left: activeIndex * 20 + '%' }"></view>
        </view>
        <!-- 滑动容器 -->
        <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
            <!-- 滑动项 -->
            <swiper-item v-for="item in orderTabs" :key="item.orderState">
                <!-- 订单列表 -->
                <order-list :order-state="item.orderState" />
            </swiper-item>
        </swiper>
    </view>
</template>

<style lang="scss">
page {
    height: 100%;
    overflow: hidden;
}

.viewport {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

// tabs
.tabs {
    display: flex;
    justify-content: space-around;
    line-height: 60rpx;
    margin: 0 10rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
    position: relative;
    z-index: 9;

    .item {
        flex: 1;
        text-align: center;
        padding: 20rpx;
        font-size: 28rpx;
        color: #262626;
    }

    .cursor {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 20%;
        height: 6rpx;
        padding: 0 50rpx;
        background-color: #27ba9b;
        /** 滑动动画 */
        transition: all 0.4s;
    }
}

// swiper
.swiper {
    background-color: #f7f7f8;
}
</style>
