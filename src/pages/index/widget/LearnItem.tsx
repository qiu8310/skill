/**
 * Create by Mora at 2017-11-13 11:35
 * All right reserved
 */

//#region
import * as React from 'react'
import {Link} from 'react-router-dom'
import {classSet, Image} from 'mora-common'
import {IAppComponentProps, inject} from 'mobx/IndexApp'

import './styles/LearnItem.scss'
//#endregion

export interface ILearnItemProps {
  className?: string
  style?: React.CSSProperties
  data: {
    id: number
    thumbnailPic: string
    title: string
  }
}

@inject('app')
export class LearnItem extends React.PureComponent<ILearnItemProps & IAppComponentProps, any> {
  render() {
    let {className, style, data, app} = this.props
    return (
      <Link to={app.rp.CareerLearnItemV3.link({learnId: data.id})} className={classSet('wLearnItem', className)} style={style}>
        <Image width={p2r(140)} height={p2r(93)} src={data.thumbnailPic} />
        <p>{data.title}</p>
      </Link>
    )
  }
}
