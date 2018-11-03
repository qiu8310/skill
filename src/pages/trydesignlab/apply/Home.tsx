/**
 * Create by Mora at 2017-11-30 18:37
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Markdown, dom} from 'pages/trydesignlab/base/'

import './styles/Home.scss'
//#endregion

@inject('app')
export class Home extends PageComponent<any, any> {
  onMarkdown = (source: string, root: Element) => {
    let {course, getHref, rp} = this.app

    // head
    let desc = root.querySelector('.level-0-1')

    let head = dom.createElement('div', 'head')
    head.innerHTML = `
      <label>${this.app.config.appName}</label>
      <img src='${course.icon}' />
      <h1>${course.name}</h1>
      ${desc.firstElementChild.innerHTML}
    `
    desc.parentNode.replaceChild(head, desc)

    // price
    let price = root.querySelector('.level-2-4')
    price.classList.add('price')
    price.innerHTML = price.lastElementChild.innerHTML

    price.querySelectorAll('li').forEach(li => {
      let img = li.firstChild as HTMLImageElement
      li.insertBefore(dom.createElement('label', '', img.alt), img)
    })

    // weeks
    let learn = root.querySelector('.level-2-3')
    learn.classList.add('learn')
    let weeks = dom.createElement('div', 'weeks')
    learn.querySelectorAll('.level-3').forEach((el: HTMLElement) => {
      el.classList.add('week')
      weeks.appendChild(el)
    })
    learn.appendChild(weeks)


    // for you
    let forYou = root.querySelector('.level-2-2 .level-3-1')
    forYou.classList.add('forYou')
    forYou.querySelectorAll('li').forEach((li: HTMLLIElement) => {
      let img = li.querySelector('img') as HTMLImageElement
      img.parentElement.className = 'img'
      li.insertBefore(dom.createElement('h6', '', img.alt), li.firstElementChild)
    })

    // mentors
    let mentor = root.querySelector('.level-2-2 .level-3-2')
    mentor.querySelectorAll('li img').forEach((el: HTMLImageElement) => {
      el.classList.add('mentor')
      let [alt, companyAlt, companySrc] = el.alt.split(/at|@/)
      el.alt = alt
      let company: HTMLImageElement = dom.createElement('img', 'company')
      company.alt = companyAlt
      company.src = companySrc
      el.parentElement.appendChild(company)
    })

    let foot = dom.createElement('div', 'foot')
    foot.innerHTML = `<a class="enroll" href="${getHref(rp.Apply.link())}">加入课程</a>`
    root.appendChild(foot)

    return true
  }
  render() {
    return (
      <Page name='Home' title={this.app.course.name}>
        <Markdown url='/p/trydesignlab/intro.md' wrap resolveText onMarkdown={this.onMarkdown} />
      </Page>
    )
  }
}
