import * as React from 'react'
import {Bundle} from 'mora-common'
import {IRoutePageComponent} from './RoutePage'

export interface IParseComponentsOptions {
  loading?: JSX.Element
  sync?: {[key: string]: React.ComponentClass<any>}
  async?: Array<{
    keys: string[]
    load: any
  }>
}

export function parseComponents(opts: IParseComponentsOptions): {[key: string]: IRoutePageComponent} {
  let {loading, sync = {}, async = []} = opts

  return async.reduce((result, it) => {
    return {...result, ...(reduce(it.keys, it.load, loading))}
  }, {...sync})
}

function reduce<T extends string>(keys: T[], load, loading): {[K in T]: IRoutePageComponent} {
  return keys.reduce((all, key) => {
    all[key] = (props) => (
      <Bundle modKey={key} load={load} loading={loading}>
        {C => <C {...props}/>}
      </Bundle>
    )
    return all
  }, {} as any)
}
