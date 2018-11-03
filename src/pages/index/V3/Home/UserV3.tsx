/**
 * Create by Mora at 2017-11-09 10:50
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, loadingIfNoStates, Link} from 'pages/index/base'
import {Box} from 'pages/index/widget/Box'
import {LearnItem} from 'pages/index/widget/LearnItem'

import './styles/UserV3.scss'
//#endregion

@inject('app')
@loadingIfNoStates({required: ['report', 'items']})
export class UserV3 extends PageComponent<any, any> {
  state = {
    hasReport: false,
    report: null,
    items: null
  }

  async fetchReport() {
    let res = await this.api.hasTestResult()
    let hasReport = res > 0
    let report = {}
    if (hasReport) {
      report = await this.api.getTestResult()
    }
    return {hasReport, report}
  }
  async fetchLearnItems() {
    return await this.api.getFavLearnItems()
  }

  async componentWillMount() {
    let [res, items] = await Promise.all([this.fetchReport(), this.fetchLearnItems()])
    this.setState({...res, items})
  }

  render() {
    let {rp} = this
    const {hasReport, report, items} = this.state
    return (
      <Page name='UserV3' title={rp.UserV3.title}>
        <div className='head'>
          <h1 className='name'>我的</h1>
        </div>

        {hasReport && <Box title='我的测评'>
          <Link className='test' to={this.rp.TestResultV3.link()}>
            <p>六型人格职业测试</p>
            <p>测试结果：{report.actual.name}{report.result}</p>
          </Link>
        </Box>}

        <Box title='我的收藏'>
          {items.length ? items.map(it => <LearnItem key={it.id} data={it} />) : <p className='nofav'>暂无收藏</p>}
        </Box>
      </Page>
    )
  }
}
