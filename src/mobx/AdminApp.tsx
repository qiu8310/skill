import {observable} from 'mobx'
import {autobind} from 'mora-common'

import createAdminApi from './lib/createAdminApi'
import {MobxApp} from 'common/'
import {IBreadcrumb} from 'global'

export class AdminApp extends MobxApp {
  storeKey = 'AdminApp'
  serializableKeys = ['hideFooter', 'collapseAside', 'user']

  // 保证上面的变量先执行（也可以将上面的变量写成 get prop() {} 的形式）
  constructor(c) { super(c) }

  @observable breadcrumb: IBreadcrumb[]

  /**
   * 隐藏底部版权信息，主要是为了扩大工作区间
   */
  @observable hideFooter: boolean = false
  /**
   * 使用窄版的侧边栏，和 hideFooter 一样，主要是为了扩大工作区间
   */
  @observable collapseAside: boolean = false

  api = createAdminApi(
    // inject
    (http) => this.user.isSigned && (http.headers.Authorization = 'Bearer ' + this.user.token),

    // http 返回 401，跳转到登录页去
    () => this.signOut()
  )

  @autobind toggleFooter() {
    this.hideFooter = !this.hideFooter
  }

  @autobind toggleAside() {
    this.collapseAside = !this.collapseAside
  }
}

export interface IAppComponentProps {
  app?: AdminApp
}

export * from 'mobx'
export * from 'mobx-react'
