/**
 * Create by Mora at 2017-10-12 11:15
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, Button, Loading} from 'pages/index/base'
import {CharacterChart} from 'widget/CharacterChart'
import {Slider} from 'widget/Slider'
import {CareerCard} from '../../widget/CareerCard'

import './styles/TestResult.scss'
//#endregion

@inject('app')
export class TestResult extends PageComponent<any, any> {
  state = {
    report: null
  }

  async componentWillMount() {
    let report = await this.api.getTestResult()
    this.setState({report})
  }

  renderRecommend(jobs) {
    return (
      <Slider sideGap={22} itemGap={10} itemWidth={330} itemHeight={350}>
        {jobs.map(c => <CareerCard key={c.id} career={c} />)}
      </Slider>
    )
  }

  render() {
    const {report} = this.state
    return (
      <Page name='TestResult' title='六型人格测试'>
        {
          !report
            ? <Loading />
            : (
              <div>
                <div className='top gWhite gTextCenter'>
                  <div className='text'>
                    <p>测试结果</p>
                    <p className='result'>{report.actual.name}</p>
                  </div>

                  <div className='contrasts gSpaceAroundChildren'>
                    <div className='contrast'>
                      <p>你的选择</p>
                      <Image className='avatar' src={report.expect.icon} ratio={3} width={98} height={98} rounded />
                      <p className='name'>{report.expect.name}</p>
                    </div>

                    <div className='contrast'>
                      <p>现实结果</p>
                      <Image className='avatar' src={report.actual.icon} ratio={3} width={98} height={98} rounded />
                      <p className='name'>{report.actual.name}</p>
                    </div>
                  </div>

                  <p className='p tip'>类型解读</p>
                  <p className='p feature'>共同特点：{report.commonFeature}</p>
                  <p className='p jobs'>典型职业：{report.recommendJob}</p>
                </div>

                <div className='chart'>
                  <div className='activeColor gTextCenter'>
                    <p>根据数据分析，你的代码可能是：</p>
                    <p className='result'>{report.result}</p>
                  </div>
                  <CharacterChart values={report.resultDetail.map(i => i.score / 7)} />
                  <p className='tip'>
                    1.你适合的兴趣范畴在蓝色六边形相对集中的区域；
                    <br />
                    2.若蓝色区域呈正六边形或接近六边形，属于罕见情况，本报告及多边图形可能无效
                  </p>
                  <hr />
                </div>

                {
                  report.relatedCareers
                    ? (
                      <div className='recommend gTextCenter gNoSelect'>
                        <div>
                          <p className='title'>你适合的职业</p>
                          {this.renderRecommend(report.relatedCareers)}
                        </div>
                      </div>
                    )
                    : null
                }

                <div className='btns gSpaceBetweenChildren'>
                  <Button to={this.rp.TestIntro.link()} className='btn' width={160} height={34} activeColor='#16BCD9'>重新测试</Button>
                  <Button className='btn' width={160} height={34} to={this.rp.CareerAllList.link()} activeColor='#16BCD9' type='reverse'>返回首页</Button>
                </div>
              </div>
            )
        }
      </Page>
    )
  }
}
