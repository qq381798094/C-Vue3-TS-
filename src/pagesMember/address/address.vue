<script setup lang="ts">
/** API  */
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
/** 接口 */
import { getMemberAddressListAPI, deleteMemberAddressByIdAPI } from '@/services/member/address'
/** 类型 */
import type { GetAddressResult, GetAddressItem } from '@/types/member/address'
/** 仓库 */
import { useAddressStore } from '@/stores'

/** 仓库实例化 */
// 【地址】仓库
const addressStore = useAddressStore()

/** 初始化获取收获地址列表 */
const addressList = ref<GetAddressResult>([])
const getMemberAddressData = async () => {
    const res = await getMemberAddressListAPI()
    addressList.value = res.result
}

/**
 * 删除收货地址 item
 */
const onDeleteAddressTap = (id: string) => {
    // 二次确认
    uni.showModal({
        content: '确定删除当前地址？',
        success: async (res) => {
            if (res.confirm) {
                // 调用删除接口
                await deleteMemberAddressByIdAPI(id)
                // 重新获取地址列表
                getMemberAddressData()
            }
        },
    })
}

/** 涉及与其他页面通信 —— 选择/修改收货地址 */
const onSelectedAddress = (item: GetAddressItem) => {
    // 修改选中地址
    addressStore.changeSelectedAddress(item)
    // 返回上一页
    uni.navigateBack()
}

/** 生命周期 Hooks 实现 */
// 页面显示一次就要调用一次该函数
onShow(() => {
    // 获取收货地址列表
    getMemberAddressData()
})
</script>

<template>
    <view class="viewport">
        <!-- 地址列表 -->
        <scroll-view class="scroll-view" scroll-y>
            <view v-if="true" class="address">
                <uni-swipe-action class="address-list">
                    <!-- 收货地址项 -->
                    <uni-swipe-action-item class="item" v-for="item in addressList" :key="item.id">
                        <view class="item-content" @tap="onSelectedAddress(item)">
                            <view class="user">
                                {{ item.receiver }}
                                <text class="contact">{{ item.contact }}</text>
                                <text v-if="item.isDefault" class="badge">默认</text>
                            </view>
                            <view class="locate">{{ item.fullLocation }} {{ item.address }}</view>
                            <navigator :url="`/pagesMember/address-form/address-form?id=${item.id}`" hover-class="none"
                                @tap.stop="() => { }" class="edit">
                                修改
                            </navigator>
                        </view>
                        <!-- 右侧删除插槽 -->
                        <template #right>
                            <button @tap="onDeleteAddressTap(item.id)" class="delete-button">删除</button>
                        </template>
                    </uni-swipe-action-item>
                </uni-swipe-action>
            </view>
            <view v-else class="blank">暂无收货地址</view>
        </scroll-view>
        <!-- 添加按钮 -->
        <view class="add-btn">
            <navigator url="/pagesMember/address-form/address-form" hover-class="none">
                新建地址
            </navigator>
        </view>
    </view>
</template>

<style lang="scss">
page {
    height: 100%;
    overflow: hidden;
}

/** 删除按钮 */
.delete-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 100%;
    font-size: 28rpx;
    color: #fff;
    border-radius: 0;
    padding: 0;
    background-color: #cf4444;
}

.viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f4f4f4;

    .scroll-view {
        padding-top: 20rpx;
    }
}

.address {
    padding: 0 20rpx;
    margin: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;

    .item-content {
        line-height: 1;
        padding: 40rpx 10rpx 38rpx;
        border-bottom: 1rpx solid #ddd;
        position: relative;

        .edit {
            position: absolute;
            top: 36rpx;
            right: 30rpx;
            padding: 2rpx 0 2rpx 20rpx;
            border-left: 1rpx solid #666;
            font-size: 26rpx;
            color: #666;
            line-height: 1;
        }
    }

    .item:last-child .item-content {
        border: none;
    }

    .user {
        font-size: 28rpx;
        margin-bottom: 20rpx;
        color: #333;

        .contact {
            color: #666;
        }

        .badge {
            display: inline-block;
            padding: 4rpx 10rpx 2rpx 14rpx;
            margin: 2rpx 0 0 10rpx;
            font-size: 26rpx;
            color: #27ba9b;
            border-radius: 6rpx;
            border: 1rpx solid #27ba9b;
        }
    }

    .locate {
        line-height: 1.6;
        font-size: 26rpx;
        color: #333;
    }
}

.blank {
    margin-top: 300rpx;
    text-align: center;
    font-size: 32rpx;
    color: #888;
}

.add-btn {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
}
</style>
