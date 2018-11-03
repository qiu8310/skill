export interface IConfig {
  /** 站点中文名称 */
  appName: string

  /** 是否是用 hash 来做路由的 */
  hash: boolean

  /** 主页地址 */
  homeLink: string
  /** 登录页地址 */
  signinLink: string

  dateFormat: string
  uploader?: string
}

export interface IBreadcrumb {
  icon?: string
  title?: string
  link?: string
}

export enum CardType {
  // 注意：顺序不要换，也不能删除，这个字段会写入后台数据库
  TEXT = 1, BOOK, SOFT
}

export const CardTypes = [
  {id: CardType.TEXT, name: '文本'},
  {id: CardType.BOOK, name: '图书'},
  {id: CardType.SOFT, name: '软件'},
]

export enum CareerType {
  EXPECT = 1, BUILD, NORMAL
}

export const ExpectCareerLabel = '许愿'
export const BuildCareerLabel = '共创'

export const CareerTypes = [
  {id: CareerType.EXPECT, name: ExpectCareerLabel},
  {id: CareerType.BUILD, name: BuildCareerLabel},
  {id: CareerType.NORMAL, name: '完成'}
]
