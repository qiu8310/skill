/* tslint:disable:no-reference */
/// <reference path="../../typings.d.ts" />

import 'styles/admin.scss'

import * as ReactDOM from 'react-dom'
import * as React from 'react'

import {Provider} from 'mobx-react'

import {Loading} from 'mora-common'
Loading.setDefaultProps({
  stroke: require(SCSS_CONFIG_FILE).activeColor,
  style: {display: 'block', margin: '50px auto'}
})

import {AdminApp} from 'mobx/AdminApp'
import {AdminConfig} from 'mobx/Config'

import App from 'pages/admin/App'
const app = new AdminApp(AdminConfig)

ReactDOM.render(
  <Provider app={app}>
    <App app={app} />
  </Provider>
  , document.querySelector('#root')
)
