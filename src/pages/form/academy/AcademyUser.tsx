/**
 * Create by Mora at 2017-12-18 11:20
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Markdown} from 'widget/Markdown'
import {Image, classSet} from 'mora-common'
import {Link} from 'common'

import './styles/AcademyUser.scss'
//#endregion

interface IState {
  data: {
    cover: string
    avatar: string
    city: string
    age: string
    job: string
    username: string
    blocks: IBlock[]
  }
}

interface IBlock {
  key: string
  title: string
  render: string
  wrap?: string
  size?: {
    width: number
    height: number
  },

  html?: string
  items?: Array<{
    name?: string
    image?: string
  }>
}

export class RawAcademyUser extends PageComponent<any, IState> {
  state: IState = {data: null}

  onMarkdown = (source: string, root: HTMLDivElement, data: any) => {
    data.blocks = root.querySelectorAll('.level-2').map((div: HTMLDivElement) => {
      let block: IBlock = div.className.trim().split(/\s+/).reduce((b, name) => {
        if (name.startsWith('level')) return b
        if (name.startsWith('size-')) {
          let [width, height] = name.substr(5).split('x').map(n => parseInt(n, 10))
          b.size = {width, height}
        } else if (name.startsWith('wrap-')) {
          b.wrap = name.substr(5)
        } else if (name.startsWith('render-')) {
          b.render = name.substr(7)
        } else {
          b.key = name
        }
        return b
      }, {} as IBlock)
      block.title = div.querySelector('h2').textContent.trim()

      let lis: NodeListOf<HTMLLIElement> = div.querySelectorAll('li')
      if (lis.length) {
        block.items = lis.map((li) => {
          let child = li.firstChild
          let item: any = {}
          if (child.nodeType === Node.TEXT_NODE) {
            let text = child.textContent.trim()
            if (/^https?\:\/\//.test(text)) {
              item.image = text
            } else {
              item.name = text
            }
          } else if (child.nodeName === 'A') {
            item.name = child.textContent.trim()
            item.image = (child as HTMLLinkElement).href
          } else {
            item.name = '<UNKNOW>'
            console.warn(`无法解析：`)
          }
          return item
        })
      } else {
        block.html = div.innerHTML.replace(/<h2>.*?<\/h2>/, '')
      }
      return block
    })
    this.setState({data})
    return false
  }

  renderBlock = (b: IBlock) => {
    let size = b.size || {}
    let children: any = b.items.map((it, key) => <li key={key}>
      {it.image && <Image className='image' bg src={it.image} {...size} style={{backgroundSize: 'cover', margin: '0 auto', backgroundRepeat: 'no-repeat'}} />}
      {it.name && <p className='name'><span>{it.name}</span></p>}
    </li>)

    return <ul className={classSet('render', 'render-' + b.render)}>{children}</ul>
  }

  renderPage() {
    const {data} = this.state
    return (
      <Page name='AcademyUser'>
        <div className='basic'>
          <Link className='back' to={this.rp.AcademyMy.link()}><i className='fas fa-angle-left' /> 我的</Link>
          <Image src={data.cover} bg className='cover'>
            <Image src={data.avatar} bg className='avatar' />
          </Image>

          <p className='username title'>{data.username}</p>
          <p className='age'>{data.age} · {data.city}</p>
          <p className='job'>「 {data.job} 」</p>
        </div>

        {data.blocks.map((b, bi) => (
          <div className={classSet('block', 'block-' + b.key)} key={bi}>
              <p className={classSet('title', 'wrap-' + b.wrap)}><span>{b.title}</span></p>
              <div className={classSet('content', 'content-' + b.key)}>
                {
                  b.html
                    ? <div className='html' dangerouslySetInnerHTML={{__html: b.html}} />
                    : this.renderBlock(b)
                }
              </div>
          </div>
        ))}
      </Page>
    )
  }

  render() {
    const {data} = this.state
    if (!data) return <Markdown url='/p/form/academy/user.md' resolveText wrap onMarkdown={this.onMarkdown} />
    return this.renderPage()
  }
}

@page
export class AcademyUser extends RawAcademyUser {

}
