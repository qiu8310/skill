/**
 * Create by Mora at 2017-10-12 11:15
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, classSet, Loading} from 'pages/index/base'
import {loadImage} from 'mora-common'

import './styles/TestQuestion.scss'
//#endregion

interface IQuestion {content: string, id: number, noIcon: string, yesIcon: string, noMemo: string, yesMemo: string}

@inject('app')
export class TestQuestion extends PageComponent<any, {questions: IQuestion[], index: number, progress: number}> {
  state = {
    questions: [],
    index: 0,
    progress: 0
  }

  answers = []

  next = async (answer: boolean) => {
    const {index, questions} = this.state
    this.answers.push({
      questionId: questions[index].id,
      answer
    })
    if (index === questions.length - 1) {
      await this.api.setTestQuestionAnswers({__raw_data_v1: this.answers})
      this.app.gotoLink(this.rp.TestResult.link())
    } else {
      this.setState({index: index + 1, progress: (index + 1) * 100 / questions.length})
    }
  }
  choseYes = () => this.next(true)
  choseNo = () => this.next(false)

  async componentWillMount() {
    let questions: IQuestion[] = await this.api.getTestQuestions()
    this.setState({questions}, () => {
      questions.forEach(q => {
        q.yesIcon && loadImage(q.yesIcon)
        q.noIcon && loadImage(q.noIcon)
      })
    })
  }

  renderImages(images) {
    return (
      <div className='images gSpaceAroundChildren'>
        {images.map(i => <Image fade={false} key={i} src={i} width={100} height={100} />)}
      </div>
    )
  }

  render() {
    const {index, progress, questions} = this.state

    const question = questions[index]
    const isImageChoice = !!(question && question.noIcon && question.yesIcon)

    return (
      <Page name='TestQuestion' title='六型人格测试'>
        <div className='progress'>
          <div className='done' style={{width: `${Math.max(0, Math.min(100, progress))}%`}}>
            <i className='dot gRounded' />
          </div>
        </div>

        {
          questions.length
            ? (
              <div className={classSet({isImageChoice})}>
                <div className='number gTextCenter'>第 {index + 1} 题</div>
                <div className='question gBlack'>
                  <div className='title gTextCenter'>{question.content}</div>

                  <div className={classSet('choices gSpaceAroundChildren')}>
                    <div className='choice gRounded' onClick={this.choseYes}>
                      {isImageChoice ? <div><Image src={question.yesIcon} fade={false} ratio={3} square={p2r(120)} /><p>{question.yesMemo}</p></div> : '是'}
                    </div>
                    <div className='choice gRounded' onClick={this.choseNo}>
                    {isImageChoice ? <div><Image src={question.noIcon} fade={false} ratio={3} square={p2r(120)} /><p>{question.noMemo}</p></div> : '否'}
                    </div>
                  </div>
                </div>
              </div>
            )
            : <Loading />
        }
      </Page>
    )
  }
}
