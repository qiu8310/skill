/**
 * Create by Mora at 2017-11-27 16:10
 * All right reserved
 */

//#region import
import {React, PageComponent, Markdown, Page, inject, Image, Link, dom, classSet} from 'pages/trydesignlab/base/'

import './styles/CourseUnit.scss'
//#endregion

@inject('app')
export class CourseUnit extends PageComponent<{unitId: string}, any> {
  state = {
    scroll: false
  }

  onMarkdown = () => {
    let {app, params: {unitId}} = this

    let root = document.querySelector('.gMarkdown')
    let top = dom.createElement('div', 'top')
    let wrap = dom.createElement('div', 'wrap')
    let bottom = dom.createElement('div', 'bottom', wrap)
    bottom.insertBefore(dom.createElement('div', 'spine'), wrap)

    let isTop = true
    let nodes = dom.childrenToArray(root.children)
    let lessonId = 1
    let unitProgress = app.progress[`unit${unitId}`]
    for (let node of nodes) {
      let nodeName = node.nodeName
      if (isTop) {
        top.appendChild(node)
      } else {
        if (nodeName === 'BLOCKQUOTE') {
          let icon = dom.createElement('div', 'icon lecture')
          let lessonKey = 'lesson' + lessonId
          if (!(lessonKey in unitProgress)) unitProgress[lessonKey] = 0

          let finished = unitProgress[lessonKey] === 100
          let isProject = /project/i.test(node.firstChild.textContent)

          node.className = classSet('lesson', {project: isProject, finished})
          node.setAttribute('data-lesson', lessonId + '')
          dom.appendElements(node, dom.createElement('a', 'goto', isProject ? '进入项目' : finished ? '复习讲义' : '学习讲义'), icon)
          lessonId++
        }
        wrap.appendChild(node)
      }

      if (nodeName === 'HR' && isTop) {
        isTop = false
        let div = dom.createElement('div', 'progress')
        div.innerHTML = `
          <div class='label'>单元进度</div>
          <div class="road" style="background: #EDEDED;">
            <div class="bar" style="width: ${app.getUnitProgress(unitId)}%; background: #79B748;"></div>
          </div>
        `
        top.appendChild(div)
      }
    }

    dom.appendElements(root, top, bottom)
    return true
  }

  onClickContent = (e: React.MouseEvent<any>) => {
    const {params, rp: {CourseLectures, CourseProject}} = this

    let el: Element = e.target as any
    let lesson = el.closest('.lesson')
    if (lesson && el.className === 'goto') {
      let link = lesson.querySelector('a[href]')
      if (link) {
        let file = link.getAttribute('href')
        let rp = lesson.classList.contains('project') ? CourseProject : CourseLectures
        this.app.gotoLink(rp.link({params: {lessonId: lesson.getAttribute('data-lesson'), ...params}, search: {file}}))
      }
    }
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    let {unitId} = this.params
    let unit = this.app.getUnit(unitId)
    return <Page name='CourseUnit' scrollRestore scroll={this.state.scroll} title={this.config.appName + ' | 第 ' + unitId + ' 单元'}>
      <div className='base'>
        <Link fakeBack to={this.app.rp.CourseHome.link()}><i className='icon-arrow-left' /> 课程首页</Link>
        <Image className='gCenter' src={unit.icon} square={p2r(150)} />
        <div>第 {unitId} 单元 &nbsp;&nbsp; {unit.hour} 小时</div>
      </div>

      <Markdown
        resolveLink
        url={`/p/trydesignlab/unit-${unitId}.md`}
        onClickContent={this.onClickContent}
        onMarkdown={this.onMarkdown}
        onRender={() => this.setState({scroll: true})}
      />
    </Page>
  }
}

