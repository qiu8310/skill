import { observable, computed } from 'mobx'

import {Mobx} from './Mobx'

export declare type IUserJSONData = Pick<User, 'account' | 'name' | 'avatar' | 'token'>
export class User extends Mobx {
  serializableKeys = ['account', 'name', 'avatar', 'token']

  /** 登录时用的用户帐号 */
  account: string

  /** 显示用的用户名称 */
  @observable name: string

  /** 显示用的用户头像 */
  @observable avatar: string
  token: string

  @computed get isSigned(): boolean {
    return !!this.token
  }
}
