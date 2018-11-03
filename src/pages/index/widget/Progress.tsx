/**
 * Create by Mora at 2017-10-18 17:04
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet, between} from 'mora-common'

import './styles/Progress.scss'
//#endregion

export interface IProgressProps {
  className?: string
  style?: React.CSSProperties
  hideText?: boolean
  disabled?: boolean
  min?: number
  max?: number
  value?: number
  onChange?: (value: number) => void
}

export class Progress extends React.PureComponent<IProgressProps, any> {
  static defaultProps = {
    min: 0,
    max: 100,
  }

  road: HTMLDivElement

  state = {
    value: this.props.value || 0
  }

  onChange = (value) => {
    const {onChange, min, max} = this.props
    value = between(value, min, max)
    if (onChange) {
      onChange(value)
    }
    this.setState({value})
  }

  onClickRoad = (e: React.MouseEvent<HTMLDivElement>) => {
    const {min, max} = this.props
    let r = this.road.getBoundingClientRect()
    this.onChange(Math.round((e.clientX - r.left) * (max - min) / (r.right - r.left)))
  }

  startX: number = null
  value: number = null
  touchStart = (e: React.TouchEvent<any>) => {
    this.startX = e.touches[0].clientX
    this.value = this.state.value
  }
  touchMove = e => {
    if (this.startX == null) return
    const {min, max} = this.props
    let r = this.road.getBoundingClientRect()
    let deltaX = e.touches[0].clientX - this.startX
    this.onChange(this.value + Math.round(deltaX * (max - min) / (r.right - r.left)))
  }
  touchEnd = e => {
    this.startX = null
    this.value = null
  }

  render() {
    const {className, style, hideText, disabled, max, min} = this.props
    let {value} = this.state

    return (
      <div className={classSet('wProgress gFlexContainer', className)} style={style}>
        {hideText ? null : <span className='l'>低</span>}
        <div className='road gFlex' ref={e => this.road = e} onClick={disabled ? null : this.onClickRoad}>
          <div className='value' style={{width: ((max - value) * 100 / (max - min)) + '%'}}>
          <i
            className='cursor'
            onTouchStart={disabled ? null : this.touchStart}
            onTouchMove={disabled ? null : this.touchMove}
            onTouchEnd={disabled ? null : this.touchEnd}
          />
          </div>
        </div>
        {hideText ? null : <span className='l'>高</span>}
      </div>
    )
  }
}
