/**
 * Create by Mora at 2017-11-08 14:10
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, loadingIfNoStates} from 'pages/index/base'
import {CareerCard} from 'pages/index/widget/CareerCard'

import './styles/TestCareersV3.scss'
//#endregion

@inject('app')
@loadingIfNoStates({required: 'careers'})
export class TestCareersV3 extends PageComponent<{type: 'good' | 'bad'}, any> {
  state = {
    careers: null
  }

  async componentWillMount() {
    let {unsuitableCareers, relatedCareers} = await this.api.getTestResult()
    this.setState({careers: this.params.type === 'bad' ? unsuitableCareers : relatedCareers})
  }

  render() {
    let {type} = this.params
    let no = type === 'bad' ? '不' : ''
    return (
      <Page name='TestCareersV3' title='六型人格测试'>
        <h1>你{no}适合的职业</h1>
        <p>根绝你的测试为你推荐你可能{no}适合的职业。</p>
        <div className='box'>
          {this.state.careers.map(c => <CareerCard key={c.id} noLink career={c} />)}
        </div>
      </Page>
    )
  }
}
