import * as React from 'react'
import {Link} from 'react-router-dom'
export {Page, Image, HTML, autobind, classSet, Loading} from 'mora-common'

import {Button} from 'widget/Button'

export * from 'mobx/NeoApp'
import {IParseComponentsOptions} from 'common/index'
import {NeoConfig as Config} from 'mobx/Config'
export {React, Link, Config, Button}

import {inject} from 'mobx-react'

export function page(c) {
  return inject('app')(c)
}

export function componentsToRoutes(components: IParseComponentsOptions, rp) {
  return components.async.reduce((res, item) => [...res, ...item.keys.map(k => rp[k].routeProps)], [])
}

export function componentsToMenu(components: IParseComponentsOptions): Array<{title: string, keys: string[]}> {
  return components.async.map(({load, keys}) => {
    if (/\/menu-(\w+)\//.test(load.toString())) {
      return {title: RegExp.$1.toUpperCase(), keys}
    } else {
      return {title: 'UNKNOWN', keys}
    }
  })
}

