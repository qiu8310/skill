import * as React from 'react'
import * as MD from 'react-markdown'

import {Loading} from 'mora-common'

import './styles/Markdown.scss'

export function RawMarkdown(props: MD.ReactMarkdownProps) {
  let {className, ...rest} = props
  return <MD className={'gMarkdown' + (className ? ' ' + className : '')} {...rest} />
}

export interface IMarkdownProps {
  url: string
  /**
   * 解析 markdown 中的相对链接，替换成绝对路径
   */
  resolveLink?: boolean
  /**
   * 将 h1 - h6 标签对应的 level 合并起来
   */
  wrap?: boolean

  /**
   * 解析每个 node 的 textContent 中的 [: xxx :] 或 [: ^yyy :] 字符串，将它去掉，并将里面的字符串放入当前 node 的 className 中
   */
  resolveText?: boolean

  onMarkdown?: (source: string, root: HTMLDivElement, preparsedData?: any) => JSX.Element | boolean
  onRender?: () => void
  onClickContent?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export class Markdown extends React.Component<IMarkdownProps, any> {
  state = {
    error: null,
    source: null,
    marked: null
  }

  preparsedData: any = {}

  div: HTMLDivElement

  onMarkdown(source: string) {
    const {onMarkdown, wrap, resolveText} = this.props
    let marked: any = true
    let md = this.div.querySelector('.gMarkdown') as HTMLDivElement

    if (wrap) {
      this.wrap(md)
      this.generateForm(md)
    }

    if (resolveText) this.resolveText(md)

    if (onMarkdown) {
      marked = onMarkdown(source, md, this.preparsedData)
    }
    this.setState({marked}, this.props.onRender)
  }

  async componentWillMount() {
    const {url, resolveLink} = this.props
    let res = await fetch(url)
    if (res.status !== 200) {
      return this.setState({error: res.statusText})
    }
    let source = await this.preparse((await res.text()) || '')
    if (resolveLink) {
      source = this.resolveLink(source, url)
    }
    this.setState({source}, () => this.onMarkdown(source))
  }

  async preparse(source: string) {
    let tasks = []
    let cmdRegExp = /\{\{(.*?)\}\}/g
    let tplVariableRegExp = /\{\$.*?\}/g

    // 开头的 -----------------  区域内的内容解析出来放在 data 内，如
    /*
      ----------------- 基本信息 -----------------

      头图封面<cover>：  https://o07chkb2e.qnssl.com/Fk7IhLAURs5M6VWuF2Xfnz9UFm9v?imageView2/0/w/750/format/jpg/interlace/1
      用户头像<avatar>:  https://o07chkb2e.qnssl.com/Fv9s6Syw1-XRUSU-6VO6UbzxlxM1?imageView2/2/w/148/h/148/format/jpg/interlace/1
      用户姓名<username>: 邱忠磊 - Mora
      年代<age>: 八五后
      城市<city>: 上海

      --------------------------------------------
    */
    let dataRowRegExp = /^.*?<(\w+)>\s*:\s*(.*?)$/
    source = source.replace(/^-----------------.*?\r?\n([\s\S]*?)-------------+/, (raw, text) => {
      let rows = text.trim().split(/\r?\n/).filter(l => !!l)

      this.preparsedData = rows.reduce((data, row) => {
        if (dataRowRegExp.test(row)) {
          data[RegExp.$1.trim()] = RegExp.$2.trim()
        } else {
          console.warn(`无法解析：${JSON.stringify(row)}`)
        }
        return data
      }, {} as any)
      return ''
    })


    // 解析命令： {{ include|../tpl/arrangement.md|XX技能|六周|每周三小时|五学分 }}
    source.replace(cmdRegExp, (raw, text) => {
      let [action, ...params] = text.trim().split('|')
      tasks.push({action, params})
      return raw
    })

    if (!tasks.length) return source

    tasks = tasks.map(async (t) => {
      if (t.action === 'include') {
        let url = resolve(this.props.url, t.params.shift())
        let res = await fetch(url)
        let tpl = await res.text()
        return tpl.replace(tplVariableRegExp, () => t.params.shift())
      }
    })

    let tpls = await Promise.all(tasks)
    return source.replace(cmdRegExp, () => tpls.shift())
  }

  render() {
    const {source, marked, error} = this.state
    const {onClickContent, url} = this.props

    const onClick = marked ? onClickContent : null

    if (error) return <div style={{textAlign: 'center', padding: 20, color: '#F81C21', fontSize: '2em'}}>{url + ': ' + error}</div>
    if (source == null) return <Loading />
    if (marked === false) return null

    return (
      (!marked || marked === true)
        ? <div onClick={onClick} ref={e => this.div = e} style={{visibility: marked ? 'visible' : 'hidden'}} children={<RawMarkdown source={source} />} />
        : <div onClick={onClick} children={marked} />
    )
  }

  /*
    解析像下面这种表单

      ### [: form hidden :]

      * [: control input email :] 请输入你的邮箱地址
      * [: control input username :] 请输入你的真实姓名
      * [: control button submit :] 提交
  */
  private generateForm(root: Element) {
    // 根据 text 生成表单
    root.querySelectorAll('.form').forEach((form: HTMLElement) => {
      form = form.parentElement
      form.classList.add('form-container')

      form.querySelectorAll('.control').forEach((ctrl: HTMLElement) => {
        let text = ctrl.textContent || ''
        let cn = ctrl.className

        if (ctrl.classList.contains('button')) {
          ctrl.innerHTML = `<a>${text || '提交'}</a>`
        } else if (ctrl.classList.contains('input')) {

          ctrl.innerHTML = `<div class='group'>
            <p class='text'>${text}</p>
            <input name='${cn.replace(/control|input/g, '').trim()}' />
          </div>`
        }
      })
    })
  }

  private resolveText(root: Node) {
    let re = /^\s*[\[<]:\s*(.*?)\s*:[\]>]/
    root.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        let textContent = node.textContent
        if (re.test(textContent)) {
          let cls = RegExp.$1
          if (cls[0] === '^') {
            addClass(node.parentElement.parentElement, cls.substr(1))
          } else {
            addClass(node.parentElement, cls)
          }
          textContent = textContent.replace(re, '')
          if (textContent) node.textContent = textContent
          else node.parentElement.parentElement.removeChild(node.parentElement)
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        this.resolveText(node)
      }
    })
  }

  private resolveLink(source: string, url: string): string {
    let handle = (raw: string, text: string, link: string) => `[${text}](${resolve(url, link)})`

    // 链接里可以插入图片，如： [![alt](http://xxx.png)](...)
    source = source.replace(/\[(!\[.*?\]\(.*?\))\]\(([^)]*)\)/g, handle)

    // 将类似于 [Validated Learning](./unit-1/2.validated-learning.md) 中的相对路径替换成绝对路径
    return source.replace(/\[([^\]]*)\]\(([^)]*)\)/g, handle)
  }

  private wrap(root: HTMLElement) {
    let child = root.firstElementChild
    let reHead = /^H(\d)$/

    let container = create('div', 'wrap')

    let result: IWrapItem[] = []

    let createWrap = (l: number, el?: Element) => {
      return create('div', `level level-${l}`, el)
    }
    let push: (wrap: HTMLDivElement, level: number) => IWrapItem = (wrap: HTMLDivElement, level: number) => {
      let res: IWrapItem
      if (level === 0 || level === 1) {
        res = {level, wrap, children: []}
        result.push(res)
        wrap.classList.add(`level-${level}-${result.length}`)
        container.appendChild(wrap)
        return res
      } else {
        let last = getLast(result)

        if (!last || last.level === 0) {
          for (let i = 1; i < level; i++) {
            last = push(createWrap(i), i)
          }
        } else {
          while (last.level < level - 1) {
            let obj = getLast(last.children)
            if (!obj) obj = push(createWrap(last.level + 1), last.level + 1)
            last = obj
          }
        }

        res = {level, wrap, children: []}
        last.children.push(res)
        res.wrap.classList.add(`level-${level}-${last.children.length}`)
        last.wrap.appendChild(wrap)
        return res
      }
    }

    let lastWrap: HTMLDivElement
    let lastLevel: number
    while (child) {
      if (reHead.test(child.nodeName)) {
        if (lastWrap) push(lastWrap, lastLevel)
        lastLevel = parseInt(RegExp.$1, 10)
        lastWrap = createWrap(lastLevel, child)
      } else {
        if (!lastWrap) {
          lastLevel = 0
          lastWrap = createWrap(0)
        }
        lastWrap.appendChild(child)
      }
      child = root.firstElementChild
    }

    if (lastWrap) push(lastWrap, lastLevel)
    root.appendChild(container)
  }
}

function create<K extends keyof HTMLElementTagNameMap>(tagName: K, className?: string, child?: Element): HTMLElementTagNameMap[K] {
  let element = document.createElement(tagName)
  if (className) element.className = className
  if (child) element.appendChild(child)
  return element
}

export interface IWrapItem {
  wrap: HTMLDivElement
  level: number
  children: IWrapItem[]
}

function resolve(currentUrl: string, relativeUrl: string) {
  if (relativeUrl.indexOf('//') >= 0 || relativeUrl[0] === '/') return relativeUrl // 如果是 http://xxx 或 /path/to 形式的路径，直接忽略
  let parts = currentUrl.split('/')
  parts.pop() // 去掉当前文件名
  parts.push(...relativeUrl.split('/'))
  let result = []
  parts.forEach(p => {
    if (p === '..') result.pop()
    else if (p !== '.') result.push(p)
  })
  return result.join('/')
}

function getLast<T>(array: T[]): T | null {
  return array.length ? array[array.length - 1] : null
}

function addClass(node: HTMLElement, cls: string) {
  node.className = node.className + ' ' + cls
}
