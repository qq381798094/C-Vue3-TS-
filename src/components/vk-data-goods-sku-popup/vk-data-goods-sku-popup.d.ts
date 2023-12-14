import { Component } from '@uni-helper/uni-app-types'

/** 商品规格名称的集合 */
export type SkuPopupSpecItem = {
  // 规格名称
  name: string
  // 规格集合
  list: {
    name: string
  }[]
}

/** 商品 SKU 列表 */
export type SkuPopupSkuItem = {
  // sku ID
  _id: string
  // 商品 ID
  goods_id: string
  // 商品名称
  goods_name: string
  // 商品图片
  image: string
  // sku价格
  price: number
  // sku 规格组成
  sku_name_arr: string[]
  // sku 库存
  stock: number
}

/** 当前选择的 sku 数据 */
export type SkuPopupEvent = SkuPopupSkuItem & {
  // 商品购买数量
  buy_num: number
}

/** 商品信息本地数据源 */
export type SkuPopupLocalData = {
  // 商品 id
  _id: string
  // 商品名称
  name: string
  // 商品图片
  goods_thumb: string
  // 商品规格列表
  spec_list: SkuPopupSpecItem[]
  // 商品 Sku 列表
  sku_list: SkuPopupSkuItem[]
}

/** SKU 弹出层属性 */
export type SkuPopupProps = {
  // 双向绑定
  modelValue: boolean
  // 商品信息本地数据源
  localdata: SkuPopupLocalData
  // 按钮模式
  mode?: 1 | 2 | 3
  // 该商品已抢完时的按钮文字
  noStockText?: string
  // 库存文字
  stockText?: string
  // 点击遮罩是否关闭组件
  maskCloseAble?: boolean
  // 顶部圆角值
  borderRadius?: string | number
  // 最小购买数量
  minBuyNum?: number
  // 最大购买数量
  maxBuyNum?: number
  // 每次点击后的数量
  stepBuyNum?: number
  // 是否只能输入 step 的倍数
  stepStrictly?: boolean
  // 是否隐藏库存的显示
  hideStock?: false
  // 主题风格
  theme?: 'default' | 'red-black' | 'black-white' | 'coffee' | 'green'
  // 默认金额
  amountType?: 1 | 0
  // 自定义获取商品信息的函数
  customAction?: () => void
  // 是否显示右上角关闭按钮
  showClose?: boolean
  // 关闭按钮的图片地址
  closeImage?: string
  // 价格的字体颜色
  priceColor?: string

  /* 立即购买 */
  // 按钮文字
  buyNowText?: string
  // 按钮字体颜色
  buyNowColor?: string
  // 按钮背景颜色
  buyNowBackgroundColor?: string

  /* 加入购物车 */
  // 按钮文字
  addCartText?: string
  // 按钮字体颜色
  addCartColor?: string
  // 按钮背景颜色
  addCartBackgroundColor?: string

  // 商品缩略图背景色
  goodsThumbBackgroundColor?: string

  /** 样式 */
  // 不可点击时
  disableStyle?: object
  // 可点击时
  activedStyle?: object
  // 常态样式
  btnStyle?: object

  /** 字段名 */
  // 商品表 id
  goodsIdName?: string
  // Sku表 id
  skuIdName?: string
  // 商品对应 Sku 列表
  skuListName?: string
  // 商品规格名称
  specListName?: string
  // Sku库存
  stockName?: string
  // Sku 组合路径
  skuArrName?: string
  // 商品缩略图字段名
  goodsThumbName?: string

  // 被选中的值
  selectArr?: string[]

  // 打开弹出层
  onOpen: () => void
  // 关闭弹出层
  onClose: () => void
  // 点击加入购物车
  onAddCart: (event: SkuPopupEvent) => void
  // 点击立即购买
  onBuyNow: (event: SkuPopupEvent) => void
}

/** Sku 弹出层 */
export type SkuPopup = Component<SkuPopupProps>

/** Sku 弹出层实例 */
export type SkuPopupInstance = InstanceType<SkuPopup>

/** 全局组件类型声明 */
declare module 'vue' {
  export interface GlobalComponents {
    'vk-data-goods-sku-popup': SkuPopup
  }
}
