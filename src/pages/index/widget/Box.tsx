/**
 * Create by Mora at 2017-11-09 13:42
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet} from 'mora-common'

import './styles/Box.scss'
//#endregion

export interface IBoxProps {
  title: string
  className?: string
  style?: React.CSSProperties
}

export class Box extends React.PureComponent<IBoxProps, any> {
  render() {
    let {className, style, title, children} = this.props
    return (
      <div className={classSet('wBox', className)} style={style}>
        <div className='wBox-head'>{title}</div>
        <div className='wBox-body gClearfix'>{children}</div>
      </div>
    )
  }
}
