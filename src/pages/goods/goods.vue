<script setup lang="ts">
/** 组件 */
import ServicePanel from './components/ServicePanel.vue'
import AddressPanel from './components/AddressPanel.vue'
/** 仓库 */
import { useAddressStore } from '@/stores'
/** API */
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, defineProps, computed } from 'vue'
/** 接口导入 */
import { getGoodsInfoByIdAPI } from '@/services/goods'
import { postMemberCartAPI } from '@/services/member/cart'
import { getMemberAddressListAPI } from '@/services/member/address'
/** 类型导入 */
import type { GoodsInfoResult } from '@/types/goods'
import type { GetAddressResult } from '@/types/member/address'
import type {
    SkuPopupLocalData,
    SkuPopupInstance,
    SkuPopupEvent,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'

/** 仓库实例化 */
const addressStore = useAddressStore()

/** API 实例化 */
const props = defineProps<{
    id: string
}>()

/** 页面初始化数据获取 */
// 获取商品详情信息
const goodsInfo = ref<GoodsInfoResult>()
const getGoodsInfoByIdData = async () => {
    const res = await getGoodsInfoByIdAPI(props.id)
    goodsInfo.value = res.result
    // Sku 组件所需格式的数据映射
    localdata.value = {
        _id: res.result.id,
        name: res.result.name,
        goods_thumb: res.result.mainPictures[0],
        spec_list: res.result.specs.map((v) => {
            return {
                name: v.name,
                list: v.values,
            }
        }),
        sku_list: res.result.skus.map((v) => {
            return {
                _id: v.id,
                goods_id: res.result.id,
                goods_name: res.result.name,
                image: v.picture as string,
                price: Number(v.price) * 100,
                stock: v.inventory,
                sku_name_arr: v.specs.map((item) => item.valueName),
            }
        }),
    }
}

/** 组件事件 */
// uni-popup 组件的弹出与关闭，只创建一个 ref 响应式数据
const popupRef = ref<{
    open: (type?: UniHelper.UniPopupType) => void
    close: () => void
}>()
// 弹出层的条件渲染，并写一个打开弹出层的方法
type Type = 'address' | 'service'
const popupType = ref<Type>()
const openPopup = (name: Type) => {
    popupType.value = name
    popupRef.value?.open('bottom')
}

/** 标签事件 */
// <swiper>标签的onChange事件
const currentIndex = ref<number>(0)
const onSwiperChange: UniHelper.SwiperOnChange = (event) => {
    currentIndex.value = event.detail.current
}

// <image />轮播图图片点击事件，点击放大图片
const onTapImage = (url: string) => {
    // 大图预览
    uni.previewImage({
        current: url,
        urls: goodsInfo.value!.mainPictures,
    })
}

/************** 收货地址逻辑 *************/
// 获取地址列表数据
const addressList = ref<GetAddressResult>()
const getMemberAddressListData = async () => {
    const res = await getMemberAddressListAPI()
    addressList.value = res.result
}
// 计算获得收货地址信息
const selectedAddress = computed(() => {
    return addressStore.selectedAddress
        ? addressStore.selectedAddress.fullLocation + ' ' + addressStore.selectedAddress.address
        : '请选择收货地址'
})

/************** SKU 模块逻辑 *************/
// 控制 Sku 的显示/隐藏
const isShowSku = ref<boolean>(false)
// 商品信息
const localdata = ref({} as SkuPopupLocalData)

/** 设置按钮模式 */
// 枚举按钮模式
enum ModeBtn {
    Both = 1,
    Cart = 2,
    Buy = 3,
}
// 按钮模式
const skuMode = ref<ModeBtn>(ModeBtn.Both)
// 商品规格点击事件，打开Sku模块同时设置按钮模式
const openSkuModel = (val: ModeBtn) => {
    // 首先将 Sku 打开
    isShowSku.value = true
    // 设置按钮模式
    skuMode.value = val
}

/** 通过 ref 实例去实现动态改变规格的值 */
// 获取实例
const skuPopupRef = ref<SkuPopupInstance>()
// 通过计算改变 商品规格 内容
const seleceArrText = computed(() => {
    return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})

/** 加入购物车 */
const onAddCart = async (event: SkuPopupEvent) => {
    // 调用添加购物车接口
    await postMemberCartAPI({ skuId: event._id, count: event.buy_num })
    // 提示用户添加成功
    uni.showToast({ icon: 'success', title: '添加成功！' })
    // 关闭 Sku 模块
    isShowSku.value = false
}

/** 立即购买时间 */
const onBuyNow = (event: SkuPopupEvent) => {
    // 跳转到订单页面
    uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${event._id}&count=${event.buy_num}` })
    // 关闭 Sku 组件
    isShowSku.value = false
}

/*-------------- SKU 模块逻辑 --------------*/

/** 钩子函数 */
// 页面初始化
onLoad(() => {
    // 商品页面详情数据获取
    getGoodsInfoByIdData()
})
// 页面显示时调用
onShow(() => {
    // 调用获取地址列表接口
    getMemberAddressListData()
})

// 获取屏幕边界安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
    <!-- SKU 弹窗组件 -->
    <vk-data-goods-sku-popup ref="skuPopupRef" @buy-now="onBuyNow" @add-cart="onAddCart" :actived-style="{
        color: '#27BA9B',
        borderColor: '#27BA9B',
        backgroundColor: '#E9F8F5',
    }" add-cart-background-color="#FFA868" buy-now-background-color="#27BA9B" :localdata="localdata"
        v-model="isShowSku" :mode="skuMode" />

    <scroll-view scroll-y class="viewport">
        <!-- 基本信息 -->
        <view class="goods">
            <!-- 商品主图 -->
            <view class="preview">
                <swiper @change="onSwiperChange" circular autoplay :duration="1000">
                    <swiper-item v-for="url in goodsInfo?.mainPictures" :key="url">
                        <image @tap="onTapImage(url)" mode="aspectFill" :src="url" />
                    </swiper-item>
                </swiper>
                <view class="indicator">
                    <text class="current">{{ currentIndex + 1 }}</text>
                    <text class="split">/</text>
                    <text class="total">{{ goodsInfo?.mainPictures.length }}</text>
                </view>
            </view>

            <!-- 商品简介 -->
            <view class="meta">
                <view class="price">
                    <text class="symbol">￥</text>
                    <text class="number">{{ goodsInfo?.price }}</text>
                </view>
                <view class="name ellipsis">{{ goodsInfo?.name }}</view>
                <view class="desc">{{ goodsInfo?.desc }}</view>
            </view>

            <!-- 操作面板 -->
            <view class="action">
                <view @tap="openSkuModel(ModeBtn.Both)" class="item arrow">
                    <text class="label">选择</text>
                    <text class="text ellipsis">{{ seleceArrText }}</text>
                </view>
                <view @tap="openPopup('address')" class="item arrow">
                    <text class="label">送至</text>
                    <text class="text ellipsis">{{ selectedAddress }}</text>
                </view>
                <view @tap="openPopup('service')" class="item arrow">
                    <text class="label">服务</text>
                    <text class="text ellipsis">无忧退 快速退款 免费包邮</text>
                </view>
            </view>
        </view>

        <!-- 商品详情 -->
        <view class="detail panel">
            <view class="title">
                <text>详情</text>
            </view>
            <view class="content">
                <view class="properties">
                    <!-- 属性详情 -->
                    <view class="item" v-for="property in goodsInfo?.details.properties" :key="property.name">
                        <text class="label">{{ property.name }}</text>
                        <text class="value">{{ property.value }}</text>
                    </view>
                </view>

                <!-- 图片详情 -->
                <image v-for="img in goodsInfo?.details.pictures" :key="img" mode="widthFix" :src="img" />
            </view>
        </view>

        <!-- 同类推荐 -->
        <view class="similar panel">
            <view class="title">
                <text>同类推荐</text>
            </view>
            <view class="content">
                <navigator v-for="item in goodsInfo?.similarProducts" :key="item.id" class="goods" hover-class="none"
                    :url="`/pages/goods/goods?id=${item.id}`">
                    <image class="image" mode="aspectFill" :src="item.picture" />
                    <view class="name ellipsis">{{ item.name }}</view>
                    <view class="price">
                        <text class="symbol">￥</text>
                        <text class="number">{{ item.price }}</text>
                    </view>
                </navigator>
            </view>
        </view>
    </scroll-view>

    <!-- 用户操作区域 -->
    <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
        <view class="icons">
            <button class="icons-button">
                <text class="icon-heart"></text>
                收藏
            </button>
            <button class="icons-button" open-type="contact">
                <text class="icon-handset"></text>
                客服
            </button>
            <navigator class="icons-button" url="/pages/cart/cartPage">
                <text class="icon-cart"></text>购物车
            </navigator>
        </view>
        <view class="buttons">
            <view @tap="openSkuModel(ModeBtn.Cart)" class="addcart">加入购物车</view>
            <view @tap="openSkuModel(ModeBtn.Buy)" class="buynow">立即购买</view>
        </view>
    </view>

    <!-- 弹出层 -->
    <uni-popup ref="popupRef" background-color="#fff">
        <service-panel v-if="popupType === 'service'" @close="popupRef?.close()" />
        <address-panel v-if="popupType === 'address'" @close="popupRef?.close()"
            :address-list="(addressList as GetAddressResult)" />
    </uni-popup>
</template>

<style lang="scss">
page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.viewport {
    background-color: #f4f4f4;
}

.panel {
    margin-top: 20rpx;
    background-color: #fff;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 90rpx;
        line-height: 1;
        padding: 30rpx 60rpx 30rpx 6rpx;
        position: relative;

        text {
            padding-left: 10rpx;
            font-size: 28rpx;
            color: #333;
            font-weight: 600;
            border-left: 4rpx solid #27ba9b;
        }

        navigator {
            font-size: 24rpx;
            color: #666;
        }
    }
}

.arrow {
    &::after {
        position: absolute;
        top: 50%;
        right: 30rpx;
        content: '\e6c2';
        color: #ccc;
        font-family: 'erabbit' !important;
        font-size: 32rpx;
        transform: translateY(-50%);
    }
}

/** 商品信息 */
.goods {
    background-color: #fff;

    .preview {
        height: 750rpx;
        position: relative;

        .image {
            width: 750rpx;
            height: 750rpx;
        }

        .indicator {
            height: 40rpx;
            padding: 0 24rpx;
            line-height: 40rpx;
            border-radius: 30rpx;
            color: #fff;
            font-family: Arial, Helvetica, sans-serif;
            background-color: rgba(0, 0, 0, 0.3);
            position: absolute;
            bottom: 30rpx;
            right: 30rpx;

            .current {
                font-size: 26rpx;
            }

            .split {
                font-size: 24rpx;
                margin: 0 1rpx 0 2rpx;
            }

            .total {
                font-size: 24rpx;
            }
        }
    }

    .meta {
        position: relative;
        border-bottom: 1rpx solid #eaeaea;

        .price {
            height: 130rpx;
            padding: 25rpx 30rpx 0;
            color: #fff;
            font-size: 34rpx;
            box-sizing: border-box;
            background-color: #35c8a9;
        }

        .number {
            font-size: 56rpx;
        }

        .brand {
            width: 160rpx;
            height: 80rpx;
            overflow: hidden;
            position: absolute;
            top: 26rpx;
            right: 30rpx;
        }

        .name {
            max-height: 88rpx;
            line-height: 1.4;
            margin: 20rpx;
            font-size: 32rpx;
            color: #333;
        }

        .desc {
            line-height: 1;
            padding: 0 20rpx 30rpx;
            font-size: 24rpx;
            color: #cf4444;
        }
    }

    .action {
        padding-left: 20rpx;

        .item {
            height: 90rpx;
            padding-right: 60rpx;
            border-bottom: 1rpx solid #eaeaea;
            font-size: 26rpx;
            color: #333;
            position: relative;
            display: flex;
            align-items: center;

            &:last-child {
                border-bottom: 0 none;
            }
        }

        .label {
            width: 60rpx;
            color: #898b94;
            margin: 0 16rpx 0 10rpx;
        }

        .text {
            flex: 1;
            -webkit-line-clamp: 1;
        }
    }
}

/** 商品详情 */
.detail {
    padding-left: 20rpx;

    .content {
        margin-left: -20rpx;

        .image {
            width: 100%;
        }
    }

    .properties {
        padding: 0 20rpx;
        margin-bottom: 30rpx;

        .item {
            display: flex;
            line-height: 2;
            padding: 10rpx;
            font-size: 26rpx;
            color: #333;
            border-bottom: 1rpx dashed #ccc;
        }

        .label {
            width: 200rpx;
        }

        .value {
            flex: 1;
        }
    }
}

/** 同类推荐 */
.similar {
    .content {
        padding: 0 20rpx 200rpx;
        background-color: #f4f4f4;
        display: flex;
        flex-wrap: wrap;

        .goods {
            width: 340rpx;
            padding: 24rpx 20rpx 20rpx;
            margin: 20rpx 7rpx;
            border-radius: 10rpx;
            background-color: #fff;
        }

        .image {
            width: 300rpx;
            height: 260rpx;
        }

        .name {
            height: 80rpx;
            margin: 10rpx 0;
            font-size: 26rpx;
            color: #262626;
        }

        .price {
            line-height: 1;
            font-size: 20rpx;
            color: #cf4444;
        }

        .number {
            font-size: 26rpx;
            margin-left: 2rpx;
        }
    }

    navigator {
        &:nth-child(even) {
            margin-right: 0;
        }
    }
}

/** 底部工具栏 */
.toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: #fff;
    height: 100rpx;
    padding: 0 20rpx var(--window-bottom);
    border-top: 1rpx solid #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: content-box;

    .buttons {
        display: flex;

        &>view {
            width: 220rpx;
            text-align: center;
            line-height: 72rpx;
            font-size: 26rpx;
            color: #fff;
            border-radius: 72rpx;
        }

        .addcart {
            background-color: #ffa868;
        }

        .buynow,
        .payment {
            background-color: #27ba9b;
            margin-left: 20rpx;
        }
    }

    .icons {
        padding-right: 10rpx;
        display: flex;
        align-items: center;
        flex: 1;

        .icons-button {
            flex: 1;
            text-align: center;
            line-height: 1.4;
            padding: 0;
            margin: 0;
            border-radius: 0;
            font-size: 20rpx;
            color: #333;
            background-color: #fff;

            &::after {
                border: none;
            }
        }

        text {
            display: block;
            font-size: 34rpx;
        }
    }
}
</style>
