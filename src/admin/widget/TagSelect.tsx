import * as React from 'react'
import {AutoComplete, Tag, Input} from 'antd'
import {debounce} from 'mora-common'
import {inject} from 'mobx-react'

interface ITag {
  id: number
  name: string
}
interface IState {
  loading: boolean
  tags: ITag[]
  value: ITag[]
}

@inject('app')
export class TagSelect extends React.PureComponent<any, IState> {
  root: HTMLDivElement
  state: IState = {
    loading: false,
    tags: [],
    value: this.props.value || []
  }

  onClose = (v: ITag) => {
    let value = this.state.value.filter(i => i !== v)
    this.setState({value})
    if (this.props.onChange) this.props.onChange(value)
  }

  onSelect = (v: string) => {
    let tag = this.state.tags.find(t => t.name === v)
    if (tag) this.addItem(tag.id, tag.name)
  }

  onEnter = (e) => {
    e.stopPropagation()
    e.preventDefault()
    let name: string = e.target.value
    if (!name) return

    if (!this.state.tags.find(t => t.name.indexOf(name) >= 0)) {
      this.props.app.api.addTag({name})
        .then(id => this.addItem(id, name))
    }
  }

  onSearch = debounce(keyword => {
    this.setState({loading: true})
    if (keyword) {
      this.props.app.api.getTagList({keyword})
        .then(({items: tags}) => this.setState({tags, loading: false}))
    }
  }, 600)

  addItem(id: number, name: string) {
    let {onChange} = this.props
    if (this.state.value.find(v => v.id === id || v.name === name)) return
    let value = [...this.state.value, {id, name}]
    if (onChange) onChange(value)
    this.setState({value})
  }

  componentWillMount() {
    this.onSearch('')
  }

  render() {
    let {value, tags} = this.state
    return (
      <div ref={e => this.root = e}>
        <AutoComplete size='large' dataSource={tags.map(t => t.name)} onSelect={this.onSelect} onSearch={this.onSearch}>
          <Input size='large' onPressEnter={this.onEnter} />
        </AutoComplete>
        <div style={{marginTop: 8}}>{value.map(v => <Tag closable onClose={() => this.onClose(v)} key={v.id} children={v.name} />)}</div>
      </div>
    )
  }
}
