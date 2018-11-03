/**
 * Create by Mora at 2017-10-18 14:29
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject} from 'pages/index/base'
import {Menu} from '../../widget/Menu'
import {CareerCard} from '../../widget/CareerCard'
//#endregion

@inject('app')
export class CareerFavList extends PageComponent<any, any> {
  render() {
    return (
      <Page name='CareerFavList' title='我的收藏'>
        <Menu>
          <CareerCard career={{id: 1, nameEn: 'Fashion Buyer',      nameZh: '时尚买手',   icon: 'http://lcdn.static.lotlot.com/fashion-buyer@3x-20ac58c1.jpg?imageslim'}} />
          <CareerCard career={{id: 2, nameEn: 'Radio Broadcaster',  nameZh: '电台主播',   icon: 'http://lcdn.static.lotlot.com/radio-broadcaster@3x-d944c2e4.jpg?imageslim'}} />
          <CareerCard career={{id: 3, nameEn: 'Producer',           nameZh: '制片人',     icon: 'http://lcdn.static.lotlot.com/producer@3x-e2e33295.jpg?imageslim'}} />
          <CareerCard career={{id: 4, nameEn: 'Stuntman',           nameZh: '替身演员',   icon: 'http://lcdn.static.lotlot.com/stuntman@3x-ca53c8a5.jpg?imageslim'}} />
        </Menu>
      </Page>
    )
  }
}
