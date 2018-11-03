/**
 * Create by Mora at 2017-10-01 10:27
 * All right reserved
 */

import {React, PageComponent, Page, page, Link, componentsToMenu} from './base'

@page
export class Home extends PageComponent<any, any> {
  menu: Array<{title: string, keys: string[]}>

  constructor(props, context) {
    super(props, context)
    const {components} = this.app
    this.menu = componentsToMenu(components)
  }

  render() {
    let {rp, config} = this.app
    return (
      <Page name='Home' title={config.appName}>
        <ul className='menu' style={{padding: '10px 20px'}}>
          {
            this.menu.map(item => (
              <li className='menuItem' key={item.title}>
                <h2 className='menuItemTitle'>{item.title}</h2>
                <ul className='submenu'>
                  {item.keys.map(key => (
                    <li key={key} className='submenuItem'>
                      <Link className='submenuItemTitle' to={rp[key].link()} children={rp[key].title} />
                    </li>
                  ))}
                </ul>
              </li>
            ))
          }
        </ul>
      </Page>
    )
  }
}

