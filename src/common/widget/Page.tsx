import {inject} from 'mobx-react'
import * as React from 'react'

import {Page as CommonPage, IPageProps as ICommonPageProps, ScrollRestore, ScrollToTop} from 'mora-common'
import {MobxApp} from '../MobxApp'

export interface IPageProps extends ICommonPageProps {
  scrollToTop?: boolean
  scrollRestore?: boolean

  /**
   * 有时某个页面可能需要先异步加载数据，在加载时，页面还没有高度，只有页面加载完后才需要恢复高度
   * 所以可以先将 scroll 设置为 false，等到数据加载完后再将 scroll 设置为 true
   */
  scroll?: boolean
}

@inject('app')
export class Page extends React.PureComponent<IPageProps & {app?: MobxApp}, any> {
  static defaultProps = {
    scrollToTop: true,
    scroll: true
  }

  componentWillMount() {
    const {name, app} = this.props
    if (!app.rp[name]) {
      console.warn(`Page 中指定的 name="${name}" 在路由 rp 中不存在`)
    } else {
      if (app.rp[name].auth && !app.user.isSigned) {
        app.replaceLink(app.config.signinLink)
      }
    }
  }

  render() {
    let {name, title, className, children, scrollToTop, scrollRestore, scroll, app} = this.props
    if (scrollRestore) {
      let {pathname, search} = app.location
      children = <ScrollRestore children={children} scroll={scroll && app.isHistoryBack} id={pathname + search} />
    } else if (scrollToTop) {
      children = <ScrollToTop children={children} scroll={scroll} />
    }
    return <CommonPage name={name} title={title} className={className} children={children} />
  }
}
