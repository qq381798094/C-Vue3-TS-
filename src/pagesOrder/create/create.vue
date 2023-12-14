<script setup lang="ts">
/** API */
import { ref, computed, defineProps } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
/** 接口 */
import { getMemberOrderAPI } from '@/services/order/create'
import { getBuyNowOrderPreAPI, postMemberOrderAPI } from '@/services/order/order'
/** 类型 */
import type { CreateOrderResult } from '@/types/order/create'
/** 仓库 */
import { useAddressStore } from '@/stores'

/** API 实例 */
const query = defineProps<{
    skuId: string
    count: string
}>()

/** 仓库实例化 */
// 【地址】仓库
const addressStore = useAddressStore()

/** 安全区域 */
const { safeAreaInsets } = uni.getSystemInfoSync()

/********* 订单处理部分 ********/
// 订单备注
const buyerMessage = ref<string>('')

/********** 配送时间数据处理 ********/
// 配送时间
const deliveryList = ref([
    { type: 1, text: '时间不限 (周一至周日)' },
    { type: 2, text: '工作日送 (周一至周五)' },
    { type: 3, text: '周末配送 (周六至周日)' },
])
// 当前配送时间下标
const activeIndex = ref<number>(0)
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value])
// 修改配送时间
const onChangeDelivery: UniHelper.SelectorPickerOnChange = (event) => {
    activeIndex.value = event.detail.value
}

/** 获取订单信息 */
const orderPre = ref<CreateOrderResult>()
const getMemberOrderData = async () => {
    // 判断是 立即购买 or 购物车结算
    if (query.skuId && query.count) {
        // 调用 立即购买 API
        const res = await getBuyNowOrderPreAPI({
            skuId: query.skuId,
            count: query.count,
        })
        orderPre.value = res.result
    } else {
        // 调用购物车结算 API
        const res = await getMemberOrderAPI()
        orderPre.value = res.result
    }
}

/********** 地址管理逻辑 **********/
// 计算出默认地址并判断是使用 仓库地址 or 默认地址
const defaultAddress = computed(() => {
    // 如果仓库 ref 有数据，则使用仓库数据，没有仓库数据则使用默认地址
    return (
        addressStore.selectedAddress ||
        orderPre.value?.userAddresses.find((item) => item.isDefault === 1)
    )
})

