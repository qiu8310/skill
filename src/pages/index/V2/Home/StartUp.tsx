/**
 * Create by Mora at 2017-10-17 17:05
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, Button} from 'pages/index/base'
import {Intro} from 'widget/Intro'

import './styles/StartUp.scss'
// import {Redirect} from 'react-router-dom'
// <Redirect to={this.rp.CareerAllList.link()} />
//#endregion

@inject('app')
export class StartUp extends PageComponent<any, any> {
  test = () => this.app.gotoLink(this.rp.TestIntro.link())
  home = () => this.app.replaceLink(this.rp.CareerAllList.link())

  render() {
    return (
      <Page name='StartUp' title='职业大未来'>
        <div className='view'>
          <Intro fullscreen>
            <div className='guide'>
              <p>这里你可以看到1000＋的职业攻略</p>
              <Image ratio={3} width={p2r(276)} height={p2r(312)} src={require('./styles/images/intro1@3x.jpg')} />
            </div>
            <div className='guide'>
              <p>多维度的探索职业发展和学习</p>
              <Image ratio={3} width={p2r(280)} height={p2r(301)} src={require('./styles/images/intro2@3x.jpg')} />
            </div>
            <div className='guide'>
              <p>多样有趣的职业可能性测试</p>
              <Image ratio={3} width={p2r(278)} height={p2r(292)} src={require('./styles/images/intro3@3x.jpg')} />

              <Button onClick={this.test} className='test' width={256} height={48} children='进入测试' />
              <a className='jump' onClick={this.home}>跳过》</a>
            </div>
          </Intro>
        </div>
      </Page>
    )
  }
}
