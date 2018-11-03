import * as React from 'react'
import {Form, Input, Button} from 'antd'
const FormItem = Form.Item
import {FormProps, FormComponentProps, FormCreateOption} from 'antd/es/form/Form'

const DEFAULT_FORM_ITEM_LAYOUT: IFormItemLayout = { labelCol: {span: 5}, wrapperCol: {span: 14} }

export interface IFormItem {
  key: string
  label?: string
  hidden?: boolean

  /** 是否是必须字段，是的话可以指定如果没填是报的错误提示 */
  required?: boolean | string
  /** true 时，纯空格是否会被视为错误 */
  whitespace?: boolean
  isCheck?: boolean
  component?: any
  getComponent?: () => any
  props?: any
  extra?: React.ReactNode
}
export interface IFromItemLayoutCol { span?: number, offset?: number }
export interface IFormItemLayout { labelCol?: IFromItemLayoutCol, wrapperCol?: IFromItemLayoutCol }

export interface IFormRenderOptions {
  data?: {[key: string]: any}
  layout?: boolean | IFormItemLayout
  formProps?: FormProps

  /** 是否用 <Form> 包裹 formItems */
  wrap?: boolean

  /** 是否在 formItems 后加上提交按钮，或者指定自定义的 footer */
  footer?: boolean | React.ReactNode
  footerButtonText?: string | React.ReactNode
}

export type IFormRender = (formItems: IFormItem[], options?: IFormRenderOptions) => React.ReactNode

export function renderForm(formItems: IFormItem[], options: IFormRenderOptions = {}, context: any = null): React.ReactNode {
  context = context || this
  let {form: {getFieldDecorator}} = context.props as FormComponentProps
  let {data = {}, layout = DEFAULT_FORM_ITEM_LAYOUT, formProps = {}, wrap = true, footer = true, footerButtonText = '提交'} = options

  let nodes = formItems
    .filter(item => !item.hidden)
    .map(item => {
      let props = item.props || {}
      if (item.required) {
        props.rules = props.rules || []
        // CheckboxGroup 使用 whitespace 就总会报错
        if (item.component.type === Input) {
          let whitespace = ('whitespace' in item) ? item.whitespace : item.component.type === Input
          props.rules.unshift({required: true, whitespace, message: typeof item.required === 'string' ? item.required : '此字段不能为空'})
        } else {
          props.rules.unshift({required: true, message: typeof item.required === 'string' ? item.required : '此字段不能为空'})
        }
      }

      if (item.isCheck && !(item.key in data)) {
        data[item.key] = false // 如果不指定默认的值，到到的是 undefined
      }

      let desc = getFieldDecorator(
        item.key,
        {initialValue: data[item.key], valuePropName: item.isCheck ? 'checked' : 'value', ...props}
      )(item.component || item.getComponent())

      return (
        <FormItem className={item.key + 'FormItem'} {...layout} key={item.key} label={item.label}>
          {desc}
          {item.extra}
        </FormItem>
      )
    })

  if (footer === true) {
    let loading = context.state && context.state.loading
    if (typeof layout !== 'object') layout = {}
    let wrapperCol = layout.wrapperCol && layout.labelCol ? {span: layout.wrapperCol.span, offset: layout.labelCol.span} : null
    footer = <FormItem key='__footer' wrapperCol={wrapperCol}>
      <Button type='primary' size='large' htmlType='submit' loading={loading}>{footerButtonText + (loading ? '中...' : '')}</Button>
    </FormItem>
  } else if (footer) {
    footer = React.cloneElement(footer as any, {key: '__footer'})
  }

  if (footer) nodes.push(footer as any)

  if (wrap) {
    return <Form onSubmit={context.onSubmit || context.props.onSubmit} {...formProps}>{nodes}</Form>
  }
  return nodes
}

export function createForm(formCreateOption?: FormCreateOption<any>): any {
  return (Component) => {
    let C: any = class extends Component {
      onSubmit = (e) => {
        e.preventDefault()
        let {form, onSubmit} = this.props

        form.validateFieldsAndScroll((errors, data) => {
          if (errors) return
          let prom
          if (super.onSubmit) {
            prom = super.onSubmit(data)
          } else if (onSubmit) {
            prom = onSubmit(data)
          } else {
            console.warn(Component.name + ' 没有实现 onSubmit 方法')
          }
          if (prom && prom.then) {
            this.setState({loading: true})
            let done = () => this.setState({loading: false})
            prom.then(done, done)
          }
        })
      }
    }

    return Form.create(formCreateOption)(C)
  }
}

