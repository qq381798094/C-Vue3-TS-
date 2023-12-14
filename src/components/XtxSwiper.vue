<script setup lang="ts">
/** API导入 */
import { ref, defineProps } from 'vue'
/** 类型导入 */
import type { BannerItem } from '@/types/home'
/** API 实例化 */
const props = defineProps<{
	bannerList: BannerItem[]
}>()
const activeIndex = ref<number>(0)
// swiper发生改变时改变下标
const changeDot: UniHelper.SwiperOnChange = (event) => {
	// 非空断言:!
	activeIndex.value = event.detail!.current
}
</script>

<template>
	<view class="carousel">
		<swiper :circular="true" :autoplay="true" :interval="3000" @change="changeDot">
			<swiper-item v-for="banner in bannerList" :key="banner.id">
				<navigator url="/pages/index/index" hover-class="none" class="navigator">
					<image mode="aspectFill" class="image" :src="banner.imgUrl"> </image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 指示点 -->
		<view class="indicator">
			<text v-for="(item, index) in bannerList" :key="item.id" class="dot"
				:class="{ active: index === activeIndex }"></text>
		</view>
	</view>
</template>

<style lang="scss">
.carousel {
	height: 280rpx;
	position: relative;
	overflow: hidden;
	transform: translateY(0);
	background-color: #efefef;

	.indicator {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 16rpx;
		display: flex;
		justify-content: center;

		.dot {
			width: 30rpx;
			height: 6rpx;
			margin: 0 8rpx;
			border-radius: 6rpx;
			background-color: rgba(255, 255, 255, 0.4);
		}

		.active {
			background-color: #fff;
		}
	}

	.navigator,
	.image {
		width: 100%;
		height: 100%;
	}
}
</style>
