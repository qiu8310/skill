import { observable } from 'mobx'
import {History} from 'history'

import {CustomStorage, getLocation, autobind, once, buildSearch} from 'mora-common'

import {IConfig} from 'global'
import {User, IUserJSONData} from './lib/MobxUser'
import {Mobx} from './lib/Mobx'
import {RoutePage} from './lib/RoutePage'
import {IParseComponentsOptions, parseComponents} from './lib/parseComponents'

export interface MobxApp {
  storeKey: string
  serializableKeys: string[]
  rp: {[key: string]: RoutePage<any>}
}

export abstract class MobxApp extends Mobx {
  // 下面两个值在 common/App 下会被初始化
  public history: History
  public components: IParseComponentsOptions

  @observable user: User = new User()
  store = new CustomStorage()

  /**
   * 是否是回退（包括 app.goBack 和 浏览器的回退），需要配合 common/widget/Link 一起使用
   *
   * 0 是给 common/widget/Link 用的，用于标识是通过点击 Link 跳转的，在 common/App 会把它重置为 boolean
   */
  isHistoryBack: boolean = false

  constructor(public config: IConfig) {
    super()
  }

  /**
   * 自动将指定的键名在 serializableKeys 中的属性保存在 localStorage 中，并可在下次启动时自动恢复
   *
   * 默认时会自动在 common/App.tsx 中被调用，不用在其它地方调用
   *
   * 注意：需要手动调用，不要放到 constructor 自动执行
   *      放到 constructor 中，会获取不到子类直接设置的 storeKey，但可以获取到通过 get property 函数设置的值
   *      但还有另一个问题是，由于先初始化父类，再初始化子类，所以也会导致子类的默认值覆盖了从 store 中取出的值
   */
  sync = once(() => {
    if (this.storeKey) {
      this.fromJSON({...this.store.get(this.storeKey, {}), ...this.user.toJSON()})
      window.addEventListener('unload', e => {
        this.save2store()
      })
    }

    const {token, ...query} = this.location.nativeQuery
    if (token && token.length > 10) {
      if (this.user.token !== token) {
        this.user.fromJSON({token})
        this.save2store()
      }
      location.href = location.pathname + buildSearch(query) + location.hash
    }
  })

  /**
   * this.rp 中的 RoutePage 在初始状态写都没有 component 或 render，需要需要用此方法给其初始化
   *
   * 默认时会自动在 common/App.tsx 中被调用，初始化 rootRoutes
   *
   * 注意：不在 rp 中初始化 component 或 render 主要是为了避免循环依赖
   */
  assignrp = (opts: IParseComponentsOptions) => {
    let {rp} = this
    if (!rp) return
    let map = parseComponents(opts)
    Object.keys(map).forEach(k => {
      if (rp.hasOwnProperty(k) && !rp.component && !rp.render) {
        rp[k].key = k
        rp[k].component = map[k]
      }
    })
  }

  protected save2store() {
    if (this.storeKey) {
      this.store.set(this.storeKey, this.toJSON())
    }
  }

  @autobind signOut() {
    this.user.token = ''
    this.user.name = ''
    this.user.avatar = ''

    let {pathname, search, hash} = this.location
    let {signinLink, homeLink} = this.config
    let returnUrl = pathname === signinLink  ? homeLink : pathname + search + hash
    this.gotoLink(signinLink, {returnUrl})
  }

  @autobind signIn(data: IUserJSONData) {
    this.user.fromJSON(data)
    this.backtoReturnUrl()
  }

  /** 另外也可以用 this.history.location 来获取 react-router 的 location */
  get location() { return getLocation({hash: this.config.hash}) }

  @autobind getHref(url: string) {
    return (this.config.hash ? '#' : '') + url
  }

  @autobind gotoLink(url: string, state?: any) {
    this.isHistoryBack = 0 as any
    if (/^https?:\/\//.test(url)) {
      location.href = url
    } else {
      this.history.push(url, state)
    }
  }

  @autobind replaceLink(url: string, state?: any) {
    this.isHistoryBack = 0 as any
    if (/^https?:\/\//.test(url)) {
      location.replace(url)
    } else {
      this.history.replace(url, state)
    }
  }

  @autobind goBack() {
    // 默认就是 isHistoryBack = true，需要这里不用记录
    this.history.goBack()
  }

  @autobind backtoReturnUrl(fallbackUrl = this.config.homeLink) {
    let locState: any = this.history.location.state || {}
    let returnUrl = locState.returnUrl || this.location.query.returnUrl || this.location.nativeQuery.returnUrl || fallbackUrl
    this.replaceLink(returnUrl)
  }
}
