import 'styles/index.scss'
import 'styles/neo.scss'

import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {Provider} from 'mobx-react'
import {bootstrap} from 'mora-common/helper/bootstrap/mobile'

import App from 'pages/neo/App'
import {NeoApp} from 'mobx/NeoApp'
import {NeoConfig} from 'mobx/Config'

const app = new NeoApp(NeoConfig)
ReactDOM.render(
  <Provider app={app}>
    <App app={app} />
  </Provider>,
  document.querySelector('#root'),

  () => bootstrap()
)
