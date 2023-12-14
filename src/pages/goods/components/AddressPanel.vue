<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAddressStore } from '@/stores'
import type { GetAddressResult } from '@/types/member/address'

const addressStore = useAddressStore()

const props = defineProps<{
    addressList: GetAddressResult
}>()

const emits = defineEmits<{
    (event: 'close'): void
}>()

/** 地址选择逻辑 */
const activeIndex = ref<number>(0)
const onChangeIndex = (index: number) => {
    activeIndex.value = index
    // 放进仓库
    addressStore.changeSelectedAddress(props.addressList[index])
    // 关闭按钮
    emits('close')
}

/** 生命周期 */
onShow(() => {
    // 判断仓库内是否有地址
    if (addressStore.selectedAddress) {
        activeIndex.value = props.addressList.indexOf(addressStore.selectedAddress)
    }
})
</script>

<template>
    <view class="address-panel">
        <!-- 关闭按钮 -->
        <text @tap="emits('close')" class="close icon-close"></text>
        <!-- 标题 -->
        <view class="title">配送至</view>
        <!-- 内容 -->
        <view class="content">
            <view @tap="onChangeIndex(index)" class="item" v-for="(address, index) in props.addressList" :key="address.id">
                <view class="user">{{ address.receiver }} {{ address.contact }}</view>
                <view class="address">{{ address.fullLocation }} {{ address.address }}</view>
                <text class="icon" :class="activeIndex === index ? 'icon-checked' : 'icon-ring'"></text>
            </view>
        </view>
        <view class="footer">
            <navigator class="button primary" url="/pagesMember/address-form/address-form" hover-class="none">
                <view> 新建地址 </view>
            </navigator>
            <view v-if="false" class="buttom primary">确定</view>
        </view>
    </view>
</template>

<style lang="scss">
.address-panel {
    padding: 0 30rpx;
    border-radius: 10rpx 10rpx 0 0;
    position: relative;
    background-color: #fff;
}

.title {
    line-height: 1;
    padding: 40rpx 0;
    text-align: center;
    font-size: 32rpx;
    font-weight: normal;
    border-bottom: 1rpx solid #ddd;
    color: #444;
}

.close {
    position: absolute;
    right: 24rpx;
    top: 24rpx;
}

.content {
    min-height: 300rpx;
    max-height: 540rpx;
    overflow: auto;
    padding: 20rpx;

    .item {
        padding: 30rpx 50rpx 30rpx 60rpx;
        background-size: 40rpx;
        background-repeat: no-repeat;
        background-position: 0 center;
        background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
        position: relative;
    }

    .icon {
        color: #999;
        font-size: 40rpx;
        transform: translateY(-50%);
        position: absolute;
        top: 50%;
        right: 0;
    }

    .icon-checked {
        color: #27ba9b;
    }

    .icon-ring {
        color: #444;
    }

    .user {
        font-size: 28rpx;
        color: #444;
        font-weight: 500;
    }

    .address {
        font-size: 26rpx;
        color: #666;
    }
}

.footer {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0 40rpx;
    font-size: 28rpx;
    color: #444;

    .button {
        flex: 1;
        height: 72rpx;
        text-align: center;
        line-height: 72rpx;
        margin: 0 20rpx;
        color: #fff;
        border-radius: 72rpx;
    }

    .primary {
        color: #fff;
        background-color: #27ba9b;
    }

    .secondary {
        background-color: #ffa868;
    }
}
</style>
