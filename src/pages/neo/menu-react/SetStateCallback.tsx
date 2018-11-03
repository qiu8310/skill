/**
 * Create by Mora at 2017-09-28 17:58
 * All right reserved
 */

import {React, PageComponent, Page, page, HTML, autobind} from '../base'

const LEARN = `
在 react 中，setState({...}, callback) 中的 callback 执行时间受调用的函数不同而不同，详情如下：

1. 在 react 的生命周期的函数中使用 setState 时，不会立即触发 render；而是在生命周期函数执行完后，统一触发 render，再统一调用 setState 中指定的 callback
2. 在 react dom 上绑定的事件的回调函数中调用 setState，也不会立即触发 render,而是在 dom 链上的所有回调函数都执行完后，再统一触发 render 和 callback ，这是因为 react 封装了所有的事件，它会在 body 元素绑定一个监听，通过代理的形式来处理
3. 手动绑定事件，或其它不受 react 控制的异步回调中调用 setState 时，会立即 render，render 完后调用 callback；即如果在这些函数内调用两次 setState，会触发两次 render
`

@page
export class SetStateCallback extends PageComponent<any, {count: number}> {
  state = {count: 0}
  manualButton: HTMLButtonElement
  manualDiv: HTMLDivElement

  logger = (label) => (key, ...args) => console.log(`%c${label}: %c${key}`, 'color: blue; font-weight: bold;', 'color: red', ...args)
  logSeparate = () => console.log('='.repeat(50))
  logSetStateCountTo(label: string, count: number, callback?) {
    let log = this.logger(label)
    let text = `{count: ${count}}`
    log('setStateStart', text)
    this.setState({count}, () => {
      log('setStateCallback', text)
      if (callback) callback()
    })
    log('setStateEnd', text)
  }

  componentWillMount() {
    this.logSetStateCountTo('componentWillMount', 1)
    this.logSetStateCountTo('componentWillMount', 2, this.logSeparate)
  }

  // react 绑定事件回调函数
  @autobind reactButtonClick(e: React.MouseEvent<any>) {
    this.logSetStateCountTo('reactButtonClick', 11)
    this.logSetStateCountTo('reactButtonClick', 12)
  }

  @autobind reactButtonPropagationClick(e: React.MouseEvent<any>) {
    this.logSetStateCountTo('reactButtonPropagationClick', 13, this.logSeparate)
  }

  // 手动绑定事件回调函数
  @autobind manualButtonClick(e: MouseEvent) {
    this.logSetStateCountTo('manualButtonClick', 21)
    this.logSetStateCountTo('manualButtonClick', 22)
  }

  @autobind manualButtonPropagationClick(e: MouseEvent) {
    this.logSetStateCountTo('manualButtonPropagationClick', 23)
    this.logSeparate()
  }

  componentDidMount() {
    this.manualButton.addEventListener('click', this.manualButtonClick)
    this.manualDiv.addEventListener('click', this.manualButtonPropagationClick)
  }

  // setTimeout
  @autobind setTimeoutTest() {
    setTimeout(() => {
      this.logSetStateCountTo('setTimeoutTest', 31)
      this.logSetStateCountTo('setTimeoutTest', 32)
      this.logSeparate()
    })
  }

  render() {
    console.log('%crender', 'color:purple')
    return (
      <Page name='SetStateCallback' title={this.app.rp.SetStateCallback.title} className='gGap'>
        <HTML className='learn' simple value={LEARN.trim()} />

        <p className='gTextCenter note'>打开开发者工具查看 console.log 的结果~</p>
        <p className='gTextCenter'>count: {this.state.count}</p>
        <div style={{margin: '1em 0'}} onClick={this.reactButtonPropagationClick}>
          <button className='gCenter' onClick={this.reactButtonClick}>触发通过 react 绑定的事件</button>
          <div className='note'>
            <HTML simple value={`点击后所有相关的 handle 都会调用，然后才会触发所有的 callback 被调用`} />
          </div>
        </div>

        <div style={{margin: '1em 0'}} ref={e => this.manualDiv = e}>
          <button className='gCenter' ref={e => this.manualButton = e}>触发通过 手动 绑定的事件</button>
          <div className='note'>
            <HTML simple value={`点击后相关的 handle 中的 setState 执行后立即会触发 callback 被调用`} />
          </div>
        </div>

        <div style={{margin: '1em 0'}}>
          <button className='gCenter' onClick={this.setTimeoutTest}>触发 setTimeout 的回调</button>
          <div className='note'>
            <HTML simple value={`和上一个结果类似，callback 会立即被调用`} />
          </div>
        </div>
      </Page>
    )
  }
}
