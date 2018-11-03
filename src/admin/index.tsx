export * from './base/form'
export * from './base/interface'
export * from './component/'
export * from './widget/'

export {Page, autobind, classSet, formatDate} from 'mora-common'

import {AdminConfig as Config} from 'mobx/Config'
import * as React from 'react'
export {Config, React} // 没有 interface 的模块好像不能用 export * from 'xxx' 的结果
