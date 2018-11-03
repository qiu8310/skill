/**
 * Create by Mora at 2017-12-18 11:19
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Markdown} from 'widget/Markdown'
import {jsonfy} from 'common/'
import {Tab, Image} from 'mora-common'
const SearchBar = require('react-weui/build/packages/components/searchbar/')

import './styles/AcademyBBS.scss'
//#endregion

interface IData {
  cover1: string
  cover2: string
  cover3: string
  t1: IDataT1
  t2: IDataT2
  t3: IDataT3
}
interface IDataT1 {
  label: string
  questions: Array<{
    title?: string
    desc?: string
    user?: string
    icon?: string
    answer?: number
    follow?: number
    image?: string
  }>
}
interface IDataT2 {
  label: string
  descHtml: string
  groups: Array<{
    title: string
    party: number
    topic: number
    member: number
  }>
}
interface IDataT3 {
  label: string
  contacts: Array<{
    group: string
    users: string
  }>
}

interface IState {
  data: IData
}

@page
export class AcademyBBS extends PageComponent<any, IState> {
  state: IState = {data: null}

  onMarkdown = (source: string, root: HTMLDivElement, data: IData) => {
    root.querySelectorAll('.level-2').forEach((div: HTMLDivElement, i) => {
      let label = q(div, 'h2')

      if (i === 0) {
        data.t1 = {
          label,
          questions: div.querySelectorAll('li, img').map((li: HTMLLIElement | HTMLImageElement) => {
            if (li.tagName === 'LI') {
              return jsonfy(li.textContent, 'title', 'desc')
            } else {
              return {image: (li as HTMLImageElement).src}
            }
          })
        }
      } else if (i === 1) {
        data.t2 = {
          label,
          descHtml: q(div, '.desc', true),
          groups: div.querySelectorAll('li').map((li: HTMLLIElement) => jsonfy(li.textContent, 'title'))
        }
      } else {
        data.t3 = {
          label,
          contacts: div.querySelectorAll('.level-3').map((level: HTMLDivElement) => {
            return {
              group: q(level, 'h3'),
              users: level.innerHTML.replace(/<h3>.*?<\/h3>/, '')
            }
          })
        }
      }
    })

    this.setState({data})
    return true
  }

  render() {
    const {data} = this.state
    if (!data) return <Markdown url='/p/form/academy/bbs.md' resolveText wrap onMarkdown={this.onMarkdown} />
    let {t1, t2, t3} = data

    return (
      <Page name='AcademyBBS'>
        <Tab className='gTab'>
          <Tab.Panel title={t1.label}>
            <div className='gFlexContainer t1SearchBar'>
              <SearchBar className='searchBar gFlex' />
              <a className='ask'>提问</a>
            </div>
            {data.cover1 && <Image src={data.cover1} width={'100%'} />}
            {t1.questions.map((t, qi) => (
              t.image
                ? <img key={qi} className='questionImage' src={t.image} />
                : (
                  <div key={qi} className='weui-panel weui-panel_access'>
                    <div className='weui-panel__bd'>
                      <div className='weui-media-box weui-media-box_text'>
                        <div className='gFlexContainer questionUserInfo'>
                          <Image className='questionIcon' width={18} height={18} src={t.icon} />
                          <label className='questionUser gFlex'>{t.user}</label>
                        </div>
                        <h4 className='weui-media-box__title' style={{fontWeight: 'bold'}}>{t.title}</h4>
                        <div className='weui-media-box__desc'>
                          {t.desc && <p className='questionDesc'>{t.desc}</p>}
                          <p className='questionInfo'>
                            <span>{t.answer} 回答</span>
                            <span>{t.follow} 关注</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            ))}
          </Tab.Panel>
          <Tab.Panel title={t2.label}>
            <SearchBar />
            {data.cover2 && <Image src={data.cover2} width={'100%'} />}
            {t2.groups.map((g, gi) => (
              <div key={gi} className='weui-panel weui-panel_access'>
                <div className='weui-panel__bd'>
                  <div className='weui-media-box weui-media-box_text'>
                    <h4 className='weui-media-box__title'>{g.title}</h4>
                    <p className='weui-media-box__desc groupDesc'>
                      <span><em>{g.party}</em>聚会</span>
                      <span><em>{g.topic}</em>话题</span>
                      <span><em>{g.member}</em>成员</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {t2.descHtml && <div className='groupTip' dangerouslySetInnerHTML={{__html: t2.descHtml}} />}
          </Tab.Panel>
          <Tab.Panel title={t3.label}>
            <SearchBar />
            {data.cover3 && <Image src={data.cover3} width={'100%'} />}
            {t3.contacts.map((c, ci) => (
              <div key={ci}>
                <div className='weui-cells__title'>{c.group}</div>
                <div className='weui-cells users' dangerouslySetInnerHTML={{__html: c.users}}></div>
              </div>
            ))}
          </Tab.Panel>
        </Tab>
      </Page>
    )
  }
}

function q(root: HTMLElement, selector: string, html?: boolean) {
  let el = root.querySelector(selector)
  if (el) {
    return html ? el.innerHTML : el.textContent
  }
  return ''
}
