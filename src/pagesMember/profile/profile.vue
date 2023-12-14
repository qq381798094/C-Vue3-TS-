<script setup lang="ts">
/** API  */
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
/** 仓库 */
import { useMemberStore } from '@/stores'
/** 接口导入 */
import { getMemberProfileAPI, putMemberProfileAPI } from '@/services/member/profile'
/** 类型约束 */
import type { TProfileResult, Gender } from '@/types/member/profile'

/** 仓库实例化 */
const memberStore = useMemberStore()

/**
 * 初始化个人信息数据
 */
const profileInfo = ref({} as TProfileResult) // 保存用户信息
const getMemberProfileData = async () => {
    const res = await getMemberProfileAPI()
    profileInfo.value = res.result
}

/**
 *  修改头像数据并显示
 */
const onAvatarChange = () => {
    // 调用选择图片 API
    uni.chooseMedia({
        // 文件个数
        count: 1,
        mediaType: ['image'],
        success: (res) => {
            // 获取存储在本地的临时路径
            const { tempFilePath } = res.tempFiles[0]
            // 文件上传
            uni.uploadFile({
                url: '/member/profile/avatar', // 接口地址
                name: 'file', // 接口参数
                filePath: tempFilePath,
                success(res) {
                    if (res.statusCode === 200) {
                        const avatar = JSON.parse(res.data).result.avatar
                        // 修改成功，更新数据
                        // 更新存储个人信息的响应式数据
                        profileInfo.value!.avatar = avatar
                        // 更新仓库的个人信息数据
                        memberStore.profile!.avatar = avatar
                        // 提示
                        uni.showToast({ icon: 'success', title: '头像更新成功！' })
                    } else {
                        uni.showToast({ icon: 'fail', title: '更新失败！' })
                    }
                },
            })
        },
    })
}

/** 单选框事件处理 */
// 性别单选框的 onChange 事件
const onRadioGenderChange: UniHelper.RadioGroupOnChange = (event) => {
    // 将值赋值给响应式数据
    profileInfo.value.gender = event.detail.value as Gender
}

/** 选择器事件处理 */
// 生日选择器的 onChange 事件
const pickerBirthdayChange: UniHelper.DatePickerOnChange = (event) => {
    // 将值赋值给响应式数据
    profileInfo.value.birthday = event.detail.value
}
// 城市选择器的 onChange 事件
let cityCode: [string, string, string] = ['', '', '']
const pickerCityChange: UniHelper.RegionPickerOnChange = (event) => {
    // 修改前端界面
    profileInfo.value.fullLocation = event.detail.value.join(' ')
    // 提交后端城市代码
    cityCode = event.detail.code!
}

/**
 * 修改用户信息
 */
// 提交按钮点击事件
const onSubmitButton = async () => {
    // 结构 profileInfo
    const { nickname, gender, birthday, profession } = profileInfo.value
    // 点击保存提交表单
    const res = await putMemberProfileAPI({
        nickname,
        gender,
        birthday,
        profession,
        provinceCode: cityCode[0] || undefined,
        cityCode: cityCode[1] || undefined,
        countyCode: cityCode[2] || undefined,
    })
    // 判断是否成功
    if (res.msg !== '操作成功') {
        uni.showToast({ icon: 'error', title: '保存失败！' })
    }
    // 对数据进行更新【更新 Store 的值】
    // @ts-ignore
    memberStore.profile!.nickname = res.result.nickname
    // 提示修改成功
    uni.showToast({ icon: 'success', title: '保存成功！' })
    // 延时退页
    setTimeout(() => {
        uni.navigateBack()
    }, 500)
}

/** 获取屏幕边界安全距离 API */
const { safeAreaInsets } = uni.getSystemInfoSync()

/** 组件周期 Hooks */
// 页面加载 Hooks
onLoad(() => {
    // 获取个人信息
    getMemberProfileData()
})
</script>