/********** 提交订单 **********/
// 提交订单点击事件
const onSubmitBtn = async () => {
    // 判断是否有选择收货地址，没有选择则告诉用户不能进行提交操作
    if (!defaultAddress.value?.id) {
        return uni.showToast({ icon: 'none', title: '当前操作有误！请选择收货地址' })
    }
    // 提交订单
    const res = await postMemberOrderAPI({
        addressId: defaultAddress.value?.id,
        buyerMessage: buyerMessage.value,
        deliveryTimeType: activeDelivery.value.type,
        goods: orderPre.value!.goods.map((item) => {
            return {
                skuId: item.skuId,
                count: item.count,
            }
        }),
        payChannel: 2,
        payType: 1,
    })
    // 关闭当前页面
    uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${res.result.id}` })
}

/** 生命周期 */
onLoad(() => {
    // 获取订单信息
    getMemberOrderData()
})
</script>

<template>
    <scroll-view scroll-y class="viewport">
        <!-- 收货地址 -->
        <navigator v-if="defaultAddress" url="/pagesMember/address/address?from=order" class="shipment" hover-class="none">
            <view class="user">{{ defaultAddress.receiver }} {{ defaultAddress.contact }}</view>
            <view class="address">{{ defaultAddress.fullLocation }} {{ defaultAddress.address }}</view>
            <text class="icon icon-right"></text>
        </navigator>

        <navigator v-else hover-class="none" url="/pagesMember/address/address?from=order" class="shipment">
            <view class="address">请选择收货地址</view>
            <text class="icon icon-right"></text>
        </navigator>

        <!-- 商品信息 -->
        <view class="goods">
            <navigator v-for="goods in orderPre?.goods" :key="goods.skuId" :url="`/pages/goods/goods?id=${goods.id}`"
                hover-class="none" class="item">
                <image class="picture" :src="goods.picture" />
                <view class="meta">
                    <view class="name ellipsis">{{ goods.name }}</view>
                    <view class="arrts">{{ goods.attrsText }}</view>
                    <view class="prices">
                        <view class="pay-price symbol">{{ goods.payPrice }}</view>
                        <view class="price symbol">{{ goods.price }}</view>
                    </view>
                    <view class="count">x{{ goods.count }}</view>
                </view>
            </navigator>
        </view>

        <!-- 配送以及支付方式 -->
        <view class="related">
            <view class="item">
                <text class="text">配送时间</text>
                <picker :range="deliveryList" range-key="text" @change="onChangeDelivery">
                    <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
                </picker>
            </view>
            <view class="item">
                <text class="text">订单备注</text>
                <input :cursor-spacing="30" placeholder="选填，建议留言前先与商家沟通确认" v-model="buyerMessage" type="text"
                    class="input" />
            </view>
        </view>

        <!-- 支付金额 -->
        <view class="settlement">
            <view class="item">
                <text class="text">商品总价：</text>
                <text class="number symbol">{{ orderPre?.summary.totalPrice.toFixed(2) }}</text>
            </view>
            <view class="item">
                <text class="text">运费：</text>
                <text class="number symbol">{{ orderPre?.summary.postFee.toFixed(2) }}</text>
            </view>
        </view>
    </scroll-view>

    <!-- 吸底工具栏 -->
    <view class="toolbar" :style="{ paddingBottom: safeAreaInsets!.bottom + 'px' }">
        <view class="total-pay symbol">
            <text class="number">{{ orderPre?.summary.totalPayPrice.toFixed(2) }}</text>
        </view>
        <view @tap="onSubmitBtn" class="button" :class="{ disabled: !defaultAddress?.id }">提交订单</view>
    </view>
</template>

<style lang="scss">
page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background-color: #f4f4f4;
}

.symbol::before {
    content: '￥';
    font-size: 80%;
    margin-right: 5rpx;
}

.shipment {
    margin: 20rpx;
    padding: 30rpx 30rpx 30rpx 84rpx;
    font-size: 26rpx;
    position: relative;
    background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png) no-repeat #fff 20rpx center / 50rpx;
    border-radius: 10rpx;

    .icon {
        font-size: 36rpx;
        color: #333;
        transform: translateY(-50%);
        position: absolute;
        top: 50%;
        right: 20rpx;
    }

    .user {
        color: #333;
        margin-bottom: 5rpx;
    }

    .address {
        color: #666;
    }
}

.goods {
    margin: 20rpx;
    padding: 0 20rpx;
    background-color: #fff;
    border-radius: 10rpx;

    .item {
        display: flex;
        padding: 30rpx 0;
        border-top: 1rpx solid #eee;

        &:first-child {
            border-top: none;
        }

        .picture {
            width: 170rpx;
            height: 170rpx;
            border-radius: 10rpx;
            margin-right: 20rpx;
        }

        .meta {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .name {
            height: 80rpx;
            font-size: 26rpx;
            color: #444;
        }

        .arrts {
            line-height: 1.8;
            padding: 0 15rpx;
            margin-top: 6rpx;
            font-size: 24rpx;
            align-self: flex-start;
            background: #f7f7f8;
            border-radius: 4rpx;
            color: #888;
        }

        .prices {
            display: flex;
            align-items: baseline;
            margin-top: 6rpx;
            font-size: 28rpx;

            .pay-price {
                margin-right: 10rpx;
                color: #cf4444;
            }

            .price {
                font-size: 24rpx;
                color: #999;
                text-decoration: line-through;
            }
        }

        .count {
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 26rpx;
            color: #444;
        }
    }
}

// 配送 && 支付方式
.related {
    margin: 20rpx;
    padding: 0 20rpx;
    background-color: #fff;
    border-radius: 10rpx;

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 80rpx;
        font-size: 26rpx;
        color: #333;
    }

    .input {
        flex: 1;
        text-align: right;
        margin: 20rpx 0;
        padding-right: 20rpx;
        color: #999;
        font-size: 26rpx;
    }

    .item .text {
        width: 125rpx;
    }

    .picker {
        color: #666;

        &::after {
            content: '\e6c2';
        }
    }
}

// 支付金额
.settlement {
    margin: 20rpx;
    padding: 0 20rpx;
    background-color: #fff;
    border-radius: 10rpx;

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80rpx;
        font-size: 26rpx;
        color: #333;
    }

    .danger {
        color: #cf4444;
    }
}

.toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(var(--window-bottom));
    z-index: 1;

    height: 100rpx;
    box-sizing: content-box;
    background-color: #fff;
    padding: 0 20rpx;
    border-top: 1rpx solid #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .total-pay {
        font-size: 40rpx;
        color: #cf4444;

        .decimal {
            font-size: 75%;
        }
    }

    .button {
        width: 220rpx;
        background-color: #27ba9b;
        border-radius: 72rpx;
        color: #fff;
        line-height: 72rpx;
        text-align: center;
        font-size: 26rpx;
    }

    .disabled {
        opacity: 0.6;
    }
}
</style>
