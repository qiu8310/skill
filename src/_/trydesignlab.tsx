/* globals FastClick */
import 'styles/trydesignlab.scss'

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

import App from 'pages/trydesignlab/App'
import {TryDesignLabApp} from 'mobx/TryDesignLabApp'
import {TryDesignLabConfig} from 'mobx/Config'

responsive()

const app = new TryDesignLabApp(TryDesignLabConfig)
ReactDOM.render(
  <Provider app={app}>
    <App app={app} />
  </Provider>,
  document.querySelector('#root'),

  () => bootstrap()
)
