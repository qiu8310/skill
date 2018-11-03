/**
 * Create by Mora at 2017-11-27 14:10
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet} from 'mora-common'

import './styles/Circle.scss'
//#endregion

export interface ICircleProps {
  className?: string
  style?: React.CSSProperties
  /** 圆环 的最外层半径 */
  radius?: number
  /** 圆环 的厚度 */
  thickness?: number

  /** 圆环 的进度 0 - 100 */
  progress: number

  bgColor?: string
  fgColor: string
}

export class Circle extends React.PureComponent<ICircleProps, any> {
  static defaultProps = {
    bgColor: '#EEE',
    radius: 50,
    thickness: 8
  }

  stroke: SVGCircleElement

  componentDidMount() {
    let dashoffset = (100 - this.props.progress) / 100 * 2 * Math.PI * this.props.radius
    this.stroke.getBoundingClientRect() // trigger layout
    this.stroke.style.strokeDashoffset = dashoffset + ''
  }

  render() {
    let { bgColor, fgColor, className, style, children, radius, thickness } = this.props

    let dasharray = 2 * Math.PI * radius
    return (
      <div className={classSet('wCircle', className)} style={style}>
        <div className='wCircle-wrap'>
          <div className='wCircle-inner'>
            <svg className='wCircle-svg' viewBox={`${0 - radius - thickness / 2} ${0 - radius - thickness / 2} ${2 * radius + thickness} ${2 * radius + thickness}`}>
              <circle r={radius} cx='0' cy='0' fill='transparent' stroke={bgColor} strokeWidth={thickness}></circle>
              <circle className='wCircle-stroke' ref={e => this.stroke = e} r={radius} cx='0' cy='0' fill='transparent' stroke={fgColor} strokeWidth={thickness} strokeLinecap='round' strokeDasharray={dasharray} strokeDashoffset={dasharray}></circle>
            </svg>
          </div>
        </div>
        <div className='gHVCenter wCircle-content'>{children}</div>
      </div>
    )
  }
}
