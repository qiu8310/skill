import * as React from 'react'
import {Select as S, Spin} from 'antd'
import {SelectProps} from 'antd/es/select/'
import {inject} from 'mobx-react'

export interface ISelectProps extends SelectProps {
  api?: any
  items?: any[]
  itemIdKey?: string
  itemNameKey?: string
}

@inject('app')
export class Select extends React.PureComponent<ISelectProps, any> {
  static defaultProps = {
    itemIdKey: 'id',
    itemNameKey: 'name'
  }

  state = {items: this.props.items, value: toString(this.props.value)}

  onChange = (value) => {
    this.setState({value})
    let onChange: any = this.props.onChange
    if (onChange) onChange(parseInt(value, 10))
  }

  componentWillMount() {
    let {api: apiFn, app, itemIdKey} = this.props as any
    if (!apiFn) return
    apiFn.call(app.api, {pageSize: 100})
      .then(({items}) => {
        items.forEach(it => it[itemIdKey] = toString(it[itemIdKey]))
        this.setState({items})
      })
  }

  render() {
    let {items, value} = this.state
    let {api, itemNameKey, itemIdKey, ...rest} = this.props
    if (!items) return <Spin size='small' />
    return (
      <S disabled={items === null} {...rest} value={value} onChange={this.onChange}>
        {items.map(it => <S.Option key={it[itemIdKey]} value={it[itemIdKey] + ''} children={it[itemNameKey]} />)}
      </S>
    )
  }
}

function toString(it) {
  if (!it) return it
  if (Array.isArray(it)) return it.map(toString)
  return it + ''
}
