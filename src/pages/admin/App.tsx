import {PAGE} from './config'

import {App, RouteProps} from 'common/'

export default class extends App {
  title = this.props.app.config.appName + ' - 管理后台'
  routes: RouteProps[] = [
    PAGE.SignIn.routeProps,
    PAGE.Home.routeProps
  ]
}

