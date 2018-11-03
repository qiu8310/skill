// import { observable, computed } from 'mobx'

import createIndexApi from './lib/createIndexApi'
import {MobxApp, rp, BasePageComponent} from 'common/'

export class NeoApp extends MobxApp {
  api = createIndexApi(
    (http) => {},
    () => {}
  )

  rp = {
    Home:                 rp({path: '/'}),
    Menu:                 rp({path: '/m', exact: false}),

    SetStateCallback:     rp({path: '/m/react/set-state-callback', title: 'setState 中 callback 执行时间'}),

    ModalExample:         rp({path: '/m/widget/modal', title: 'Modal / 弹窗'}),
    ToastExample:         rp({path: '/m/widget/toast', title: 'Toast'}),
    SliderExample:        rp({path: '/m/widget/slider', title: 'Slider'}),

    SampleData:           rp({path: '/m/project/sample-data', title: '样本数据生成器'}),

    NotFound:             rp({path: '*'})
  }
}

export interface IAppComponentProps {
  app?: NeoApp
}

export class PageComponent<P, S> extends BasePageComponent<NeoApp, P, S> {
  rp = this.app.rp
}

export * from 'mobx'
export * from 'mobx-react'
export {Page} from 'common/'
