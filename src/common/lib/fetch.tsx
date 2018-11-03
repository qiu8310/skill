import {loadScript, buildSearch} from 'mora-common'

/**
 * 标识需要的参数，可以是 url 的 path 上的 params，也可以是 url 的 search 上的 query，也可以是提交的数据 data
 *
 * 如果是字符串，可以是：
 *
 * @example
 * 'id'       => key: 'id'
 * 'id='      => key: 'id', required: true
 * 'id:bid'   => key: 'id', backend: 'bid'
 * 'id:bid='  => key: 'id', backend: 'bid', required: true
 * 'id:bid=1' => key: 'id', backend: 'bid', defaultValue: '1'  // 有 defaultValue，则是否 required 都不重要了
 *
 * 'id=&method=get'  => {key: 'id', required: true}, {key: 'method', defaultValue: 'get'}
 */
// export type IFetchArgs = string | {[key: string]: {backend?: string, defaultValue?: any, required?: boolean}}
// export interface IFetchUserOptions {
//   polyfill?: string

//   base?: string
//   cache?: boolean

//   data?: IFetchArgs
//   params?: IFetchArgs
//   query?: IFetchArgs
// }

const DEFAULT_POLYFILL = '//cdn.staticfile.org/fetch/2.0.3/fetch.min.js'
export interface IFetchOptions extends RequestInit {
  polyfill?: string
}

const DEFAULT_FETCH_NATIVE_OPTIONS: RequestInit = {
  method: 'GET',
  credentials: 'same-origin',
  headers: {
    // 'Cookie': '',
    'Content-Type': 'application/json;charset=utf-8'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export class ResponseError extends Error {
  constructor(message: string, public response: Response, public content: any) { super(message) }
}

export async function fetch<R>(url: string, opts: IFetchOptions = {}): Promise<R> {
  let {polyfill = DEFAULT_POLYFILL, ...nativeOpts} = opts

  if (typeof window.fetch !== 'function') {
    if (__DEV__) console.warn(`没有 fetch 方法，尝试异步加载 polyfill 文件 ${polyfill}`)
    await loadScript(polyfill)
  }

  let contentType: string = nativeOpts.headers['Content-Type']
  let body = nativeOpts.body
  if (contentType && body && typeof body !== 'string') {
    if (contentType.indexOf('application/json') === 0) nativeOpts.body = JSON.stringify(body)
    else if (contentType.indexOf('application/x-www-form-urlencoded') === 0) nativeOpts.body = buildSearch(body).substr(1)
  }

  let rsp = await window.fetch(url, {...DEFAULT_FETCH_NATIVE_OPTIONS, ...nativeOpts})
  let isJson = rsp.headers.get('Content-Type').indexOf('application/json') === 0
  let content = await (isJson ? rsp.json() : rsp.text())

  if (rsp.status !== 200) throw new ResponseError(`${opts.method} ${rsp.status} ${rsp.statusText} ${url}`, rsp, content)
  return content
}
