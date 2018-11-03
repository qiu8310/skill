import {RoutePage as RP} from 'common/lib/RoutePage'

import Frame from '../Frame'
import SignIn from '../SignIn'
import Dashboard from '../frame/Dashboard'

// import {QuestionList, QuestionAdd, QuestionEdit, QuestionShow} from '../frame/Question'
// import {ArticleList, ArticleAdd, ArticleEdit, ArticleShow} from '../frame/Article'
import {CareerList, CareerAdd, CareerEdit, CareerShow} from '../frame/Career'
import {ModuleList, ModuleAdd, ModuleEdit, ModuleShow} from '../frame/Module'
import {CardList, CardAdd, CardEdit, CardShow} from '../frame/Card'
import {UserTagList, UserTagAdd, UserTagEdit, UserTagShow} from '../frame/UserTag'

import {createForm} from 'admin/base/form'
import {inject} from 'mobx/AdminApp'
import {AdminConfig} from 'mobx/Config'

const C = '/career/:careerId'
const M = '/module/:moduleId/question/:questionId'
const CM = C + M

export const PAGE = {
  Home:         new RP({path: '/',                          component: i(Frame),         title: '首页',   exact: false}),
  SignIn:       new RP({path: AdminConfig.signinLink,       component: w(SignIn),        title: '登录'}),
  Dashboard:    new RP({path: '/',                          component: w(Dashboard),     title: '概览'}),
  // ArticleList:  new RP({path: '/article',                   component: w(ArticleList),   title: '文章列表'}),
  // ArticleAdd:   new RP({path: '/article/add',               component: w(ArticleAdd),    title: '添加文章'}),
  // ArticleEdit:  new RP({path: '/article/edit/:articleId',   component: w(ArticleEdit),   title: '编辑文章'}),
  // ArticleShow:  new RP({path: '/article/:articleId',        component: w(ArticleShow),   title: '文章详情'}),
  // QuestionList: new RP({path: '/question',                  component: w(QuestionList),  title: '问答列表'}),
  // QuestionAdd:  new RP({path: '/question/add',              component: w(QuestionAdd),   title: '添加问答'}),
  // QuestionEdit: new RP({path: '/question/edit/:questionId', component: w(QuestionEdit),  title: '编辑问答'}),
  // QuestionShow: new RP({path: '/question/:questionId',      component: w(QuestionShow),  title: '问答详情'}),
  CareerList:   new RP({path: '/career',                    component: w(CareerList),    title: '职业列表'}),
  CareerAdd:    new RP({path: '/career/add',                component: w(CareerAdd),     title: '添加职业'}),
  CareerEdit:   new RP({path: '/career/edit/:careerId',     component: w(CareerEdit),    title: '编辑职业'}),
  CareerShow:   new RP({path: '/career/:careerId',          component: w(CareerShow),    title: '职业详情'}),
  ModuleList:   new RP({path: '/module',                    component: w(ModuleList),    title: '模块列表'}),
  ModuleAdd:    new RP({path: '/module/add',                component: w(ModuleAdd),     title: '添加模块'}),
  ModuleEdit:   new RP({path: '/module/edit/:moduleId',     component: w(ModuleEdit),    title: '编辑模块'}),
  ModuleShow:   new RP({path: '/module/:moduleId',          component: w(ModuleShow),    title: '模块详情'}),

  UserTagList:  new RP({path: '/user/tag',                  component: w(UserTagList),   title: '职业标签列表'}),
  UserTagAdd:   new RP({path: '/user/tag/add',              component: w(UserTagAdd),    title: '添加职业标签'}),
  UserTagEdit:  new RP({path: '/user/tag/edit/:userTagId',  component: w(UserTagEdit),   title: '编辑职业标签'}),
  UserTagShow:  new RP({path: '/user/tag/:userTagId',       component: w(UserTagShow),   title: '职业标签详情'}),

  CardList:     new RP({path: `${CM}/card`,                 component: w(CardList),      title: '卡片列表'}),
  CardAdd:      new RP({path: `${CM}/card/add`,             component: w(CardAdd),       title: '添加卡片'}),
  CardEdit:     new RP({path: `${CM}/card/edit/:cardId`,    component: w(CardEdit),      title: '编辑卡片'}),
  CardShow:     new RP({path: `${CM}/card/:cardId`,         component: w(CardShow),      title: '卡片详情'}),

  // FeedbackList: new RP({path: })
}

// frame 下的子路由
export const frameRouteItemProps = Object.keys(PAGE)
  .filter(k => k !== 'SignIn' && k !== 'Home')
  .map(k => PAGE[k].routeProps)

// 侧边栏导航
export const frameSiderPageMenu: IPageMenu[] = [
  {key: '1', page: PAGE.Dashboard, icon: 'home', link: ''},

  {key: '4', icon: 'user', title: '职业管理', children: [
    {key: '41', page: PAGE.CareerList},
    {key: '43', page: PAGE.ModuleList},
  ]},

  {key: '5', icon: 'tags', page: PAGE.UserTagList}
  // {key: '2', icon: 'file-text', title: '文章管理', children: [
  //   {key: '21', page: PAGE.ArticleList},
  // ]},

  // {key: '3', icon: 'question-circle', title: '问题管理', children: [
  //   {key: '31', page: PAGE.QuestionList},
  // ]}
]

// 其它
export interface IPageMenu {
  key: string
  title?: string
  page?: RP<any>
  icon?: string
  link?: string
  children?: IPageMenu[]
}

function i(c) { return inject('app')(c) }
function f(c) { return createForm()(c) }
function w(c) { return i(f(c)) }
