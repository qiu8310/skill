import {React, Component, createForm, IFormItems} from 'admin/'
import {Switch} from 'antd'
import {inject} from 'mobx-react'
import {IAppComponentProps} from 'mobx/AdminApp'
import {IFormComponentProps} from 'admin/base/interface'

@createForm()
@inject('app')
export default class Setting extends Component<IAppComponentProps & IFormComponentProps> {
  get formItems(): IFormItems {
    let {toggleAside, toggleFooter} = this.props.app
    return [
      {key: 'collapseAside', label: '窄侧边栏', isCheck: true, component: <Switch onChange={toggleAside} />},
      {key: 'hideFooter', label: '隐藏底部', isCheck: true, component: <Switch onChange={toggleFooter} />}
    ]
  }

  render() {
    let {collapseAside, hideFooter} = this.props.app
    return (
      <div className='Setting'>
        {this.renderForm(
          this.formItems,
          {
            footer: false,
            data: {collapseAside, hideFooter},
            layout: {labelCol: {span: 8}, wrapperCol: {span: 14}}}
        )}
      </div>
    )
  }
}
