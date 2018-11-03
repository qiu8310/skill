import * as React from 'react'
import {App} from 'common/'
import {Loading} from 'mora-common'
import {Home} from './base/Home'
import {Markdown} from './base/Markdown'

export default class extends App {

  components = {
    loading: <Loading />,
    sync: {Home, Markdown},
    async: [
      // v3
      {
        keys: ['StartV3', 'ExploreV3', 'HomeV3', 'UserV3', 'StartUpV3'],
        load: require('bundle-loader?lazy&name=index-homev3!./V3/Home/')
      },
      {
        keys: ['CareerV3', 'CareerDetailV3', 'CareerDataV3', 'CareerSkillV3', 'CareerSystemV3', 'CareerLearnItemV3'],
        load: require('bundle-loader?lazy&name=index-careerv3!./V3/Career/')
      },
      {
        keys: ['TestResultV3', 'TestQuestionV3', 'TestCareersV3'],
        load: require('bundle-loader?lazy&name=index-testv3!./V3/Test/')

      },

      // v2
      {
        keys: ['StartUp'],
        load: require('bundle-loader?lazy&name=index-startv2!./V2/Home/StartUp')
      },
      {
        keys: ['Career', 'CareerAllList', 'CareerFavList', 'CareerNewList'],
        load: require('bundle-loader?lazy&name=index-careerv2!./V2/Career/')
      },
      {
        keys: ['TestIntro', 'TestQuestion', 'TestResult', 'TestCareers'],
        load: require('bundle-loader?lazy&name=index-testv2!./V2/Test/')
      }
    ]
  }

  /**
   *
   * 最外层的路由
   * 注意顺序，且需要 assignrp 之后才能获取到 routeProps
   *
   */
  get routes() {
    let {rp} = this.props.app
    return [
      rp.Home,
      rp.Markdown,

      // v3
      rp.StartUpV3,
      rp.StartV3,
      rp.ExploreV3,
      rp.HomeV3,
      rp.UserV3,
      rp.CareerLearnItemV3,
      rp.CareerV3,
      rp.CareerDetailV3,
      rp.CareerDataV3,
      rp.CareerSkillV3,
      rp.CareerSystemV3,

      rp.TestQuestionV3,
      rp.TestResultV3,
      rp.TestCareersV3,

      // v2
      rp.StartUp,
      rp.CareerNewList,
      rp.CareerAllList,
      rp.CareerFavList,
      rp.Career,

      rp.TestIntro,
      rp.TestQuestion,
      rp.TestResult,
      rp.TestCareers
    ]
  }
}

