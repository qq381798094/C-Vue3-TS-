import { Component } from '@uni-helper/uni-app-types'

/** 步进器事件对象【形参】 */
export type InputNumberBoxEvent = {
  /** 输入框当前值 */
  value: number
  /** 步进器标识符 */
  index: string
}

/** 步进器属性 */
export type InputNumberBoxProps = {
  /** 输入框初始值（默认1） */
  modelValue: number
  /** 用户可输入的最小值【默认0】 */
  min: number
  /** 可输入的最大值【默认99999】 */
  max: number
  /** 步长，每次加减的值【默认1】 */
  step: number
  /** 是否禁用操作，包括输入、加减按钮 */
  disabled: boolean
  /** 输入框宽度，单位 rpx【默认80】 */
  inputWidth: string | number
  /** 输入框高度，单位rpx【默认50】 */
  inputHeight: string | number
  /** 输入框和按钮的背景颜色 */
  bgColor: string
  /** 步进器标识符 */
  index: string
  /** 输入框内容发生变化时触发 */
  onChange: (event: InputNumberBoxEvent) => void
  /** 输入框失去焦点时触发 */
  onBlur: (event: InputNumberBoxEvent) => void
  /** 点击增加按钮时触发 */
  onPlus: (event: InputNumberBoxEvent) => void
  /** 点击减少按钮时触发  */
  onMinus: (event: InputNumberBoxEvent) => void
}

/** 步进器【标签类型约束】 */
export type InputNumberBox = Component<InputNumberBoxProps>

/** 步进器实例【对象属性类型约束】 */
export type InputNumberBoxInstance = InstanceType<InputNumberBox>

/** 全局组件类型声明 */
declare module 'vue' {
  export interface GlobalComponents {
    'vk-data-input-number-box': InputNumberBox
  }
}
