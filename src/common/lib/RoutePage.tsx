import {RouteProps, RouteComponentProps} from 'react-router'
import {buildSearch} from 'mora-common'
import {matchPath} from 'react-router'

export declare type IRoutePageComponent = React.SFC<RouteComponentProps<any> | undefined> | React.ComponentClass<RouteComponentProps<any> | undefined>
export declare type IRoutePageRender = (props: RouteComponentProps<any>) => React.ReactNode

export interface IRoutePageProps extends RouteProps {
  path: string
  title?: string
  /** 默认为 true，原生的 react-router 默认是 false */
  exact?: boolean
  /** 默认为 true，是否需要登录才能访问 */
  auth?: boolean
  /** 其它信息 */
  extra?: any
}

export class RoutePage<P extends {}> {
  key: string

  constructor(public props: IRoutePageProps) {
    if (!('auth' in props)) props.auth = true
  }

  get path() { return this.props.path }
  get title() { return this.props.title }
  get auth() { return this.props.auth }
  get extra() { return this.props.extra }

  get routeProps(): RouteProps {
    let {location, component, render, children, path, exact = true, strict} = this.props
    return {location, component, render, children, path, exact, strict}
  }

  set component(c: IRoutePageComponent) { this.props.component = c }
  set render(render: IRoutePageRender) { this.props.render = render }

  getLink(options: {params?: P, search?: string | {[key: string]: string}, hash?: string} = {}): string {
    let {params = {}, search = '', hash = ''} = options
    if (typeof search !== 'string') search = buildSearch(search)
    return getLink(this.props.path, params, search, hash)
  }

  /** getLink 的简写形式 */
  link(options: P | {params?: P, search?: string | {[key: string]: string}, hash?: string} = {}): string {
    let {params, search, hash} = options as any
    if (!params && !search && !hash) return this.getLink({params: options as P})
    return this.getLink(options)
  }

  matchPath(pathname: string) {
    return matchPath(pathname, this.routeProps)
  }
}

export function getLink(path: string, params: any = {}, search: string = '', hash: string = ''): string {
  return path
    .replace(/\/:(\w+)/g, (_, w) => (w in params) ? '/' + params[w] : _)  // 替换参数
    .replace(/\((.*?)\)/g, (_, w) => w.indexOf(':') >= 0 ? '' : w)        // 去除括号及其中的未填充的参数
    + ((search && search[0] !== '?' ? '?' : '') + search)
    + ((hash && hash[0] !== '#' ? '#' : '') + hash)
}

// helper function
export function rp<P>(props: IRoutePageProps): RoutePage<P> {
  return new RoutePage<P>(props)
}

export function r(props: IRoutePageProps) {
  if (!('auth' in props)) props.auth = false
  return rp(props)
}
