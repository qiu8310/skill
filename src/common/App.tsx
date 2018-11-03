import * as React from 'react'
import {RouteProps} from 'react-router'
import {HashRouter, BrowserRouter, Route, RouteComponentProps} from 'react-router-dom'
import {Page, TransitionRoute} from 'mora-common'

import {IParseComponentsOptions} from './lib/parseComponents'
import {RoutePage} from './lib/RoutePage'
import {pageview} from './lib/pageview'
import {MobxApp} from './MobxApp'

export declare type IRouterProviderProps = RouteComponentProps<any> & {
  app: MobxApp
  routes: RouteProps[] | Array<RoutePage<any>>
  components: IParseComponentsOptions
}

export class RouterProvider extends React.PureComponent<RouteComponentProps<any> & IRouterProviderProps, any> {
  app = this.props.app
  routes: RouteProps[]

  constructor(props: IRouterProviderProps, context) {
    super(props, context)
    let {history, components, routes} = props
    this.app.history = history
    this.app.sync()

    if (components) {
      this.app.components = components
      this.app.assignrp(components)
    }
    if (!this.routes) {
      this.routes = (routes as any).map(r => r instanceof RoutePage ? r.routeProps : r)
    }
  }

  componentDidMount() {
    pageview(this.app.history.location)
    this.app.history.listen((location) => pageview(location))
  }

  render() {
    return <TransitionRoute items={this.routes} />
  }
}

export {React, RouteProps}

export abstract class App extends React.PureComponent<{app: MobxApp}, any> {
  abstract routes: RouteProps[] | Array<RoutePage<any>>
  components: IParseComponentsOptions
  title = this.props.app.config.appName
  lastUrl: string = null

  provider = (props: RouteComponentProps<any>) => {
    let {app} = this.props
    let url = props.location.pathname + props.location.search

    if (this.lastUrl !== url) {
      app.isHistoryBack = this.lastUrl ? app.isHistoryBack !== (0 as any) : false
      this.lastUrl = url
    }

    return <RouterProvider
      app={app}
      routes={this.routes}
      components={this.components}
      {...props}
    />
  }

  render() {
    let {hash} = this.props.app.config
    let Router = hash ? HashRouter : BrowserRouter

    return (
      <Page name='App' title={this.title}>
        <Router>
          <Route path='*' render={this.provider} />
        </Router>
      </Page>
    )
  }
}