<template>
    <view class="viewport">
        <!-- 导航栏 -->
        <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
            <navigator hover-class="none" open-type="navigateBack" class="back icon-left"></navigator>
            <view class="title">个人信息</view>
        </view>
        <!-- 头像 -->
        <view class="avatar">
            <view @tap="onAvatarChange" class="avatar-content">
                <image class="image" :src="profileInfo?.avatar" mode="aspectFill" />
                <text class="text">点击修改头像</text>
            </view>
        </view>
        <!-- 表单 -->
        <view class="form">
            <!-- 表单内容 -->
            <view class="form-content">
                <view class="form-item">
                    <text class="label">账号</text>
                    <text class="account">{{ profileInfo?.account }}</text>
                </view>
                <view class="form-item">
                    <text class="label">昵称</text>
                    <input type="text" class="input" placeholder="请填写昵称" v-model="profileInfo.nickname" />
                </view>
                <view class="form-item">
                    <text class="label">性别</text>
                    <radio-group @change="onRadioGenderChange">
                        <label class="radio">
                            <radio value="男" color="#27ba9b" :checked="profileInfo?.gender === '男'" />
                            男
                        </label>
                        <label class="radio">
                            <radio value="女" color="#27ba9b" :checked="profileInfo?.gender === '女'" />
                            女
                        </label>
                    </radio-group>
                </view>
                <view class="form-item">
                    <text class="label">生日</text>
                    <picker @change="pickerBirthdayChange" class="picker" mode="date" start="1900-01-01" :end="new Date()"
                        :value="profileInfo?.birthday">
                        <view v-if="profileInfo?.birthday">{{ profileInfo.birthday }}</view>
                        <view class="placeholder" v-else>请选择日期</view>
                    </picker>
                </view>
                <view class="form-item">
                    <text class="label">城市</text>
                    <picker @change="pickerCityChange" mode="region" :value="profileInfo?.fullLocation?.split(' ')"
                        class="picker">
                        <view v-if="profileInfo?.fullLocation">{{ profileInfo.fullLocation }}</view>
                        <view class="placeholder" v-else>请选择城市</view>
                    </picker>
                </view>
                <view class="form-item">
                    <text class="label">职业</text>
                    <input v-model="profileInfo.profession" placeholder="请填写职业" type="text" class="input" />
                </view>
            </view>
            <!-- 提交按钮 -->
            <button @tap="onSubmitButton" class="form-button">保 存</button>
        </view>
    </view>
</template>

<style lang="scss">
page {
    background-color: #f4f4f4;
}

.viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
    background-size: auto 420rpx;
    background-repeat: no-repeat;
}

// 导航栏
.navbar {
    position: relative;

    .title {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
    }

    .back {
        position: absolute;
        height: 40px;
        width: 40px;
        left: 0;
        font-size: 20px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

// 头像
.avatar {
    text-align: center;
    width: 100%;
    height: 260rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
        background-color: #eee;
    }

    .text {
        display: block;
        padding-top: 20rpx;
        line-height: 1;
        font-size: 26rpx;
        color: #fff;
    }
}

// 表单
.form {
    background-color: #f4f4f4;

    &-content {
        margin: 20rpx 20rpx 0;
        padding: 0 20rpx;
        border-radius: 10rpx;
        background-color: #fff;
    }

    &-item {
        display: flex;
        height: 96rpx;
        line-height: 46rpx;
        padding: 25rpx 10rpx;
        background-color: #fff;
        font-size: 28rpx;
        border-bottom: 1rpx solid #ddd;

        &:last-child {
            border: none;
        }

        .label {
            width: 180rpx;
            color: #333;
        }

        .account {
            color: #666;
        }

        .input {
            flex: 1;
            display: block;
            height: 46rpx;
        }

        .radio {
            margin-right: 20rpx;
        }

        .picker {
            flex: 1;
        }

        .placeholder {
            color: #808080;
        }
    }

    &-button {
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        margin: 30rpx 20rpx;
        color: #fff;
        background-color: #27ba9b;
        border-radius: 80rpx;
        font-size: 30rpx;
    }
}
</style>
