import * as React from 'react'
import {Input} from 'antd'
import {InputProps} from 'antd/es/input/Input'
import {IndexConfig} from 'mobx/Config'

import './styles/Editor.scss'

const CKEDITOR = (window as any).CKEDITOR

export interface IEditorProps {
  /** CKEditor 的配置 */
  config?: any
  /** 是否是在安全域下，是的话就允许任何的 content，否则会用 CKEDITOR 过滤器过滤掉不安全的内容 */
  safe?: boolean
  mode?: 'replace' | 'inline'
  onChange?: (newValue: string) => void
}

export class Editor extends React.Component<InputProps & IEditorProps, any> {
  static defaultProps = {
    config: {},
    safe: false,
    mode: 'inline'
  }

  /** Editor 可能会异步收到初始化的 value，所以只要没有 polluted，都可以调用 editor.setData */
  private polluted: boolean = false
  root: HTMLDivElement
  editor: any

  getValue() {
    return this.editor.getData()
  }
  componentDidMount() {
    this.setup()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.polluted
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && !this.polluted) this.editor.setData(nextProps.value)
  }

  componentWillUnmount() {
    this.teardown()
  }

  private setup() {
    let textarea: HTMLTextAreaElement = this.root.querySelector('textarea')
    let {config, safe, mode, onChange} = this.props
    if (typeof CKEDITOR === 'undefined') return console.error('没有加载 CKEDITOR 脚本')

    config.allowedContent = safe ? true : null
    config.imageUploadUrl = IndexConfig.uploader // http://docs.ckeditor.com/#!/guide/dev_file_upload
    config.filebrowserUploadUrl = IndexConfig.uploader // http://docs.ckeditor.com/#!/guide/dev_file_browser_api

    this.editor = CKEDITOR[mode](textarea, config)

    this.editor.on('change', e => {
      this.polluted = true
      let value = this.getValue()
      if (onChange) onChange(value)
    })
  }

  private teardown() {
    this.editor.destroy()
    this.editor = null
  }

  render() {
    let {config, safe, mode, ...props} = this.props
    return (
      <div className='wEditor ck' ref={e => this.root = e}>
        <Input {...props} type='textarea' />
      </div>
    )
  }
}
