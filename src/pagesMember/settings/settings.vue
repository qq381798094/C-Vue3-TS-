<script setup lang="ts">
/** 引入仓库 */
import { useMemberStore } from '@/stores'

/** 实例化 */
const memberStore = useMemberStore()

/** 退出登录 */
const onLoginout = () => {
    // 弹窗
    uni.showModal({
        content: '是否退出登录？',
        success: (res) => {
            if (res.confirm) {
                // 清理用户信息
                memberStore.clearProfile()
                // 返回上一页
                uni.navigateBack()
            }
        },
    })
}
</script>

<template>
    <view class="viewport">
        <!-- 列表1 -->
        <view class="list" v-if="memberStore.profile">
            <navigator url="/pagesMember/address/address" hover-class="none" class="item arrow">我的收获地址</navigator>
        </view>
        <!-- 列表2 -->
        <view class="list">
            <button open-type="openSetting" hover-class="none" class="item arrow">授权管理</button>
            <button open-type="feedback" hover-class="none" class="item arrow">问题反馈</button>
            <button open-type="contact" hover-class="none" class="item arrow">联系我们</button>
        </view>
        <!-- 列表3 -->
        <view class="list">
            <navigator url=" " hover-class="none" class="item arrow">关于小兔鲜</navigator>
        </view>
        <!-- 操作按钮 -->
        <view class="action" @tap="onLoginout" v-if="memberStore.profile">
            <view class="button">退出登录</view>
        </view>
    </view>
</template>

<style lang="scss">
page {
    background-color: #f4f4f4;
}

.viewport {
    padding: 20rpx;
}

/** 列表 */
.list {
    padding: 0 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    border-radius: 10rpx;

    .item {
        line-height: 90rpx;
        padding-left: 10rpx;
        font-size: 30rpx;
        color: #333;
        border-top: 1rpx solid #ddd;
        position: relative;
        text-align: left;
        border-radius: 0;
        background-color: #fff;

        &::after {
            width: auto;
            height: auto;
            left: auto;
            border: none;
        }

        &:first-child {
            border: none;
        }

        &::after {
            right: 5rpx;
        }
    }

    .arrow::after {
        content: '\e6c2';
        font-family: 'erabbit' !important;
        position: absolute;
        top: 50%;
        color: #ccc;
        font-size: 32rpx;
        transform: translateY(-50%);
    }
}

/** 操作按钮 */
.action {
    text-align: center;
    line-height: 90rpx;
    margin-top: 40rpx;
    font-size: 32rpx;
    color: #333;

    .button {
        background-color: #fff;
        margin-bottom: 20rpx;
        border-radius: 10rpx;
    }
}
</style>
