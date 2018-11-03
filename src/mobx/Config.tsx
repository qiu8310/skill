/**
 * 所有文件都可以用的一个配置文件
 */
import {IConfig} from 'global'

const loginUrl = (tag: string) => `${location.protocol}//${location.hostname}/wx/${tag}/navigate/index`

const Config: IConfig = {
  appName: '职业大未来',
  hash: true,

  signinLink: '/signin',                    // 登录页
  homeLink: '/',

  dateFormat: 'yyyy-mm-dd HH:ii',
  uploader: 'http://114.55.225.126/upload'  // 上传图片接口，给 CKEditor 和 Uploader 组件用的
}

export const AdminConfig = Config
export const FormConfig: IConfig = {...Config, appName: 'Origin University', signinLink: loginUrl('v3')}
export const TryDesignLabConfig: IConfig = {...Config, appName: 'Design Lab'}
export const IndexConfig: IConfig = {...Config, signinLink: loginUrl('v1')}
export const NeoConfig: IConfig = {...Config, appName: 'mora-common'}
