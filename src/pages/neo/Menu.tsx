/**
 * Create by Mora at 2017-10-01 15:43
 * All right reserved
 */

import {React, PageComponent, Page, page, componentsToRoutes, componentsToMenu} from './base'
import {TransitionRoute} from 'mora-common'
import {Hamburger} from 'widget/Hamburger'
// import * as ReactDOM from 'react-dom'

@page
export class Menu extends PageComponent<any, any> {
  menu: any
  container
  constructor(props, context) {
    super(props, context)
    let {rp, components} = this.app
    this.menu = componentsToMenu(components).reverse().map(({title, keys}) => {
      return {title, children: keys.map(k => rp[k])}
    })

    this.container = document.createElement('div')
    document.body.appendChild(this.container)
  }

  render() {
    let {rp, components, config, location} = this.app
    let home = {title: 'HOME', link: config.homeLink}

    let isProject = location.pathname.indexOf('/m/project/') === 0

    return (
      <Page name='Menu'>
        <TransitionRoute items={componentsToRoutes(components, rp)} />
        {isProject ? null : <Hamburger menu={[...this.menu, home]} />}
      </Page>
    )
  }
}
