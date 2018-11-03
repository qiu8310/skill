/**
 * Create by Mora at 2017-12-20 10:39
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Markdown} from 'widget/Markdown'
import {jsonfy} from 'common/'
import {Image, renderAfterDidMount, Fixed, Modal} from 'mora-common'
import {Slider} from 'widget/Slider'
import {Text} from 'widget/Text'

import './styles/ArtClass.scss'
//#endregion

interface IData {
  name: string
  applyCount: string
  restApplyCount: string
  poster: string
  descHtml: string
  peoplesTitle: string
  peoples: Array<{
    name: string
    avatar: string
    title: string
    descHtml: string
  }>
  timelineTitle: string
  timelineDescHtml: string
  timeline: Array<{
    name: string
    time?: string
    desc?: string
    html: string
  }>
  qaTitle: string
  qa: Array<{
    question: string
    answerHtml: string
  }>
  extraTitle: string
  extraText: string
  extraLink: string
}

@page
export class ArtClass extends PageComponent<{id: string}> {
  state: {data: IData, modal: boolean} = {data: null, modal: false}
  onMarkdown = (source: string, root: HTMLDivElement, data: IData) => {
    data.descHtml = root.querySelector('.desc').innerHTML
    data.poster = (root.querySelector('.level-0 img') as any).src

    let p = root.querySelector('.peoples')
    if (p) {
      data.peoplesTitle = q(p, 'h2')
      data.peoples = p.querySelectorAll('li').map((li: HTMLLIElement) => {
        let first = li.firstElementChild
        let link = first.firstElementChild as HTMLLinkElement
        let title = first.lastChild.textContent.trim()
        li.removeChild(first)
        return {
          name: link.textContent.trim(),
          avatar: link.href,
          title,
          descHtml: li.innerHTML
        }
      })
    }

    let t = root.querySelector('.timeline')
    if (t) {
      data.timelineTitle = q(t, 'h2')
      t.removeChild(t.querySelector('h2'))
      let ul: HTMLUListElement = t.querySelector('ul')

      data.timeline = ul.querySelectorAll('li').map((li: HTMLLIElement) => {
        let first = li.firstElementChild
        let d = jsonfy<any>(first.textContent.trim(), 'name')
        li.removeChild(first)
        d.html = li.innerHTML
        return d
      })

      t.removeChild(ul)
      data.timelineDescHtml = t.innerHTML
    }

    let qa = root.querySelector('.qa')
    if (qa) {
      data.qaTitle = q(qa, 'h2')
      data.qa = qa.querySelectorAll('li').map((li: HTMLLIElement) => {
        let first = li.firstElementChild
        li.removeChild(first)
        return {
          question: first.textContent.trim(),
          answerHtml: li.innerHTML
        }
      })
    }

    let e = root.querySelector('.extra')
    if (e) {
      data.extraTitle = q(e, 'h2')
      let link = e.querySelector('a')
      data.extraLink = link.getAttribute('href')
      data.extraText = link.textContent.trim()
    }

    this.setState({data})
    return false
  }

  render() {
    const {data} = this.state
    const N = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    if (!data) return <Markdown url={this.app.location.query.file} resolveText wrap onMarkdown={this.onMarkdown} />
    return (
      <Page name='ArtClass'>
        <Image src={data.poster} width={'100%'} />
        {data.descHtml && <div className='box descBox' dangerouslySetInnerHTML={{__html: data.descHtml}} />}

        {data.peoples && <div className='box peoplesBox'>
          <h2>{data.peoplesTitle}</h2>
          <Slider itemWidth={300} itemGap={20} injectViewer>
            {data.peoples.map((p, pi) => <People key={pi} {...p} />)}
          </Slider>
        </div>}

        {data.timeline && <div className='box timelineBox'>
          <h2>{data.timelineTitle}</h2>
          {data.timelineDescHtml ? <div className='desc' dangerouslySetInnerHTML={{__html: data.timelineDescHtml}} /> : null}
          {data.timeline.map((t, ti) => (
            <div className='timeline' key={ti}>
              <div className='head gFlexContainer gSpaceBetweenChildren'>
                <span className='n'>第{N[ti]}周</span>
                <time>{t.time}</time>
              </div>
              <h3>{t.name}</h3>
              {t.desc && <label>—— {t.desc}</label>}

              {t.html && <div className='other' dangerouslySetInnerHTML={{__html: t.html}} />}
            </div>
          ))}
        </div>}

        {data.qa && <div className='box qaBox'>
          <h2>{data.qaTitle}</h2>
          <ul>
            {data.qa.map((qa, qi) => (
              <li key={qi}>
                <Text lineClassName='line' className='question'>{qa.question}</Text>
                <div className='answer' dangerouslySetInnerHTML={{__html: qa.answerHtml}} />
              </li>
            ))}
          </ul>
        </div>}

        <div className='box extraBox'>
          <h2>{data.extraTitle}</h2>
          <Image src={data.extraLink} width='100%' />
          <p style={{margin: '20px 0'}}>{data.extraText}</p>
        </div>

        {(data.peoples || data.timeline || data.qa) && <div className='foot'>
            <div className='img'>
              <Image lazyload={false} src='//n1image.hjfile.cn/res7/2017/12/21/c8560d294a4452ebbfb9c1bf7ecb3576.jpg?imageView2/0/format/jpg/interlace/1/q/70' ratio={3} width='100%' />
            </div>

            <Fixed height={50}>
              <div className='gFlexContainer'>
                <div className='text gFlex'>已报名{data.applyCount}人，剩余{data.restApplyCount}人</div>
                <a className='btn' onClick={() => this.setState({modal: true})}>我要报名</a>
              </div>
            </Fixed>
        </div>}

        {this.state.modal ? <Modal closeOnClickMask closeModal={() => this.setState({modal: false})}>
            <div className='modal'>
              <p>您已报名<strong>《{data.name}》</strong>共创活动</p>
              <p>稍后我们会将活动申请表发送至你的邮件</p>
              <a className='btn' onClick={() => this.setState({modal: false})}>我知道了</a>
            </div>
        </Modal> : null}
      </Page>
    )
  }
}

function q(root: Element, selector: string, html?: boolean) {
  let el = root.querySelector(selector)
  if (el) {
    return (html ? el.innerHTML : el.textContent).trim()
  }
  return ''
}

@renderAfterDidMount()
class People extends React.Component<{name: string, avatar: string, title: string, descHtml: string, getViewer?: any}> {
  render() {
    const {name, title, avatar, descHtml, getViewer} = this.props
    return (
      <div className='people'>
        <div className='gFlexContainer'>
          <Image src={avatar} width={90} height={90} container={getViewer} />
          <div className='gFlex'>
            <div className='name'>{name}</div>
            <div className='title'>{title}</div>
          </div>
        </div>
        <div className='desc' dangerouslySetInnerHTML={{__html: descHtml}} />
      </div>
    )
  }
}
