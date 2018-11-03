/**
 * Create by Mora at 2017-11-09 10:50
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, Link, IAppComponentProps} from 'pages/index/base'
import {Render, renderAfterDidMount} from 'mora-common'
import {Slider} from 'widget/Slider'
import {SearchModal} from 'pages/index/widget/SearchModal'
import {Box} from 'pages/index/widget/Box'
import {LearnItem} from 'pages/index/widget/LearnItem'

import './styles/HomeV3.scss'
//#endregion

@inject('app')
export class HomeV3 extends PageComponent<any, any> {
  state = {
    showSearch: false,
    learnItems: []
  }
  async fetchLearnItems() {
    let {careerBids} = this.app
    if (!careerBids.length) return []
    return await this.api.getLearnItems({query: {careerIds: careerBids.map(i => i).join(',')}})
  }

  async componentWillMount() {
    let learnItems = await this.fetchLearnItems()
    this.setState({learnItems})
  }

  render() {
    let {careers, careerBids} = this.app
    const {learnItems} = this.state

    careers = careerBids.map(bid => careers.find(c => c.bid === bid)).filter(c => !!c)
    return (
      <Page name='HomeV3' title={this.rp.HomeV3.title}>
        <div className='head gSpaceBetweenChildren'>
          <h1 className='name'>首页</h1>
          <i className='search' onClick={() => this.setState({showSearch: true})} />
        </div>

        <Box title='与我相关'>
          <Slider injectViewer itemGap={20} itemWidth={150} itemHeight={190}>
            {careers.map(c => <Career key={c.id} career={c} />)}
          </Slider>
        </Box>

        <Box title='学习清单'>
          {learnItems.map(item => <LearnItem data={item} key={item.id} />)}
        </Box>

        {
          this.state.showSearch && (
            <Render>
              <SearchModal noLink onClose={() => this.setState({showSearch: false})} />
            </Render>
          )
        }

      </Page>
    )
  }
}


@inject('app')
@renderAfterDidMount()
class Career extends React.PureComponent<IAppComponentProps & {career: {id: number, img: string, name: string}, getViewer?: () => Element}, any> {
  render() {
    let c = this.props.career
    return (
      <Link className='career' to={this.props.app.rp.CareerV3.link({careerId: c.id})}>
        <Image className='avatar' container={this.props.getViewer} square={p2r(150)} ratio={3} src={c.img} />
        <div className='name gTextCenter' children={c.name} />
      </Link>
    )
  }
}
