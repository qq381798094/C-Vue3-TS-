/** 引入仓库，为了获取用户 token */
import { useMemberStore } from '@/stores/index'

/** 接口地址 */
const base_url = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

/** 添加拦截器 */
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非http开头需拼接的地址
    if (!options.url.startsWith('http')) {
      options.url = base_url + options.url
    }

    // 请求超时处理，默认10s
    options.timeout = 10000

    // 添加小程序请求头标识
    options.header = {
      ...options.header, // 将主代码里的header属性并进请求头中
      'source-client': 'miniapp',
    }

    // 添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      // 将 token 装进请求头中
      options.header.Authorization = token
    }
  },
}

/** 在进行 request 和 uploadFile 的请求前都会触发 httpInterceptor 自定义的拦截器  */
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/** 类型约束的定义 */
interface Data<T> {
  code: string
  msg: string
  result: T
}

/** 请求函数的封装 */
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回一个promise对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 请求成功
      success(res) {
        // 判断code
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 返回核心数据
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 401 表示用户信息错误 ——> 清理用户信息 +  跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '当前网络错误！',
        })
        reject(err)
      },
    })
  })
}
