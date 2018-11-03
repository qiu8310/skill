import * as React from 'react'
import {RouteProps} from 'react-router-dom'
import {TransitionRoute, classSet, Fixed} from 'mora-common'
import {RoutePage} from '../lib/RoutePage'
import {Link} from './Link'

import './styles/TransitionRoutePage.scss'

interface ITransitionRoutePageProps {
  pages: Array<RoutePage<{}>>
}

export class TransitionRoutePage extends React.Component<ITransitionRoutePageProps> {
  pages = this.props.pages
  routeProps = this.pages.map(p => p.routeProps)

  tabbar = (activeRouteProps: RouteProps) => {
    const {pages, routeProps} = this
    const activeIndex = routeProps.indexOf(activeRouteProps)

    return (
      <Fixed holder height={70}>
        <div className='weui-tabbar'>
          {pages.filter(p => p.extra).map((p, i) => (
            <Link key={i} to={p.link()} className={classSet('weui-tabbar__item', {'weui-bar__item_on': activeIndex === i})}>
              <span className='weui-tabbar__icon'><i className={p.extra.icon} /></span>
              <p className='weui-tabbar__label'>{p.title}</p>
            </Link>
          ))}
        </div>
      </Fixed>
    )
  }

  render() {
    return (
      <div className='wTransitionRoutePage'>
        <TransitionRoute
          items={this.routeProps}
          extra={this.tabbar}
        />
      </div>
    )
  }
}
