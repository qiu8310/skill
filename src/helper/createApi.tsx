/* tslint:disable:no-reference */
import * as elegantApi from 'elegant-api'

export interface IApiOptionsObject {[key: string]: any}
export interface IApiOptions {
  mocks?: IApiOptionsObject
  base?: string
  alert?: any
  fetchTimeout?: number
  inject?: (http) => void
  login: () => void
}

export default function<T extends string>(routes: {[x in T]: any}, options: IApiOptions): {
  [y in T]: (data?: any, config?: any) => Promise<any>
} {
  let {mocks = {}, base = '', alert = window.alert, fetchTimeout = __DEV__ ? 30000 : 8000} = options
  let __ignoreNextError = false
  let lastAlertTime = 0
  let alertInterval = 2000

  let api = elegantApi({
    base,
    cache: false,
    mock: {
      disabled: true,
      memory: true,
      delay: { min: 10, max: 200 }
    },
    request: {
      naming: null
    },
    response: {
      naming: 'camel'
    },
    handle,
    http: {
      credentials: 'same-origin',
      // timeout: 10000, // fatch api 还不支持，参见 https://github.com/facebook/react-native/issues/2394
      headers: {
        'Content-Type': 'application/json'
      }
    },
    routes,
    mocks
  })

  api.ignoreNextError = () => {
    __ignoreNextError = true
  }

  return api

  // 一个页面里可能会有多个接口，
  // 如果所有接口都出错了，会频繁触发 alert，
  // 用户体验差，这里保证一段时间内不重复出现 alert
  function friendlyAlert(msg) {
    if (__ignoreNextError) {
      __ignoreNextError = false
      return
    }

    if (Date.now() - lastAlertTime > alertInterval) {
      // if (__BUILD__)
      alert(msg)
      // else console.warn('ALERT: ' + msg)
      lastAlertTime = Date.now() // 重新获取时间，因为 alert 可能是异步的
    }
  }

  function handle(target, callback) {
    if (!target.data && __DEV__) target.data = {code: 200, msg: 'OK', data: null}

    let { http } = target
    let { method, url } = http

    delete http.crossOrigin
    delete http.dataType

    if (options.inject) options.inject(http)

    if (method === 'HEAD' || method === 'GET') {
      delete http.body // 不删除会导致火狐下报错
    } else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      http.body = http.data
      if (typeof http.body === 'object') http.body = JSON.stringify(http.body)
    }

    // if (__DEV__) console.info('=> %s %s %o %o', method, url, http.data, http)
    if (this.mock.memory) return done(target.error, target.data)

    let isDone = false
    let fetchTimeoutSid

    function done(err, data) {
      clearTimeout(fetchTimeoutSid)
      if (isDone) return false
      isDone = true

      let error = null
      let status = 200

      if (err) {
        if (err.status === 401 || err.data && /invalid identity/.test(err.data.message)) return options.login()
        friendlyAlert(err.error || '网络异常，请稍后再试')

      } else if (typeof data === 'object') {
        status = data.status || data.code || status
        error = data.error

        if (status !== 200 && !error) error = data.msg || data.message || '未知错误，请稍后再试'
        if (/invalid identity/.test(error)) status = 401

        if (status === 401) {
          return options.login()
        } else if (error) {
          friendlyAlert(data && data.msg || error)
          err = {status, error, data}
          data = null
        } else {
          if (data.data) data = data.data
        }
      }

      __ignoreNextError = false

      // if (__DEV__) console.debug('<= %s %s %o', http.method, http.url, data)
      return callback(err, data)
    }

    fetchTimeoutSid = setTimeout(() => done(null, {error: '网络请求超时，请刷新重试'}), fetchTimeout)
    window.fetch(url, http)
      .then(res => {
        let { status } = res
        let isJson = res.headers.get('Content-Type').indexOf('/json') >= 0

        return new Promise((resolve, reject) => {
          let prom = isJson ? res.json() : res.text()
          if (status === 200) {
            prom.then(resolve, reject)
          } else {
            prom.then(data => {
              reject({status, error: data && (data.data || data.msg) || res.statusText, data})
            }, reject)
          }
        })
      })
      .then(data => done(null, data), err => done(err, null))
  }
}
