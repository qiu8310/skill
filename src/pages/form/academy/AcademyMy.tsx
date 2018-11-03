/**
 * Create by Mora at 2017-12-21 14:11
 * All right reserved
 */

//#region import
import {React, Page, page} from 'mobx/FormApp'
import {Image} from 'mora-common'
import {Link} from 'common'
//#endregion

import {RawAcademyUser} from './AcademyUser'

import './styles/AcademyMy.scss'

@page
export class AcademyMy extends RawAcademyUser {
  renderPage() {
    const {data} = this.state
    return (
      <Page name='AcademyMy'>
        <div className='top'>
          <div className='row gFlexContainer'>
            <Image src={data.avatar} bg className='avatar' />
            <div className='name gFlex'>{data.username}</div>
            <Link className='zone' to={this.rp.AcademyUser.link()}>
              个人主页&nbsp;<i className='fas fa-angle-right' />
            </Link>
          </div>
        </div>

        <div className='weui-panel' style={{marginTop: 0}}>
          <div className='weui-panel__bd'>
            <div className='weui-media-box weui-media-box_small-appmsg'>
              <div className='weui-cells'>
                <a className='weui-cell weui-cell_access' href='javascript:;'><div className='weui-cell__bd weui-cell_primary'>提醒</div></a>
              </div>
            </div>
          </div>
        </div>

        <div className='weui-panel'>
          <div className='weui-panel__bd'>
            <div className='weui-media-box weui-media-box_small-appmsg'>
              <div className='weui-cells'>
                <a className='weui-cell weui-cell_access' href='javascript:;'><div className='weui-cell__bd weui-cell_primary'>学分</div></a>
                <a className='weui-cell weui-cell_access' href='javascript:;'><div className='weui-cell__bd weui-cell_primary'>课程</div></a>
                <a className='weui-cell weui-cell_access' href='javascript:;'><div className='weui-cell__bd weui-cell_primary'>收藏</div></a>
                <a className='weui-cell weui-cell_access' href='javascript:;'><div className='weui-cell__bd weui-cell_primary'>设置</div></a>
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
