/**
 * Create by Mora at 2017-10-18 10:28
 * All right reserved
 */

//#region
import * as React from 'react'
import {Link} from 'react-router-dom'
import {classSet, Render} from 'mora-common'
import {inject, IAppComponentProps} from 'mobx/IndexApp'
import {SearchModal} from './SearchModal'

import './styles/Menu.scss'
//#endregion

export interface IMenuProps {
  className?: string
  style?: React.CSSProperties
  count?: number
  extraHead?: React.ReactNode
}

@inject('app')
export class Menu extends React.PureComponent<IMenuProps & IAppComponentProps, any> {
  state = {
    hasTestResult: false,
    showSearch: false,
    opened: false
  }
  open = () => this.setState({opened: true})
  close = () => this.setState({opened: false})
  toggle = () => this.setState({opened: !this.state.opened})

  get menus() {
    const {pathname} = this.props.app.location
    const {app: {rp: {CareerAllList, CareerFavList}}} = this.props
    return [CareerAllList, CareerFavList]
      .map(r => ({link: r.link(), title: r.title, active: pathname === r.link()}))
  }

  async componentWillMount() {
    let data = await this.props.app.api.hasTestResult()
    this.setState({hasTestResult: data >= 0})
  }

  render() {
    const {menus} = this
    const {opened, hasTestResult} = this.state
    const {className, style, count, children, app: {rp}} = this.props

    let noActiveMenus = []
    let activeMenu = null
    menus.forEach(m => {
      if (m.active) activeMenu = m
      else noActiveMenus.push(m)
    })

    let disableStyle = {pointerEvents: 'none'}

    return (
      <div className={classSet('wMenu', className, {['wMenu-opened']: opened})} style={style}>
        <div className='menuHead'>
          <div className='gFlexContainer wrap'>
            <a className='imenu' onClick={this.toggle} />
            <p className='text gFlex'>
              <span className='title'>{activeMenu.title}</span>
              {count && <span className='count'>({count})</span>}
            </p>
            {!opened && <a className='isearch' onClick={() => this.setState({showSearch: true})} />}
          </div>
          {!opened && this.props.extraHead}
        </div>

        <div className='menuView'>
          <div className='menuContent menuTransition'>
            <div className='menuitems gFlexContainer gFlexVertical'>
              {noActiveMenus.map(m => <Link style={m.title === '我的收藏' ? disableStyle : null} className='menuitem menuTransition' key={m.link} to={m.link} children={m.title} />)}
              <Link className='menuitem menuTransition' to={hasTestResult ? rp.TestResult.link() : rp.TestIntro.link()}>我的测试</Link>
            </div>

            <div className='bottom gFlexContainer gSpaceAroundChildren'>
              <p className='about'>关于</p>
              <p className='setting'>设置</p>
            </div>
          </div>

          <div className='menuBody menuTransition'>
            {children}
          </div>
        </div>

        {this.state.showSearch && <Render>
          <SearchModal onClose={() => this.setState({showSearch: false})} />
        </Render>}
      </div>
    )
  }
}
