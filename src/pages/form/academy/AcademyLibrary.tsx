/**
 * Create by Mora at 2017-12-18 11:20
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Image} from 'mora-common'
import {Markdown} from 'widget/Markdown'
const SearchBar = require('react-weui/build/packages/components/searchbar/')
import './styles/AcademyLibrary.scss'
//#endregion

interface IData {
  cover: string
  descHtml: string
  blocks: IBlock[]
}

interface IBlock {
  tipHtml: string
  label: string
  articles: IArticle[]
}

interface IArticle {
  title: string
  desc: string
}

@page
export class AcademyLibrary extends PageComponent<any, {data: IData}> {
  state: {data: IData} = {data: null}

  onMarkdown = (source: string, root: HTMLDivElement, data: IData) => {
    data.descHtml = q(root, '.level-0', true)
    data.blocks = root.querySelectorAll('.level-2').map((div: HTMLDivElement) => {
      let label = q(div, 'h2')
      let articles = div.querySelectorAll('li').map((li: HTMLLIElement) => {
        let [title = '', desc = ''] = li.textContent.trim().split(/\s*\/\/\s*/)
        return {title, desc}
      })
      root.appendChild(div.querySelector('h2'))
      root.appendChild(div.querySelector('ul'))
      return {label, articles, tipHtml: div.innerHTML}
    })

    this.setState({data})
    return false
  }
  render() {
    const {data} = this.state
    if (!data) return <Markdown url='/p/form/academy/library.md' resolveText wrap onMarkdown={this.onMarkdown} />

    return (
      <Page name='AcademyLibrary' className='page__bd'>
        <SearchBar />
        {data.cover && <Image src={data.cover} width={'100%'} />}
        {data.descHtml ? <div className='top desc' dangerouslySetInnerHTML={{__html: data.descHtml}} /> : null}

        {data.blocks.map((b, i) => (

          <div key={i}>
            <div className='weui-cells__title gFlexContainer gSpaceBetweenChildren'>
              <span className='label'>{b.label}</span>
              <span className='more'>查看更多 <i className='fas fa-angle-right' /></span>
            </div>
            <div className='weui-panel weui-panel_access'>
              <div className='weui-panel__bd'>

                {b.articles.map((a, j) => (
                  <div key={j} className='weui-media-box weui-media-box_text'>
                    {a.title ? <h4 className='weui-media-box__title'>{a.title}</h4> : null}
                    {a.desc ? <p className='weui-media-box__desc'>{a.desc}</p> : null}
                  </div>
                ))}

              </div>
            </div>

            {b.tipHtml ? <div className='block desc' dangerouslySetInnerHTML={{__html: b.tipHtml}} /> : null}

          </div>

        ))}

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
