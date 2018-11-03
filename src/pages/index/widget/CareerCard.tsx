/**
 * Create by Mora at 2017-10-17 16:29
 * All right reserved
 */

//#region
import * as React from 'react'
import {Link} from 'react-router-dom'
import {classSet, Image} from 'mora-common'
import {inject, IAppComponentProps} from 'mobx/IndexApp'
import {ISliderInjectProps} from 'widget/Slider'

import './styles/CareerCard.scss'
//#endregion

export interface ICareerCardProps {
  className?: string
  style?: React.CSSProperties
  hero?: boolean
  noLink?: boolean
  career: {
    id: number
    nameZh: string
    nameEn: string
    icon: string
  }
}

@inject('app')
export class CareerCard extends React.PureComponent<ICareerCardProps & IAppComponentProps & ISliderInjectProps, any> {
  size = p2r(this.props.hero ? 375 : 330)
  state = {img: null}

  componentDidMount() {
    const {career: {icon}, getViewer} = this.props
    this.setState({img: <Image src={icon + '?imageslim'} fade={false} square={this.size} noCacheContainer container={getViewer} />})
  }

  render() {
    let {img} = this.state
    let {app, className, style = {}, hero, career: {id, nameEn, nameZh}, noLink} = this.props

    style = {...style, width: this.size, height: this.size}
    return (
      <Link to={app.rp.Career.link({params: {careerId: id}})} className={classSet('wCareerCard', className, {['wCareerCard-hero']: hero, noLink})} style={style}>
        {img}
        <div className='bottom'>
          <p className='nameZh gEllipsis'>{nameZh}</p>
          <p className='nameEn gEllipsis'>{nameEn}</p>
        </div>
      </Link>
    )
  }
}
