/**
 * Create by Mora at 2017-10-01 18:25
 * All right reserved
 *
 * 参考： https://codepen.io/lbebber/pen/pvwZJp
 *
 */

import * as React from 'react'
import {classSet, toast, onview, OutsideClickable, IOutsideClickableGetInsideContainer} from 'mora-common'
import {inject, IAppComponentProps} from 'mobx/NeoApp'
import {RoutePage} from 'common/'

import './styles/Hamburger.scss'

export interface IHamburgerProps {
  className?: string
  style?: React.CSSProperties
  expand?: 'Circle' | 'Up'
  menu: Array<{title: string, link?: string, children: Array<RoutePage<any>>}>
}

@inject('app')
@OutsideClickable.apply()
export class Hamburger extends React.PureComponent<IHamburgerProps & IAppComponentProps, any> implements OutsideClickable {
  static defaultProps = {
    expand: 'Up'
  }
  private toastInstance

  state = {
    isOpen: false,
    submenu: null
  }
  open = () => this.setState({isOpen: true})
  close = () => this.setState({isOpen: false, submenu: null})
  toggle = () => this.state.isOpen ? this.close() : this.open()
  goto = (direction: number) => {
    let {location: {pathname}, gotoLink} = this.props.app
    let _prev
    let prev: RoutePage<any>
    let current: RoutePage<any>
    let next: RoutePage<any>

    this.props.menu.forEach(m => {
      m.children && m.children.forEach(c => {
        if (!current && c.matchPath(pathname)) {
          current = c
          prev = _prev
        } else if (current && !next) {
          next = c
        }
        _prev = c
      })
    })

    if (this.toastInstance) this.toastInstance.destroy()
    if (direction < 0) {
      prev ? gotoLink(prev.link()) : this.toastInstance = toast('已经是第一页了', {instance: this})
    } else {
      next ? gotoLink(next.link()) : this.toastInstance = toast('已经是最后一页了', {instance: this})
    }
  }
  prev = () => this.goto(-1)
  next = () => this.goto(1)

  getInsideContainer: IOutsideClickableGetInsideContainer
  onClickOutside = this.close
  componentDidMount() {
    let count = 0
    let sid
    onview(() => {
      if (this.state.isOpen) {
        count++
        clearTimeout(sid)
        if (count > 2) {
          this.close()
          count = 0
        } else {
          sid = setTimeout(() => count = 0, 500)
        }
      }
    }, {events: 'scroll', throttle: 300})
  }

  private toggleSubmenu(submenu) {
    return () => {
      if (submenu.link) return this.gotoLink(submenu.link)()

      if (this.state.submenu !== submenu) {
        this.setState({submenu})
      } else {
        this.setState({submenu: null})
      }
    }
  }

  private gotoLink(link) {
    return () => {
      this.setState({submenu: null})
      this.props.app.gotoLink(link)
    }
  }

  render() {
    const {className, style, expand, menu, app: {location: {pathname}}} = this.props
    const {isOpen, submenu} = this.state

    return (
      <div className={classSet('wHamburger', className, {isOpen}, 'expand' + expand)} style={style}>
        <a className='hbgrNav gOverlay hbgrNavPrev' onClick={this.prev}>&and;</a>
        <a className='hbgrNav gOverlay hbgrNavNext' onClick={this.next}>&or;</a>

        <a className='hbgrButton' onClick={this.toggle}>
          <i className='hbgr hbgr1' />
          <i className='hbgr hbgr2' />
          <i className='hbgr hbgr3' />
        </a>

        <ul className='hbgrMenu'>
          {menu.map(m => (
            <li key={m.title} className={classSet('hbgrMenuItem', submenu === m && 'active')}>
              <span className='hbgrMenuItemTitle' onClick={this.toggleSubmenu(m)}>{m.title}</span>
              {
                m.children && <ul className={classSet('hbgrSubmenu', submenu === m && 'active')}>
                  {m.children.map(c => (
                    <li key={c.title} className={classSet('hbgrSubmenuItem', c.matchPath(pathname) && 'isCurrent')} onClick={this.gotoLink(c.link())}>{c.title}</li>
                  ))}
                </ul>
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
