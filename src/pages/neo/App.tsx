import * as React from 'react'
import {App} from 'common/'
import {Loading} from 'mora-common'

import {Home} from './Home'
import {Menu} from './Menu'
import {NotFound} from './NotFound'

export default class extends App {
  components = {
    loading: <Loading />,
    sync: {Home, Menu, NotFound},
    async: [
      {
        keys: ['SampleData'],
        load: require('bundle-loader?lazy&name=widget!./menu-project/')
      },
      {
        keys: ['SetStateCallback'],
        load: require('bundle-loader?lazy&name=react!./menu-react/')
      },
      {
        keys: ['ModalExample', 'ToastExample', 'SliderExample'],
        load: require('bundle-loader?lazy&name=widget!./menu-widget/')
      }
    ]
  }

  /**
   * 最外层的路由
   * 注意顺序，且需要 assignrp 之后才能获取到 routeProps
   */
  get routes() {
    let {rp} = this.props.app
    return [
      rp.Home,
      rp.Menu,
      rp.NotFound
    ]
  }
}

