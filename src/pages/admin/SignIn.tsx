import * as React from 'react'

import {IPageProps} from 'admin/'
import {Page} from 'mora-common'
import { Form, Button, Input, message } from 'antd'
import {observer} from 'mobx/AdminApp'
let FormItem = Form.Item

import './styles/SignIn.scss'

@observer
export default class SignIn extends React.PureComponent<IPageProps, any> {
  app = this.props.app
  user = this.app.user
  state = { loading: false }

  componentDidMount() {
    if (this.user.isSigned) this.app.backtoReturnUrl()
  }

  onSubmit(data) {
    let {account, password} = data

    this.setState({loading: true})
    this.user.account = account
    this.app.api.signIn({username: account, password})
      .then(({token}) => {
        message.success('登录成功')
        this.app.signIn({name: account, account, token, avatar: ''})
      })
      .catch(() => this.setState({loading: false}))
  }

  render() {
    let { form: {getFieldDecorator}, app: {config} } = this.props
    let { loading } = this.state
    let layout = {labelCol: { span: 6 }, wrapperCol: { span: 14 }}

    return (
      <Page name='SignIn' title='登录' className='gHVCenterChildren gFullHeight'>
        <div className='box'>
          <h1 className='h1'>登录 {config.appName} 管理系统</h1>
          <Form onSubmit={this.onSubmit}>

            <FormItem {...layout} label='用户名' >
              {getFieldDecorator('account', {
                initialValue: this.user.account,
                rules: [{ required: true, message: '请填写用户名' }],
                validateTrigger: 'onBlur'
              })(
                <Input placeholder='请输入用户名' />
              )}
            </FormItem>

            <FormItem {...layout} label='密码'>
              {getFieldDecorator('password', {
                initialValue: __DEV__ ? 'l0@&@se&jLJEAfUd' : '',
                rules: [{ required: true, message: '请填写密码' }],
                validateTrigger: 'onBlur'
              })(
                <Input type='password' placeholder='请输入用密码' />
              )}
            </FormItem>

            <FormItem wrapperCol={{span: layout.wrapperCol.span, offset: layout.labelCol.span}}>
              <Button type='primary' htmlType='submit' loading={loading}>{loading ? '登录中...' : '登录'}</Button>
            </FormItem>
          </Form>
        </div>
      </Page>
    )
  }
}
