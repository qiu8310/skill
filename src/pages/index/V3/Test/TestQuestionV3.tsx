/**
 * Create by Mora at 2017-10-12 11:15
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, Button, inject, classSet} from 'pages/index/base'
import {Scroller} from 'widget/InfiniteScroller'
import './styles/TestQuestionV3.scss'
//#endregion

interface IQuestion {content: string, id: number, noIcon: string, yesIcon: string, noMemo: string, yesMemo: string}

@inject('app')
export class TestQuestionV3 extends PageComponent<any, any> {
  state = {
    total: 0,
    answerMap: {}
  }

  submit = async () => {
    const {answerMap} = this.state
    let arr = Object.keys(answerMap).reduce((all, k) => {
      all.push({questionId: k, answer: answerMap[k]})
      return all
    }, [])
    await this.api.setTestCharacter({characterId: 1})
    await this.api.setTestQuestionAnswers({__raw_data_v1: arr})
    this.app.gotoLink(this.rp.TestResultV3.link())
  }

  load = async () => {
    let questions: IQuestion[] = await this.api.getTestQuestions()
    this.setState({total: questions.length})
    return {items: questions, loadable: false}
  }

  yes = (q: IQuestion) => {
    const {answerMap} = this.state
    return () => this.setState({answerMap: {...answerMap, [q.id]: true}})
  }

  no = (q: IQuestion) => {
    const {answerMap} = this.state
    return () => this.setState({answerMap: {...answerMap, [q.id]: false}})
  }

  renderQuestion = (q: IQuestion) => {
    const {answerMap} = this.state
    const val = answerMap[q.id]

    return (
      <div className='question'>
        {q.content}

        <div className='choices gFlexContainer gSpaceBetweenChildren'>
          <div className={classSet('gFlexContainer', {active: val === true})} onClick={this.yes(q)}><i className='icon' /><span>是</span></div>
          <div className={classSet('gFlexContainer', {active: val === false})} onClick={this.no(q)}><i className='icon' /><span>否</span></div>
        </div>
      </div>
    )
  }

  render() {
    const {answerMap, total} = this.state
    return (
      <Page name='TestQuestionV3' title='六型人格测试'>
        <div className='hero'>
          人格和职业有着密切的关系，该测试可以帮助您作一次简单的人格自评，从而更加清楚自己的人格特征更适合从事哪方面的工作。
        </div>

        <Scroller
          load={this.load}
          render={this.renderQuestion}
          containerProps={{itemHeightUnchangable: true, nodeLoaded: null}}
        />

        <Button className='btn' onClick={this.submit} disabled={Object.keys(answerMap).length !== total} center width={335} height={42}>提交</Button>
      </Page>
    )
  }
}
