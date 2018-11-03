/**
 * Create by Mora at 2017-11-09 10:35
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, observer, Button, classSet} from 'pages/index/base'
import {Fixed, TransitionRoute} from 'mora-common'
import {NavLink} from 'react-router-dom'

import './styles/StartV3.scss'
//#endregion

@inject('app')
@observer
export class StartV3 extends PageComponent<any, any> {
  get isHome() {
    return ['/v3', '/v3/'].indexOf(this.props.location.pathname) >= 0
  }

  setBg() {
    document.body.style.background = this.isHome ? 'white' : '#F1F1F1'
  }

  componentDidMount() {
    this.setBg()
  }

  componentDidUpdate(prevProps, prevState) {
    this.setBg()
  }

  componentWillUnmount() {
    document.body.style.background = ''
  }

  onClickCareer(bid: number) {
    let {careerBids} = this.app
    if (careerBids.indexOf(bid) >= 0) {
      careerBids = careerBids.filter(i => i !== bid)
    } else {
      careerBids.push(bid)
    }
    this.app.careerBids = [...careerBids]
  }

  renderHome() {
    let {careerBids} = this.app
    return (
      <div className='pStartV3-home'>
        <p className='top'>选择你感兴趣的职业</p>

        <ul className='careers'>
          {this.app.careers.map(c => (
            <li
              onClick={this.onClickCareer.bind(this, c.bid)}
              key={c.id}
              className={classSet('career', {active: careerBids.indexOf(c.bid) >= 0})}
            >{c.name}</li>
          ))}
        </ul>

        <Fixed holder height={p2r(62)}>
          <Button to={this.rp.HomeV3.link()} className='btn' disabled={careerBids.length === 0} width={335} height={42} center>进入首页</Button>
        </Fixed>
      </div>
    )
  }

  renderMenu() {
    let {rp} = this
    return (
      <Fixed height={p2r(49)} holder>
        <div className='pStartV3-nav gSpaceBetweenChildren'>
          <NavLink className='link home' to={rp.HomeV3.link()} />
          <NavLink className='link explore' to={rp.ExploreV3.link()} />
          <NavLink className='link user' to={rp.UserV3.link()} />
        </div>
      </Fixed>
    )
  }

  render() {
    let {rp, isHome} = this
    return (
      <Page name='StartV3'>

        <TransitionRoute items={[
          rp.HomeV3.routeProps,
          rp.ExploreV3.routeProps,
          rp.UserV3.routeProps
        ]}/>

        {isHome ? this.renderHome() : this.renderMenu()}

      </Page>
    )
  }
}
