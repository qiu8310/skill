/**
 * Create by Mora at 2017-10-18 10:23
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, loadingIfNoStates, HTML, Image} from 'pages/index/base'
import {CareerCard} from '../../widget/CareerCard'
import {Progress} from '../../widget/Progress'
import {Slider} from 'widget/Slider'

import './styles/Career.scss'
//#endregion

@inject('app')
@loadingIfNoStates({required: ['career']})
export class Career extends PageComponent<{careerId: string}, any> {
  state = {
    career: null
  }

  async componentWillMount() {
    const career = await this.api.getCareer({careerId: this.params.careerId})
    this.setState({career})
  }

  renderGender(count, className) {
    let result = []
    for (let i = 0; i < count; i++) {
      result.push(<i key={className + i} className={className} />)
    }
    return result
  }

  render() {
    const {career} = this.state
    const tired = ['低', '较低', '一般', '较高', '高']
    const enter = ['清闲', '略闲', '适中', '忙碌', '劳累']
    let [boy, girl] = career.genderDistribution.split(/\s*:\s*/)
    if (boy && girl) {
      boy = parseInt(boy, 10)
      girl = parseInt(girl, 10)
    }
    const hasStats = career.averageAge
      || (boy && girl)
      || career.degreeOfOvertime !== ''
      || career.careerJoinThreshold !== ''

    if (__DEV__) console.log(career)

    return (
      <Page name='Career' title='职业介绍'>
        <CareerCard hero career={career} />

        <div className='m mDescription'>
          <p><HTML value={career.detailIntroduction} /></p>
        </div>

        <div className='m mCharacter'>
          {career.necessaryAbility && <div className='c c1'>
            <h3>必备能力</h3>
            <p>{career.necessaryAbility}</p>
          </div>}

          {career.relatedPosts && <div className='c c2'>
            <h3>职业划分</h3>
            <p>{career.relatedPosts}</p>
          </div>}

          {career.representatives && <div className='c c3'>
            <h3>代表人物</h3>
            <p>{career.representatives}</p>
          </div>}
        </div>

        {hasStats && <div className='m mStatistics'>
          <h3>职业统计</h3>
          <div className='gTextCenter'>
            {career.averageAge && <div className='stat'>
              <div className='l'>平均年龄</div>
              <div className='age'>{career.averageAge}</div>
            </div>}
            {(boy && girl) && <div className='stat'>
              <div className='l'>男女比例</div>
              <div className='rate'><span className='blue'>{boy}</span>&nbsp;:&nbsp;<span className='red'>{girl}</span></div>
              <div className='boygirl gFlexContainer gSpaceBetweenChildren'>
                {this.renderGender(boy, 'boy')}
                {this.renderGender(girl, 'girl')}
              </div>
            </div>}
            {career.degreeOfOvertime !== '' && <div className='stat'>
              <div className='l'>操劳指数</div>
              <div className='v'>{tired[career.degreeOfOvertime + 2]}</div>
              <Progress disabled className='p' min={-3} max={2} hideText value={career.degreeOfOvertime} />
            </div>}
            {career.careerJoinThreshold !== '' && <div className='stat'>
              <div className='l'>入行门槛</div>
              <div className='v'>{enter[career.careerJoinThreshold + 2]}</div>
              <Progress disabled className='p' min={-3} max={2} hideText value={career.careerJoinThreshold} />
            </div>}
          </div>
        </div>}

        {(career.articles || career.videos) && <div className='m mResource'>
          <h3>学习资源</h3>
          {career.articles && <div className='c'>
            <h4>入行文章</h4>
            <div className='articles'>
              {career.articles.map(a => <a key={a.id} href={a.articleUrl} className='article'>
                <div className='atitle'>{a.title}</div>
                <div className='adesc gLineClamp gLineClamp3'>{a.digest}</div>
              </a>)}
            </div>
          </div>}

          {career.videos && <div className='c'>
            <h4>基础课程</h4>
            <div className='videos'>
              {career.videos.map(v => <a className='video' href={v.videoUrl}>
                <Image width={330} height={240} src={v.imgUrl} />
                <i className='play' />
                <div className='bottom'>
                  <div className='vtitle'>{v.title}</div>
                  <div className='vdesc gLineClamp gLineClamp1'>{v.other}</div>
                </div>
              </a>)}
            </div>
          </div>}
        </div>}

        {!career.relatedCareers || !career.relatedCareers.length ? null : (
          <div className='m mRelative'>
            <h3>相关职业</h3>
            <Slider sideGap={22} itemGap={10} itemWidth={330} itemHeight={350}>
              {career.relatedCareers.map(c => <CareerCard key={c.id} career={c} />)}
            </Slider>
          </div>
        )}

        {/* <a className='heart active' /> */}
      </Page>
    )
  }
}
