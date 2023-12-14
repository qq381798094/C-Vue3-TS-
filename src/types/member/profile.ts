/**
 * 通用类型约束
 */
export type Gender = '女' | '男'

export type CommonProfile = {
  nickname?: string
  gender?: Gender
  birthday?: string
  profession?: string
}
/**
 * 获取用户个人信息类型约束
 */
export type TProfileResult = CommonProfile & {
  id: string
  avatar: string
  account: string
  fullLocation: string
}

/**
 * 需要提交的个人信息类型
 */
export type TProfileParams = CommonProfile & {
  provinceCode?: string
  cityCode?: string
  countyCode?: string
}
