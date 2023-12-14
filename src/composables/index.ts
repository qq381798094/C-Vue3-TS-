import { ref } from 'vue'
import type { XtxGuessInstance } from '@/components/components'

/**
 * 方法封装
 * 功能：触及底部后加载更多数据【猜你喜欢】
 */
export const useGetGuessMoreList = () => {
  // 获取 <XtxGuess />自定义标签的 DOM 元素
  const guessRef = ref<XtxGuessInstance>()
  // 滑动到底部会触发该事件
  const onScrollToLower = () => {
    // 对【猜你喜欢】的数据进行重新加载【重新调用方法获取数据】
    guessRef.value?.getMore()
  }

  return {
    guessRef,
    onScrollToLower,
  }
}
