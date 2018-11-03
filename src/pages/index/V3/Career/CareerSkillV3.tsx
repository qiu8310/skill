/**
 * Create by Mora at 2017-11-09 18:00
 * All right reserved
 */

//#region import
import {MarkdownPageComponent, inject} from 'pages/index/base/'

import './styles/CareerSkillV3.scss'
//#endregion

@inject('app')
export class CareerSkillV3 extends MarkdownPageComponent<{careerId: string}> {
  url = `/p/v3/${this.params.careerId}/skill.md`
  pageName = 'CareerSkillV3'
  pageTitle = this.rp.CareerSkillV3.title

  onClick(e: React.MouseEvent<any>) {
    let el = e.target as Element
    let li = el.closest('li')
    if (!li) return
    let link = li.querySelector('a')
    if (!link) return
    let {href} = link
    if (href) {
      if (href.indexOf('//') >= 0) {
        let parts = href.split('//').pop().split('/')
        parts.shift()
        href = parts.join('/')
      }
      this.app.gotoLink(this.rp.Markdown.link({search: {file: href}}))
    }
  }

  onMarkdown() {
    let {careerId} = this.params
    document.querySelectorAll('.gMarkdown li').forEach((li: Element, i) => {
      if (careerId === '1') {
        li.classList.add('ui')
        li.classList.add('ui' + (i + 1))
      }

      let link = li.querySelector('a')
      if (!link || !link.href) li.classList.add('noLink')
    })
  }
}
