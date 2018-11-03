/**
 * Create by Mora at 2017-11-09 10:50
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, Link} from 'pages/index/base'
import {Box} from 'pages/index/widget/Box'

import './styles/ExploreV3.scss'
//#endregion

@inject('app')
export class ExploreV3 extends PageComponent<any, any> {

  maps = [
    {careerId: 1, img: require('./styles/images/explore1@3x.jpg')},
    {careerId: 3, img: require('./styles/images/explore3@3x.jpg')},
    {careerId: 2, img: require('./styles/images/explore2@3x.jpg')},
    {careerId: 0, img: require('./styles/images/explore4@3x.jpg')}
  ]
  render() {
    return (
      <Page name='ExploreV3' title={this.rp.ExploreV3.title}>
        <div className='head gSpaceBetweenChildren'>
          <h1 className='name'>探索</h1>
          <p className='all'>目前已收录<strong>758</strong>个职业</p>
        </div>

        <Box title='测测你的职业可能性'>
          <Link to={this.rp.TestQuestionV3.link()}>
            <Image className='test' width={p2r(335)} height={p2r(80)} src={require('./styles/images/test1@3x.png')} ratio={3} />
          </Link>
          <Image className='test' width={p2r(335)} height={p2r(80)} src={require('./styles/images/test2@3x.png')} ratio={3} />
        </Box>

        <Box title='职业探索地图'>
          <div className='maps gClearfix'>
            {this.maps.map(({careerId, img}, i) => (
              <a key={i} className='map' href={careerId ? '#' + this.rp.CareerSystemV3.link({params: {careerId}}) : null}>
                <Image width={p2r(160)} height={p2r(100)} ratio={3} src={img} />
              </a>
            ))}
          </div>
        </Box>
      </Page>
    )
  }
}
