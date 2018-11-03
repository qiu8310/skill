import * as React from 'react'
import {Spin, message} from 'antd'
import {autobind, delay} from 'mora-common'
import {SpinProps} from 'antd/es/spin/'

import { RouteComponentProps } from 'react-router'

import {renderForm, IFormItem, IFormRenderOptions} from '../base/form'

export abstract class Component<P> extends React.PureComponent<P, any> {
  state: any = {loading: false}

  renderForm(formItems: IFormItem[], options?: IFormRenderOptions): React.ReactNode {
    return renderForm(formItems, options, this)
  }

  getNullableState(key) { return this.state[key] }

  get loading() {
    return this.state.loading
  }
  @autobind doLoading(data: any = {}, cb?: () => void) {
    this.setState({...data, loading: true}, cb)
  }
  @autobind doneLoading(data: any = {}, cb?: () => void) {
    this.setState({...data, loading: false}, cb)
  }
  renderLoading(spinProps: SpinProps = {}) {
    return <div style={{textAlign: 'center', padding: '40px 0'}}><Spin {...spinProps} /></div>
  }
}

export interface IRelocationOptions {
  delay?: number
  message?: React.ReactNode
  messageType?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'loading'
}
export abstract class RouteComponent<P extends RouteComponentProps<any>> extends Component<P> {
  params = this.props.match.params
  gotoLink(path, opts: IRelocationOptions = {}): void {
    if (opts.message) message[opts.messageType || 'success'](opts.message)
    delay(() => this.props.history.push(path), opts.delay)
  }
  goBack(opts: IRelocationOptions = {}): void {
    if (opts.message) message[opts.messageType || 'success'](opts.message)
    delay(() => this.props.history.goBack(), opts.delay)
  }
}
