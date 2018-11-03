import {MobxApp, rp, BasePageComponent} from 'common/'
import {observable} from 'mobx'

import createIndexApi from './lib/createIndexApi'

// declare type ID = string | number

export class IndexApp extends MobxApp {
  storeKey = 'IndexApp'
  serializableKeys = ['user', 'careerBids']

  constructor(config) {
    super(config)

    if (__DEV__) {
      let u1 = {token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGl5ZWx2IiwiZXhwIjoxNTM2MDc2ODAwLCJpYXQiOjE1MDQ1ODczOTIsImlzcyI6ImhqIiwiYXVkIjoiYXBwIn0.coCo8qWY6yv7v2NtNdFvCQhRpYsWJSeo1jy3YPPY7W6PDhZQAkSckAlz_vaGW1oyx9nJpnVvXrYu_YXF9xv_KA'}
      // let u2 = {token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJNb3JhIiwiZXhwIjoxNTM3Mjg2NDAwLCJpYXQiOjE1MDU3ODgzNzgsImlzcyI6ImhqIiwiYXVkIjoiYXBwIn0.0sbLb6vN02G8r3C2oA_eqQWWGBACJlv9L9myr7YD9CGC0xtKBIA22vWtDbWWS3kufYmsngEe6Ivz6kPdL88wLQ' }
      this.user.fromJSON(u1)
    }
  }

  @observable careerBids = [303]

  careers = [
    {
      id: 1,
      bid: 303,
      name: 'UI设计师',
      english: 'UI Designer',
      img: 'http://lcdn.static.lotlot.com/1-be98bfae.jpg?imageslim',
      system: '设计系',
      video: {
        name: 'UI / UX设计流程',
        cover: 'http://lcdn.static.lotlot.com/design-f0d69276.png?imageslim',
        src: 'http://lcdn.static.lotlot.com/1-79cec9fe.mp4',
        time: '01:15'
      }
    },
    {
      id: 2,
      bid: 220,
      name: '人力资源',
      english: 'Human Resource',
      img: 'http://lcdn.static.lotlot.com/2-99357ea8.jpg?imageslim',
      system: '人力资源系',
      video: {
        name: '人力资源业务伙伴的一天',
        cover: 'http://lcdn.static.lotlot.com/WechatIMG108-7cd327e4.jpeg?imageslim',
        src: 'http://v.youku.com/v_show/id_XNzgyNTUyMzY4.html',
        time: '05:53'
      }
    },
    {
      id: 3,
      bid: 8,
      name: '产品运营',
      english: 'Operation',
      img: 'http://lcdn.static.lotlot.com/3-b6b33012.jpg?imageslim',
      system: '互联网系',
      video: {
        name: '如何做好产品运营',
        cover: 'http://lcdn.static.lotlot.com/3-046aa524.png?imageslim',
        src: 'http://www.iqiyi.com/w_19rtfmn5ld.html?source=',
        time: '15:28'
      }
    },
    {
      id: 4,
      bid: 400,
      name: '电影导演',
      english: 'Film Director',
      img: 'http://lcdn.static.lotlot.com/4-028887d5.jpg?imageslim',
      system: '影视类',
      video: {
        name: '导演教你如何成为一名导演',
        cover: 'http://lcdn.static.lotlot.com/WechatIMG106-ae71e0cc.jpeg?imageslim',
        src: 'https://v.qq.com/x/page/z0562mna3kq.html',
        time: '08:16'
      }
    },
    {
      id: 5,
      bid: 410,
      name: '心理咨询师',
      english: 'Psychological Consultant',
      img: 'http://lcdn.static.lotlot.com/5-503521a2.jpg?imageslim',
      system: '咨询系',
      video: {
        name: '简单心理',
        cover: 'http://lcdn.static.lotlot.com/2-dd5218e0.jpeg?imageslim',
        src: 'http://lcdn.static.lotlot.com/9f20e1225aa24498ae699e55ead70ea62.mp4',
        time: '05:40'
      }
    }
  ]

  rp = {
    Home:                 rp({path: '/'}),
    Markdown:             rp({path: '/md'}),

    StartUpV3:            rp({path: '/v3-start', auth: false}),
    StartV3:              rp({path: '/v3', exact: false}),
    HomeV3:               rp({path: '/v3/home', title: '首页'}),
    UserV3:               rp({path: '/v3/user', title: '个人主页'}),
    ExploreV3:            rp({path: '/v3/explore', title: '探索页'}),
    CareerV3:             rp({path: '/v3-career/:careerId'}),
    CareerDetailV3:       rp({path: '/v3-career/:careerId/detail', title: '职业详情'}),
    CareerDataV3:         rp({path: '/v3-career/:careerId/data', title: '数据报告'}),
    CareerSkillV3:        rp({path: '/v3-career/:careerId/skill', title: '必备技能'}),
    CareerSystemV3:       rp({path: '/v3-career/:careerId/system', title: '职业体系'}),
    CareerLearnItemV3:    rp({path: '/v3-career/learn/:learnId', title: '学习资源'}),

    TestQuestionV3:       rp({path: '/v3-test/question'}),
    TestResultV3:         rp({path: '/v3-test/result'}),
    TestCareersV3:        rp({path: '/v3-test/career/:type'}),

    StartUp:              rp({path: '/v2', auth: false}),
    CareerList:           rp({path: '/v2/career', exact: false}),
    CareerNewList:        rp({path: '/v2/career/new', title: '今日更新'}),
    CareerAllList:        rp({path: '/v2/career/all', title: '全部职业'}),
    CareerFavList:        rp({path: '/v2/career/fav', title: '我的收藏'}),
    Career:               rp({path: '/v2/career/:careerId'}),

    // Test
    TestIntro:            rp({path: '/v2/test'}),
    TestQuestion:         rp({path: '/v2/test/question'}),
    TestResult:           rp({path: '/v2/test/result'}),
    TestCareers:          rp({path: '/v2/test/career/:type'}),
  }

  api = createIndexApi(
    // inject
    (http) => this.user.isSigned && (http.headers.Authorization = 'Bearer ' + this.user.token),
    // http 返回 401，跳转到登录页去
    () => this.signOut()
  )
}

export interface IAppComponentProps {
  app?: IndexApp
}

export class PageComponent<P, S> extends BasePageComponent<IndexApp, P, S> {
  api = this.app.api
  rp = this.app.rp
}

export * from 'mobx'
export * from 'mobx-react'
export {Page, Link} from 'common/'
