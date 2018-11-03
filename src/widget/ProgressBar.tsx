/**
 * Create by Mora at 2017-11-27 15:42
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet, between} from 'mora-common'
//#endregion

export interface IProgressBarProps {
  className?: string
  style?: React.CSSProperties

  progress: number

  thickness?: number | string
  round?: boolean
  bgColor?: string
  fgColor: string
}

export class ProgressBar extends React.PureComponent<IProgressBarProps, any> {
  static defaultProps = {
    thickness: 10,
    round: true,
    bgColor: '#EEE',
  }
  bar: HTMLDivElement
  private update() {
    this.bar.style.width = between(this.props.progress, 0, 100) + '%'
  }
  componentDidMount() {
    this.update()
  }
  componentDidUpdate(prevProps: IProgressBarProps, prevState) {
    if (prevProps.progress !== this.props.progress) this.update()
  }

  render() {
    let {className, style, thickness, bgColor, fgColor, round, children} = this.props
    let borderRadius = round ? thickness : 0
    let roadStyle = {
      width: '100%',
      height: thickness,
      background: bgColor,
      borderRadius
    }
    let barStyle = {
      width: '0%',
      borderRadius,
      height: thickness,
      background: fgColor,
      transition: 'width 1s'
    }

    return (
      <div className={classSet('wProgressBar', className)} style={style}>
        <div className='wProgressBar-road' style={roadStyle}>
          <div ref={e => this.bar = e} className='wProgressBar-bar' style={barStyle} children={children} />
        </div>
      </div>
    )
  }
}
