<script setup lang="ts">
/** API  */
import { defineProps, ref, onMounted } from 'vue'
/** 接口 */
import { getMemberOrderListByParamsAPI } from '@/services/order/order'
import { getPayMockAPI, getWxPayAPI } from '@/services/pay'
/** 类型 */
import type { OrderListDataParams, OrderListItem } from '@/types/order/order'
/** 通用常量 */
import { orderStateList, OrderState } from '@/services/order/contanst'
/** 实例化 */
const props = defineProps<{
    orderState: number
}>()

/********** 初始化获取订单列表逻辑 **********/
// 请求参数
const queryParams: OrderListDataParams = {
    page: 1,
    pageSize: 5,
    orderState: props.orderState,
}
// 获取订单列表数据
const orderList = ref<OrderListItem[]>([])
const getMemberOrderListByParamsData = async () => {
    const res = await getMemberOrderListByParamsAPI(queryParams)
    orderList.value = res.result.items
}

/** 订单支付 */
const onOrderPay = async (id: string) => {
    // 判断是否是开发环境
    if (import.meta.env.DEV) {
        // 调用模拟支付环境
        await getPayMockAPI({ orderId: id })
    } else {
        // 正式环境的微信支付
        const res = await getWxPayAPI({ orderId: id })
        // 成功获取数据后使用wx自带的 API 调用支付界面
        wx.requestPayment(res.result)
    }
    // 成功提示
    uni.showToast({ title: '支付成功' })
    // 更新订单 item 的状态为 -> 待发货
    const item = orderList.value.find((item) => item.id === id)
    item!.orderState = OrderState.DaiFaHuo
}

/** 屏幕边界安全距离 */
const { safeAreaInsets } = uni.getSystemInfoSync()

/** 生命周期 */
onMounted(() => {
    // 初始化订单列表
    getMemberOrderListByParamsData()
})
</script>

<template>
    <scroll-view class="orders" scroll-y>
        <view class="card" v-for="order in orderList" :key="order.id">
            <!-- 订单信息 -->
            <view class="status">
                <text class="date">{{ order.createTime }}</text>
                <!-- 订单状态文字 -->
                <text>{{ orderStateList[order.orderState].text }}</text>
                <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
                <text v-if="order.orderState >= OrderState.DaiPingJia" class="icon-delete"></text>
            </view>
            <!-- 商品信息：待评价/已完成/已取消 状态: 展示删除订单 -->
            <navigator class="goods" hover-class="none" :url="`/pagesOrder/detail/detail?id=${order.id}`"
                v-for="sku in order.skus" :key="sku.id">
                <view class="cover">
                    <image :src="sku.image" mode="aspectFit" />
                </view>
                <view class="meta">
                    <view class="name ellipsis">{{ sku.name }}</view>
                    <view class="type">{{ sku.attrsText }}</view>
                </view>
            </navigator>
            <!-- 支付信息 -->
            <view class="payment">
                <text class="quantity">共{{ order.totalNum }}件商品</text>
                <text>实付</text>
                <text class="amount"> <text class="symbol">￥</text>{{ order.payMoney }}</text>
            </view>
            <!-- 订单操作按钮 -->
            <view class="action">
                <!-- 待付款状态：显示去支付按钮 -->
                <template v-if="order.orderState === OrderState.DaiFuKuan">
                    <view class="button primary" @tap="onOrderPay(order.id)">去支付</view>
                </template>
                <template v-else>
                    <navigator class="button secondary" hover-class="none" :url="`/pagesOrder/create/create?orderId=id`">
                        再次购买</navigator>
                    <!-- 待收货状态：显示确认收货 -->
                    <view class="button primary" v-if="order.orderState === OrderState.DaiShouHuo">确认收货</view>
                </template>
            </view>
        </view>
        <!-- 底部提示文字 -->
        <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">{{
            true ? '没有更多数据~' : '正在加载...'
        }}</view>
    </scroll-view>
</template>

<style lang="scss">
// 订单列表
.orders {
    .card {
        min-height: 100rpx;
        padding: 20rpx;
        margin: 20rpx 20rpx 0;
        background-color: #fff;
        border-radius: 10rpx;

        &:last-child {
            padding-bottom: 40rpx;
        }
    }

    .status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #999;
        margin-bottom: 15rpx;

        .date {
            color: #666;
            flex: 1;
        }

        .primary {
            color: #ff9240;
        }

        .icon-delete {
            line-height: 1;
            margin-left: 10rpx;
            padding-left: 10rpx;
            border-left: 1rpx solid #e3e3e3;
        }
    }

    .goods {
        display: flex;
        margin-bottom: 20rpx;

        .cover {
            width: 170rpx;
            height: 170rpx;
            margin-right: 20rpx;
            border-radius: 10rpx;
            overflow: hidden;
            position: relative;
        }

        .quantity {
            position: absolute;
            bottom: 0;
            right: 0;
            line-height: 1;
            padding: 6rpx 4rpx 6rpx 8rpx;
            font-size: 24rpx;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 10rpx 0 0 0;
        }

        .meta {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .name {
            height: 80rpx;
            font-size: 26rpx;
            color: #444;
        }

        .type {
            line-height: 1.8;
            padding: 0 15rpx;
            margin-top: 10rpx;
            font-size: 24rpx;
            align-self: flex-start;
            border-radius: 4rpx;
            color: #888;
            background-color: #f7f7f8;
        }

        .more {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22rpx;
            color: #333;
        }
    }

    .payment {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        line-height: 1;
        padding: 20rpx 0;
        text-align: right;
        color: #999;
        font-size: 28rpx;
        border-bottom: 1rpx solid #eee;

        .quantity {
            font-size: 24rpx;
            margin-right: 16rpx;
        }

        .amount {
            color: #444;
            margin-left: 6rpx;
        }

        .symbol {
            font-size: 20rpx;
        }
    }

    .action {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-top: 20rpx;

        .button {
            width: 180rpx;
            height: 60rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 20rpx;
            border: 1rpx solid #ccc;
            border-radius: 60rpx;
            font-size: 26rpx;
            color: #444;
        }

        .secondary {
            border-color: #27ba9b;
            color: #27ba9b;
        }

        .primary {
            color: #fff;
            background-color: #27ba9b;
        }
    }

    .loading-text {
        text-align: center;
        font-size: 28rpx;
        color: #666;
        padding: 20rpx 0;
    }
}
</style>
