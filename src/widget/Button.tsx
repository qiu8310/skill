import * as React from 'react'
import {Link} from 'react-router-dom'
import {classSet} from 'mora-common'

import './styles/Button.scss'

export declare type IButtonTypeProp = 'normal' | 'reverse' | 'gray' | 'light' | 'disabled'
export interface IButtonProps extends React.HTMLProps<HTMLAnchorElement & HTMLButtonElement> {
  htmlType?: string
  type?: IButtonTypeProp
  /** 包括 border 的宽度 */
  width: number
  /** 包括 border 的高度 */
  height: number
  center?: boolean
  activeColor?: string
  to?: string
}

export class Button extends React.PureComponent<IButtonProps, any> {
  static defaultProps = {
    type: 'normal',
    activeColor: require(SCSS_CONFIG_FILE).activeColor
  }

  render() {
    let {type, disabled, htmlType, width, height, center, activeColor, className, to, style = {}, ...rest} = this.props

    let backgroundColor = activeColor
    let color = 'white'
    let borderColor = 'transparent'

    if (disabled) {
      type = 'disabled'
      delete style.backgroundColor
      delete style.color
    }

    switch (type) {
      case 'reverse': [backgroundColor, color, borderColor] = ['white', activeColor, activeColor]; break
      case 'gray': [backgroundColor, color] = ['#E6E6E6', '#999']; break
      case 'light': [backgroundColor, color] = ['#F1F1F1', '#CCC']; break
      case 'disabled': [backgroundColor, color] = ['#CCC', '#FFF']; break
    }

    let defaultStyle: React.CSSProperties = {width: p2r(width), height: p2r(height), lineHeight: p2r(height - 2), backgroundColor, color, borderColor}
    if (type === 'disabled') defaultStyle.pointerEvents = 'none'

    let el: any = htmlType ? 'button' : to ? Link : 'a'
    let props: any = {
      className: classSet('wButton', className, center && 'gCenter'),
      style: {...defaultStyle, ...style},
      ...rest
    }

    if (htmlType) props.type = htmlType
    if (to) props.to = to

    return React.createElement(el, props)
  }
}

