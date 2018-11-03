import * as React from 'react'

import {RouteComponentProps} from 'react-router'
import {shallowEqual} from 'mora-common'
import {MobxApp} from '../MobxApp'

export class RawPageComponent<App extends MobxApp, P, S> extends React.Component<{app?: App} & P, S> {
  app = this.props.app
  config = this.app.config

  // 这样写不会有语法提示，所以还是子类里自己写吧
  // rp = this.app.rp
  // api = this.app.rp

  // 使用 PureComponent 和 mobx 的 observer 会导致 react 报错（因为 observer 的 Component 会实现 shouldComponentUpdate 方法）
  // 当在 PureComponent 中再实现自己的 shouldComponentUpdate 方法时，react 16 会报错
  shouldComponentUpdate(nextProps, nextState) {
    return !(shallowEqual(nextProps, this.props) && shallowEqual(nextState, this.state))
  }
}


export class BasePageComponent<App extends MobxApp, P, S> extends RawPageComponent<App, RouteComponentProps<P>, S> {
  params = this.props.match.params
}
