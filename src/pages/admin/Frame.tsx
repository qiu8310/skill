import { RouteComponentProps, RouteProps } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Icon, Dropdown, Modal } from 'antd'
const { Header, Content, Footer, Sider } = Layout

import {React, Page, autobind} from 'admin/'
import {TransitionRoute} from 'mora-common'

import {PAGE, frameSiderPageMenu, frameRouteItemProps, IPageMenu} from './config/'
import Setting from './dialog/Setting'
import {IAppComponentProps, observer} from 'mobx/AdminApp'

import './styles/Frame.scss'

@observer
export default class Frame extends React.Component<IAppComponentProps & RouteComponentProps<any>, any> {
  private offHistoryListen: () => void
  siderPageMenu: IPageMenu[] = frameSiderPageMenu
  state = {
    showSettingModal: false,
    selectedKeys: this.getSelectedKeys()
  }

  @autobind private isPageMenuActive(pageMenu: IPageMenu, location?: any) {
    let {pathname, search, hash} = location || this.props.location
    // 如果没有 pageMenu.link 说明是取 pageMenu.page.path 中的值，即不存在 search 和 hash
    return pageMenu.link && pageMenu.link === pathname + search + hash || !pageMenu.link && pageMenu.page.path === pathname
  }

  /**
   * 遍历 menu 中的 pageMenu，如果 cb 返回 true 则终止，并返回 true
   */
  @autobind private somePageMenu(menu, cb) {
    let each = (item) => {
      if (item.children) return item.children.some(each)
      else return cb(item)
    }
    return menu.some(each)
  }

  /**
   * 给 Menu 组件用的
   */
  @autobind private onCollapse(collapsed) {
    this.props.app.collapseAside = collapsed
  }

  /**
   * 给 Menu 组件用的
   */
  @autobind private onSiderMenuChange({item, key, selectedKeys}) {
    this.somePageMenu(this.siderPageMenu, (pageMenu: IPageMenu) => {
      if (pageMenu.key === key) {
        this.props.history.push(pageMenu.link || pageMenu.page.getLink())
        return true
      }
    })
  }

  /**
   * 给 Menu 组件用的
   */
  getSelectedKeys(location?: any) {
    let result = []
    this.somePageMenu(this.siderPageMenu, (pageMenu: IPageMenu) => {
      if (this.isPageMenuActive(pageMenu, location)) {
        result.push(pageMenu.key)
        return true
      }
    })
    return result
  }

  componentDidMount() {
    this.offHistoryListen = this.props.history.listen((location) => {
      this.setState({selectedKeys: this.getSelectedKeys(location)})
    })
  }

  componentWillUnmount() {
    if (this.offHistoryListen) this.offHistoryListen()
  }

  @autobind private appendRenderToRoute(route: RouteProps): RouteProps {
    /* tslint:disable:variable-name */
    let {component, ...rest} = route
    let Component: any = component
    rest.render = (props) => {
      if (!this.props.app.user.isSigned) {
        let {pathname, search, hash} = this.props.location
        return <Redirect to={{
          pathname: PAGE.SignIn.getLink(),
          state: {returnUrl: pathname + search + hash}
        }} />
      }
      return <Component {...props} />
    }
    return rest
  }

  get sider() {
    let self = this
    function renderMenuItem(item: IPageMenu) {
      return <Menu.Item key={item.key}>
        {item.icon ? <Icon type={item.icon} /> : null}
        <span>{item.page.title}</span>
      </Menu.Item>
    }

    function renderSubMenu(item: IPageMenu) {
      let hasActiveItem = self.somePageMenu(item.children, self.isPageMenuActive)
      return (
        <Menu.SubMenu
          key={item.key}
          className={hasActiveItem ? 'hasActiveItem' : ''}
          title={<span>{item.icon ? <Icon type={item.icon} /> : null}<span>{item.title}</span></span>}
        >
          {item.children.map(renderMenu)}
        </Menu.SubMenu>
      )
    }

    function renderMenu(item: IPageMenu) {
      if (item.children) {
        return renderSubMenu(item)
      } else {
        return renderMenuItem(item)
      }
    }

    return this.siderPageMenu.map(renderMenu)
  }

  get header(): JSX.Element {
    let {signOut, user} = this.props.app

    let overlay = (
      <Menu selectedKeys={[]}>
        <Menu.Item children={<a onClick={() => this.setState({showSettingModal: true})}><Icon type='setting' />&nbsp;系统设置</a>} />
        <Menu.Item children={<a onClick={signOut}><Icon type='logout' />&nbsp;退&#8195;&#8195;出</a>} />
      </Menu>
    )
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <div className='frameHeaderMenu'>
          <Dropdown overlay={overlay}>
            <p className='gEllipsis username'><Icon type='user' />&nbsp;{user.name}</p>
          </Dropdown>
        </div>
      </Header>
    )
  }

  get breadcrumb(): JSX.Element[] {
    let bs = this.props.app.breadcrumb || []
    if (!bs.length || bs[0].icon !== 'home') bs.unshift({icon: 'home', link: bs.length ? PAGE.Dashboard.getLink() : null})

    let wrap = (b) => {
      let icon = b.icon ? <Icon key='1' type={b.icon} /> : null
      let text = b.title ? <span key='2'>{b.title}</span> : null
      let el = [icon, text]
      return b.link ? <Link to={b.link} children={el} /> : el
    }
    return bs.map((b, i) => <Breadcrumb.Item key={i} children={wrap(b)} />)
  }

  get footer(): JSX.Element {
    let {app} = this.props
    if (app.hideFooter) return null
    return (
      <Footer style={{ textAlign: 'center' }}>
        {app.config.appName} ©{new Date().getFullYear()} Created by Mora
      </Footer>
    )
  }

  render() {
    let {selectedKeys, showSettingModal} = this.state
    let {location: {pathname, search}, app: {collapseAside}} = this.props

    return (
      <Page name='Frame'>
        <Layout>
          <Sider
            collapsible
            collapsed={collapseAside}
            onCollapse={this.onCollapse}
          >
            <div className='logo' style={{margin: 16, background: '#333', height: 32, borderRadius: 6}} />

            <Menu theme='dark' onSelect={this.onSiderMenuChange} selectedKeys={selectedKeys} inlineCollapsed={collapseAside} mode='inline'>
              {this.sider}
            </Menu>
          </Sider>
          <Layout>
            {this.header}
            <Content style={{ margin: '0 16px' }} className='gFlexContainer gFlexVertical'>
              <Breadcrumb style={{ margin: '12px 0' }} key={pathname + search} children= {this.breadcrumb} />
              <div className='frameContent gFlex'>
                <TransitionRoute items={frameRouteItemProps.map(this.appendRenderToRoute)} />
              </div>
            </Content>
            {this.footer}
          </Layout>
        </Layout>

        <Modal visible={showSettingModal} title='系统设置' footer={null} onCancel={() => this.setState({showSettingModal: false})}>
          <Setting />
        </Modal>
      </Page>
    )
  }
}
