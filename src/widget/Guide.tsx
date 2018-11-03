import * as React from 'react'
import {onview} from 'mora-common/dom/onview'
import {autobind} from 'mora-common/util/autobind'
import {Render} from 'mora-common/widget/Render'

import './styles/Guide.scss'

export type IGuideElement = () => Element
export interface IGuide {
  debounce?: number
  gap?: number
  element: Element | IGuideElement
  close?: boolean | JSX.Element
  closeOnMask?: boolean
  enableScroll?: boolean

  bottom?: JSX.Element
  top?: JSX.Element
}

export default class Guide extends React.PureComponent<IGuide, any> {
  static defaultProps = {
    close: true,
    gap: 4,
    debounce: 500
  }
  root: HTMLDivElement
  offEvents: any
  destroied = false

  state = {
    closed: false
  }

  element: HTMLElement
  elementTop: HTMLElement
  elementBottom: HTMLElement

  getElements() {
    let {element} = this.props
    this.element = (typeof element === 'function' ? element() : element) as any
    this.elementTop = this.root.querySelector('.top') as any
    this.elementBottom = this.root.querySelector('.bottom') as any
  }

  @autobind apply() {
    let {element, root, props: {gap}} = this
    if (!root) return
    if (!element) {
      this.getElements() // 尝试重新获取
      element = this.element
      if (!element) return
    }

    let r = element.getBoundingClientRect()
    let radius = Math.round(Math.max(r.width, r.height) / 2) + gap
    let x = Math.round(r.width / 2 + r.left)
    let y = Math.round(r.height / 2 + r.top)

    let bg = `radial-gradient(${radius}px at ${x}px ${y}px, transparent 0, transparent ${radius}px, rgba(0, 0, 0, .7) ${radius + 1}px)`
    root.style.cssText = `background: -webkit-${bg}; background: ${bg}`
    this.elementTop.style.bottom = document.documentElement.clientHeight - (y - radius) + 'px'
    this.elementBottom.style.top = y + radius + 'px'
  }

  destroy() {
    if (!this.destroied) {
      this.offEvents()
    }
  }

  componentDidMount() {
    let offview = onview(this.apply, {debounce: this.props.debounce})
    let prevent = e => e.preventDefault()
    if (!this.props.enableScroll) {
      document.addEventListener('touchstart', prevent)
      document.addEventListener('touchmove', prevent)
    }
    this.offEvents = () => {
      offview()
      if (!this.props.enableScroll) {
        document.removeEventListener('touchstart', prevent)
        document.removeEventListener('touchmove', prevent)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.destroied) this.apply()
  }

  componentWillUnmount() {
    this.destroy()
  }

  @autobind onClose() {
    this.setState({closed: true})
    this.destroy()
  }

  render() {
    if (this.state.closed) return null

    let {close, closeOnMask, bottom, children, top} = this.props
    if (close) {
      if (typeof close !== 'boolean') close = React.cloneElement(close, {onClick: this.onClose})
      else close = <a className='close' onClick={this.onClose} />
    }

    return (
      <Render>
        <div ref={e => this.root = e} className='wGuide' onClick={closeOnMask ? this.onClose : null}>
          <div className='child top'>{top}</div>
          <div className='child bottom'>{children || bottom}</div>
          {close}
        </div>
      </Render>
    )
  }
}
