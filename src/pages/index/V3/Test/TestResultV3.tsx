/**
 * Create by Mora at 2017-10-12 11:15
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Button, loadingIfNoStates} from 'pages/index/base'
import {CharacterChart} from 'widget/CharacterChart'

import './styles/TestResultV3.scss'
//#endregion

@inject('app')
@loadingIfNoStates({required: 'report'})
export class TestResultV3 extends PageComponent<any, any> {
  state = {
    report: null
  }

  async componentWillMount() {
    let report = await this.api.getTestResult()
    this.setState({report})
  }

  render() {
    const {report} = this.state
    return (
      <Page name='TestResultV3' title='六型人格测试'>
        <div className='head gWhite'>
          <p className='l1 gBold'>测试结果</p>
          <p className='l2 gBold'>{report.actual.name}</p>
          <p className='l3 gJustify'>{report.commonFeature}</p>
        </div>
        <div className='chart'>
          <div className='gOverHide'>
            <p className='l1'>根据数据分析，你的代码可能是：</p>
            <p className='l2 gBold'>{report.result}</p>
          </div>
          <div className='canvas'>
            <CharacterChart values={report.resultDetail.map(i => i.score / 7)} />
          </div>
        </div>

        <div>
          <div className='btns gSpaceBetweenChildren'>
            <Button to={this.rp.TestCareersV3.link({type: 'good'})} className='btn' width={160} height={42}>适合职业</Button>
            <Button to={this.rp.TestCareersV3.link({type: 'bad'})} className='btn' width={160} height={42} type='reverse'>不适合职业</Button>
          </div>
        </div>

      </Page>
    )
  }
}
