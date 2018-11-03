/**
 * Create by Mora at 2017-12-20 10:39
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Markdown} from 'widget/Markdown'
import {Link} from 'common/'
import {Slider} from 'widget/Slider'
import {classSet, Image, renderAfterDidMount} from 'mora-common'

import './styles/ArtHome.scss'
//#endregion

// empty 图片：

interface IData {
  university: string
  faculty: string
  majors: IMajor[]
}

interface IMajor {
  title: string
  peoplesTitle: string
  peoples: Array<{
    name: string
    avatar: string
    desc: string
  }>
  recuritTitle: string
  recruitPoster: string
  recruitFile: string
  timelineTitle: string
  timeline: Array<{
    name: string
    time?: string
    status: string
    step?: 'prev' | 'current' | 'next'
  }>
}

let INDEX = 0

@page
export class ArtHome extends PageComponent<any> {
  state: {data: IData, majorIndex: number} = {data: null, majorIndex: INDEX}
  onMarkdown = (source: string, root: HTMLDivElement, data: any) => {
    data.majors = root.querySelectorAll('.level-1')
      .map((l1: HTMLDivElement) => {
        let title = q(l1, 'h1')
        let major: IMajor = {title} as any

        let p = l1.querySelector('.peoples')
        if (p) {
          major.peoplesTitle = q(p, 'h2')
          major.peoples = p.querySelectorAll('li').map((li: HTMLLIElement) => {
            return {
              name: li.firstElementChild.textContent.trim(),
              avatar: (li.firstElementChild as HTMLLinkElement).href,
              desc: li.lastChild.textContent.trim()
            }
          })
        }

        let r = l1.querySelector('.recruit')
        if (r) {
          major.recuritTitle = q(r, 'h2')
          major.recruitPoster = r.querySelector('img').src
          major.recruitFile = r.querySelector('a').getAttribute('href')
        }

        let t = l1.querySelector('.timeline')
        if (t) {
          major.timelineTitle = q(t, 'h2')
          major.timeline = t.querySelectorAll('li').map((li: HTMLLIElement) => {
            let [name, status, time] = li.textContent.trim().split(/\s*\|\s*/)
            return { name, status, time }
          })
          let step: any = 'prev'
          major.timeline.forEach((tl, i) => {
            if (tl.status === '课程筹备中') step = 'next'
            if (tl.status === '共创招募中') {
              tl.step = 'current'
              step = 'next'
            } else {
              tl.step = step
            }
          })
        }
        return major
      })
    this.setState({data})
    return false
  }

  render() {
    const {rp} = this
    const {data, majorIndex} = this.state
    if (!data) return <Markdown url='/p/form/art/home.md' resolveLink resolveText wrap onMarkdown={this.onMarkdown} />

    let major = data.majors[majorIndex]
    let majorClassLink = rp.ArtClass.link({search: {file: major.recruitFile}})
    return (
      <Page name='ArtHome' scrollRestore>
        <h1>{data.university}</h1>
        <h2>{data.faculty}</h2>
        <Slider itemWidth={80} itemHeight={60} sideGap={20} itemGap={5}>
          {data.majors.map((m, mi) => (
            <p
              key={mi}
              onClick={() => {
                INDEX = mi
                this.setState({majorIndex: mi})
              }}
              className={classSet('majorName', {active: mi === majorIndex})}
            >{m.title}</p>
          ))}
        </Slider>

        {
          !major.peoples ? null : (
            <div className='box peoplesBox'>
              <h3>{major.peoplesTitle}</h3>
              <Slider itemGap={5} sideGap={20} itemHeight={120} itemWidth={96} injectViewer>
                {major.peoples.map((p, pi) => <People key={pi} {...p} />)}
              </Slider>
            </div>
          )
        }

        {
          !major.recruitPoster ? null : (
            <div className='box recuritBox'>
              <h3>{major.recuritTitle}</h3>
              <Link to={majorClassLink}>
                <Image ratio={3} width={'100%'} src={major.recruitPoster} />
              </Link>
            </div>
          )
        }

        {
          !major.timeline ? null : (
            <div className='box timelineBox'>
              <h3>{major.timelineTitle}</h3>
              <ul>
                {major.timeline.map((t, ti) => (
                  <li key={ti} onClick={t.step === 'current' ? () => this.app.gotoLink(majorClassLink) : null} className={classSet('gFlexContainer gSpaceBetweenChildren', t.step + 'Step')}>
                    <label>{t.name}</label>
                    <div className={classSet('right', {gVCenterChildren: !t.time})}>
                      {t.time ? <time>{t.time}</time> : null}
                      <p>{t.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        {
          major.peoples || major.recruitPoster || major.timeline
            ? null
            : <Image className='empty' key={Math.random()} bg width={70} height={109} ratio={3} src='//n1image.hjfile.cn/res7/2017/12/20/f639dfe651d626ac2e145048f886fc05.png' />
        }

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
class People extends React.Component<{name: string, avatar: string, desc: string, getViewer?: any}> {
  render() {
    const {name, avatar, desc, getViewer} = this.props
    return (
      <div className='people'>
        <Image src={avatar} width={68} height={68} container={getViewer} />
        <label>{name}</label>
        <p>{desc}</p>
      </div>
    )
  }
}
