import {page, Page, PageComponent, React} from 'mobx/FormApp'
import {Tab} from 'mora-common'
import {Markdown} from 'widget/Markdown'

interface Data {
  title: string
  description: string
  tabs: DataTab[]
}

interface DataTab {
  name: string
  tip: string
  questions: DataTabQuestion[]
}

interface DataTabQuestion {
  name: string
  placeholder: string
  value?: string
  required: boolean
}

@page
export class Question extends PageComponent {
  state: {data: Data, values: string[][]} = {
    data: null,
    values: []
  }
  tab: Tab

  parse = (source: string, root: HTMLDivElement) => {
    let head = root.querySelector('.level-1')
    let tabs = root.querySelectorAll('.level-2')

    let h1 = head.firstElementChild
    let h1p = h1.nextElementSibling

    let data: Data = {
      title: h1.textContent,
      description: h1p.tagName === 'P' ? h1p.textContent : '',
      tabs: tabs.map((el: HTMLDivElement) => {
        let h2 = el.firstElementChild
        let h2p = h2.nextElementSibling
        return {
          name: h2.textContent,
          tip: h2p.tagName === 'P' ? h2p.textContent : '',
          questions: el.querySelectorAll('li').map((li: HTMLLIElement) => {
            let [name, placeholder] = li.textContent.split(/\s*\r?\n\s*/)
            let required = false
            name = name.replace(/\*\s*$/, () => {
              required = true
              return ''
            })
            return {
              name,
              placeholder,
              required
            }
          })
        }
      })
    }
    this.setState({data})
    return false
  }

  renderForm(i: number) {
    let {tabs} = this.state.data
    let all = this.state.values
    let current = all[i] || []

    let {tip, questions} = tabs[i]
    return <div className='questions'>
      {tip ? <div className='tabTip'>{tip}</div> : null}
      {questions.map((q, j) => (
        <div className='question' key={j}>
          <h2 className='questionTitle'>{q.name}{q.required ? <span className='required'>*</span> : ''}</h2>
          <p className='questionTip'>{q.placeholder}</p>
          <textarea className='questionInput gInput' defaultValue={current[j]} onChange={(e) => {
            q.value = current[j] = e.target.value
            all[i] = current
            e.target.classList.remove('focused')
            this.setState({values: [...all]})
          }} />
        </div>
      ))}
    </div>
  }

  next = async () => {
    let {data} = this.state
    let {tabs} = data

    let focus = (j: number) => {
      let el = document.querySelectorAll('.questionInput')[j] as any
      el.classList.add('focused')
      if (el.scrollIntoView) el.scrollIntoView()
      if (el.focus) el.focus()
    }

    let allFinished = true
    let result: string[] = [`# ${data.title}`]
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i]
      if (!allFinished) break
      result.push(`\r\n## ${tab.name}\r\n`)
      for (let j = 0; j < tab.questions.length; j++) {
        let question = tab.questions[j]
        result.push(`* ${question.name}\r\n\t回答：${question.value}`)
        if (question.required && !question.value) {
          allFinished = false
          if (this.tab.current !== i) {
            this.tab.tabTo(i, () => focus(j))
          } else {
            focus(j)
          }
          break
        }
      }
    }

    if (allFinished) {
      let {app} = this.props
      app.data = result.join('\r\n')
      app.gotoLink(app.rp.User.link({search: {id: app.location.query.id || 'data'}}))
    }
  }

  render() {
    let {app} = this.props
    let {data} = this.state
    if (!data) return <Markdown wrap onMarkdown={this.parse} url={`/p/form/apply/${app.location.query.id || 'data'}.md`} />
    return (
      <Page name='Question'>
        <h1 className='title'>{data.title}</h1>
        <p className='description'>{data.description}</p>

        <Tab className='gTab' ref={e => this.tab = e}>
          {data.tabs.map((t, i) => <Tab.Panel key={i} title={t.name} children={this.renderForm(i)} />)}
        </Tab>

        <a className='gNext' onClick={this.next}>NEXT</a>
      </Page>
    )
  }
}
