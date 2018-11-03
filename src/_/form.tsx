import 'styles/form.scss'
import 'weui/dist/style/weui.css'

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {Provider} from 'mobx-react'
import {responsive} from 'mora-common/dom/responsive'
import {bootstrap} from 'mora-common/helper/bootstrap/mobile'

import {Loading} from 'mora-common'
Loading.setDefaultProps({
  stroke: require(SCSS_CONFIG_FILE).activeColor,
  style: {display: 'block', margin: '50px auto'}
})

import App from 'pages/form/App'
import {FormApp} from 'mobx/FormApp'
import {FormConfig} from 'mobx/Config'

responsive()

const app = new FormApp(FormConfig)
ReactDOM.render(
  <Provider app={app}>
    <App app={app} />
  </Provider>,
  document.querySelector('#root'),

  () => bootstrap()
)
