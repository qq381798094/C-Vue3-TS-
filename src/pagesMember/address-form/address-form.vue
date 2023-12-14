<script setup lang="ts">
/** API  */
import { ref, defineProps } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
/** 接口 */
import {
    postAddMemberAddressAPI,
    getMemberAddressDetailByIdAPI,
    putMemberAddressEditByIdAPI,
} from '@/services/member/address'
/** 类型 */
import type { IsDefault } from '@/types/member/address'
/** API 实例化 */
const query = defineProps<{
    id?: string
}>()

// 表单数据
const form = ref({
    receiver: '', // 收货人
    contact: '', // 联系方式
    fullLocation: '', // 省市区【前端】
    provinceCode: '', // 省代码【后端】
    cityCode: '', // 市代码【后端】
    countyCode: '', // 区/县代码【后端】
    address: '', // 详细地址
    isDefault: 0 as IsDefault, // 默认地址，1为默认，2为非默认
})

/**
 * 表单验证
 */
const formRef = ref<UniHelper.UniFormsInstance>() // 存储表单组件实例
const rules: UniHelper.UniFormsRules = {
    receiver: {
        rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
    },
    contact: {
        rules: [
            { required: true, errorMessage: '请输入联系方式' },
            { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式有误' },
        ],
    },
    fullLocation: {
        rules: [{ required: true, errorMessage: '请选择所在地区' }],
    },
    address: {
        rules: [{ required: true, errorMessage: '请选择详细地址' }],
    },
}

/**
 * 有 id 情况时进行数据回显
 */
const getMemberAddressDetailByIdData = async () => {
    if (query.id) {
        const res = await getMemberAddressDetailByIdAPI(query.id)
        Object.assign(form.value, res.result)
    }
}

/** 表单数据收集 */
// 收集所在地区的值 picker -> onChange
const pickerRegionChange: UniHelper.RegionPickerOnChange = (event) => {
    // 收集【前端】展示的值
    form.value.fullLocation = event.detail.value.join(' ')
    // 收集【后端】需要的 code 值
    const [provinceCode, cityCode, countyCode] = event.detail.code!
    // 将收集到的 code 赋值进 form 数据表单中
    Object.assign(form.value, { provinceCode, cityCode, countyCode })
}
// 收集默认地址值 switch -> onChange
const switchDefaultChange: UniHelper.SwitchOnChange = (event) => {
    // 赋值
    form.value.isDefault = event.detail.value ? 1 : 0
}

/** 表单提交 */
// 【保存】按钮点击事件
const onSubmitButton = async () => {
    try {
        // 表单校验
        await formRef.value?.validate?.()
        // 提交判断是否有 id 值传入
        if (query.id) {
            // 修改地址 API
            await putMemberAddressEditByIdAPI(query.id, form.value)
        } else {
            // 请求新建地址
            await postAddMemberAddressAPI(form.value)
        }
        // 成功提示
        uni.showToast({ icon: 'success', title: query.id ? '地址修改成功！' : '地址添加成功!' })
        // 返回上一页
        setTimeout(() => {
            uni.navigateBack()
        }, 1000)
    } catch (error) {
        uni.showToast({ icon: 'error', title: '请填写完整信息！' })
    }
}

/** 生命周期 Hooks */
onLoad(() => {
    // 动态设置当前标题
    uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })
    // 根据是否传入 id 值决定是否有数据回显【修改地址】
    getMemberAddressDetailByIdData()
})
</script>

<template>
    <view class="content">
        <uni-forms ref="formRef" :rules="rules" :model="form">
            <!-- 表单内容 -->
            <uni-forms-item name="receiver" class="form-item">
                <text class="label">收货人</text>
                <input v-model="form.receiver" type="text" class="input" placeholder="请填写收货人姓名" />
            </uni-forms-item>

            <uni-forms-item name="contact" class="form-item">
                <text class="label">手机号码</text>
                <input v-model="form.contact" placeholder="请填写收货人手机号码" type="text" class="input" />
            </uni-forms-item>

            <uni-forms-item name="fullLocation" class="form-item">
                <text class="label">所在地区</text>
                <picker @change="pickerRegionChange" mode="region" :value="form.fullLocation.split(' ')" class="picker">
                    <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
                    <view v-else class="placeholder">请选择省/市/区(县)</view>
                </picker>
            </uni-forms-item>

            <uni-forms-item name="address" class="form-item">
                <text class="label">详细地址</text>
                <input v-model="form.address" placeholder="街道、楼牌号等信息" type="text" class="input" />
            </uni-forms-item>

            <view class="form-item">
                <label class="label">设为默认地址</label>
                <switch @change="switchDefaultChange" class="switch" color="#27ba9b" :checked="form.isDefault === 1" />
            </view>
        </uni-forms>
    </view>
    <!-- 提交按钮 -->
    <button @tap="onSubmitButton" class="button">保存并使用</button>
</template>

<style lang="scss">
page {
    background-color: #f4f4f4;
}

.content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;

    .form-item,
    .uni-forms-item {
        display: flex;
        align-items: center;
        min-height: 96rpx;
        padding: 25rpx 10rpx 40rpx;
        background-color: #fff;
        font-size: 28rpx;
        border-bottom: 1rpx solid #ddd;
        position: relative;
        margin-bottom: 0;

        // 调整 uni-forms 样式
        .uni-forms-item__content {
            display: flex;
        }

        .uni-forms-item__error {
            margin-left: 200rpx;
        }

        &:last-child {
            border: none;
        }

        .label {
            width: 200rpx;
        }

        .input {
            flex: 1;
            display: block;
            height: 46rpx;
        }

        .switch {
            position: absolute;
            right: -20rpx;
            transform: scale(0.8);
        }

        .picker {
            flex: 1;
        }

        .placeholder {
            color: #808080;
        }
    }
}

.button {
    height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    background-color: #27ba9b;
    font-size: 30rpx;
}
</style>
