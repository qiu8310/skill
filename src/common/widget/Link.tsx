import * as React from 'react'
import {inject} from 'mobx-react'
import {Link as RouterLink, LinkProps} from 'react-router-dom'
import {MobxApp} from '../MobxApp'

export interface ILinkProps extends LinkProps {
  /**
   * 只有 history.back 的时候 widget/Page 组件才会恢复上次访问的位置
   *
   * Link 到的新组件在默认情况下总会 scrollToTop，所以可以通过将 fakeBack 设置成 true，来伪造浏览器 history.back 的效果
   */
  fakeBack?: boolean
}

@inject('app')
export class Link extends React.Component<ILinkProps & {app?: MobxApp}, any> {
  onClick = (e: any) => {
    this.props.app.isHistoryBack = this.props.fakeBack ? true : (0 as any)
    if (this.props.onClick) return this.props.onClick(e)
  }

  render() {
    let {fakeBack, app, ...props} = this.props
    return <RouterLink {...props} onClick={this.onClick} />
  }
}
