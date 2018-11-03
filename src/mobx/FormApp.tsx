import {MobxApp, r, BasePageComponent} from 'common/'

import createFormApi from './lib/createFormApi'

// declare type ID = string | number

export class FormApp extends MobxApp {
  storeKey = 'FormApp'
  serializableKeys = ['user']

  constructor(config) {
    super(config)

    if (__DEV__) {
      let u1 = {token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGl5ZWx2IiwiZXhwIjoxNTM2MDc2ODAwLCJpYXQiOjE1MDQ1ODczOTIsImlzcyI6ImhqIiwiYXVkIjoiYXBwIn0.coCo8qWY6yv7v2NtNdFvCQhRpYsWJSeo1jy3YPPY7W6PDhZQAkSckAlz_vaGW1oyx9nJpnVvXrYu_YXF9xv_KA'}
      // let u2 = {token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJNb3JhIiwiZXhwIjoxNTM3Mjg2NDAwLCJpYXQiOjE1MDU3ODgzNzgsImlzcyI6ImhqIiwiYXVkIjoiYXBwIn0.0sbLb6vN02G8r3C2oA_eqQWWGBACJlv9L9myr7YD9CGC0xtKBIA22vWtDbWWS3kufYmsngEe6Ivz6kPdL88wLQ' }
      this.user.fromJSON(u1)
    }
  }

  data: string

  rp = {
    Question:             r({path: '/question'}),
    User:                 r({path: '/user'}),
    Finish:               r({path: '/finish'}),
    Home:                 r({path: '/'}),

    Academy:              r({path: '/ou', exact: false}),
    AcademyHome:          r({path: '/ou/home',     title: 'Home',    extra: {icon: 'fas fa-home'}}),
    AcademyActivity:      r({path: '/ou/activity', title: '课/活动',    extra: {icon: 'fab fa-monero'}}),
    AcademyBBS:           r({path: '/ou/bbs',      title: '讨论',    extra: {icon: 'fas fa-comments'}}),
    AcademyLibrary:       r({path: '/ou/library',  title: '图书馆',  extra: {icon: 'fas fa-book'}}),
    AcademyMy:            r({path: '/ou/my',       title: '我',   extra: {icon: 'fas fa-user'}}),
    AcademyUser:          r({path: '/ou/zone',        title: 'Zone'}),

    ArtHome:              r({path: '/art'}),
    ArtClass:             r({path: '/art/class'}),
  }

  api = createFormApi(
    // inject
    (http) => this.user.isSigned && (http.headers.Authorization = 'Bearer ' + this.user.token),
    // http 返回 401，跳转到登录页去
    () => this.signOut()
  )
}

export interface IAppComponentProps {
  app?: FormApp
}

export class PageComponent<P = {}, S = {}> extends BasePageComponent<FormApp, P, S> {
  rp = this.app.rp
  api = this.app.api
}

import {inject} from 'mobx-react'
export function page(c) {
  return inject('app')(c)
}

export * from 'mobx'
export * from 'mobx-react'
export {Page, Link, React} from 'common/'
