import * as React from 'react'
import {classSet, gcd} from 'mora-common'
import {message, Icon, Upload, Modal, Input, Tooltip} from 'antd'
import {AdminConfig} from 'mobx/Config'

import './styles/Uploader.scss'

const M = 1024 * 1024

export interface IUploaderProps {
  // 是否允许用户直接输入 url
  disallowInpput?: boolean
  type?: 'all' | 'image' | 'video'
  accept?: string
  value?: string
  valueMap?: (value: string) => string
  onChange?: (value: string) => void
  getPreview?: (value: string) => JSX.Element

  maxFileSize?: number
  text?: string
  hint?: string

  style?: React.CSSProperties
  className?: string
  width: number
  height: number
}

export class Uploader extends React.PureComponent<IUploaderProps, any> {
  static defaultProps = {
    type: 'image',
    // text: '点击或将文件拖拽到这里上传',
    valueMap: v => v
  }

  state = {
    inputModal: false,
    inputValue: '',
    value: ''
  }

  get hint() {
    let {maxFileSize, hint, type, width, height} = this.props
    let msg = ''
    if (hint != null) return hint
    if (maxFileSize) msg = '大小不超过' + formatSize(maxFileSize)
    if (type === 'image' && width && height) {
      let [w, h] = minRate(width, height)
      return `图片比例为 ${w}:${h}` + (msg ? ',' + msg : '')
    }
    return msg ? '文件' + msg : ''
  }

  get accept() {
    let {type, accept} = this.props
    if (accept) return accept

    if (type === 'image') return 'image/*'
    else if (type === 'video') return 'video/mp4' // 大部分浏览器都支持 mp4 视频
  }

  get value() {
    return this.state.value || this.props.value || ''
  }

  get preview() {
    let {type, getPreview} = this.props
    let {value} = this
    if (!value) return
    if (getPreview) return getPreview(value)

    if (type === 'image') {
      return <div className='imagePreview preview full' style={{
        backgroundImage: `url(${value})`
      }} />
    } else if (type === 'video') {
      return <div className='videoPreview preview full'>
        <video
          controls
          ref='video'
          preload='auto'
          className='video full'
          src={value}
        />
      </div>
    }
  }

  get uploaderProps() {
    let {onChange, valueMap, text, type, maxFileSize} = this.props
    let {hint} = this

    return {
      name: 'file',
      multiple: false,
      accept: this.accept,
      data: {type},
      action: AdminConfig.uploader,
      showUploadList: false,
      beforeUpload: (file) => {
        // 本地做些简单验证
        if (type !== 'all' && file.type.indexOf(type) !== 0) {
          message.error('上传文件的格式不支持')
          return false
        }
        if (maxFileSize && file.size > maxFileSize) {
          message.error(`上传文件过大，不就超过 ${formatSize(maxFileSize)}`)
          return false
        }
      },
      onChange: (info) => {
        const {file = {} as any} = info
        const {status, response = {} as any} = file as any

        if (status === 'done') {
          if (response.error) {
            let {error} = response.error
            message.error(typeof error === 'object' ? error.message : error)
          } else {
            message.success(`${file.name} 上传成功.`)
            let value = valueMap(response.url)
            this.setState({value})
            if (onChange) onChange(value)
          }
        } else if (status === 'error') {
          message.error(`${file.name} 上传失败.`)
        }
      },
      children: <div className='uploadTip'>
        <Icon type='inbox' style={{fontSize: '3em', color: '#0074D9'}} />
        {text && <p className='ant-upload-text'>{text}</p>}
        {hint && <p className='ant-upload-hint'>{hint}</p>}
      </div>
    }
  }

  render() {
    let {style = {}, className, width, height, disallowInpput, onChange} = this.props
    let {inputModal, inputValue, value} = this.state
    if (width) style.width = width
    if (height) style.height = height

    let closeModal = () => this.setState({inputModal: false})

    return (
      <div className={classSet('wUploader', className, {hasPreview: !!this.preview})} style={style}>
        {this.preview}
        <div className='upload full'>
          {!disallowInpput && <a className='pen' onClick={() => this.setState({inputModal: true, inputValue: value})}><Tooltip title='手动输入链接地址'><Icon type='edit' /></Tooltip></a>}
          <Upload.Dragger {...this.uploaderProps} />
        </div>
        <Modal
          title='请输入链接地址'
          visible={inputModal}
          onOk={() => {
            closeModal()
            this.setState({value: inputValue})
            if (onChange) onChange(inputValue)
          }}
          onCancel={closeModal}
        >
          <Input placeholder='链接地址' value={inputValue} onChange={(e: any) => this.setState({inputValue: e.target.value})} />
        </Modal>
      </div>
    )
  }
}

function formatSize(value) {
  if (value < 1024) return value + 'B'
  if (value < M) return Math.round(value / 1024) + 'KB'
  else return Math.round(value / M) + 'M'
}

function minRate(a: number, b: number) {
  let c = gcd(a, b)
  return [a / c, b / c]
}
