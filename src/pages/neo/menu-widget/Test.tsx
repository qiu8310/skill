import {React, PageComponent, Page, page} from '../base'

@page
export class Test extends PageComponent<any, any> {
  render() {
    return (
      <Page name='Test'>
        Test
      </Page>
    )
  }
}

/*
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import {Page} from 'mora-common'
import {ScrollerContainer, ScrollerItem} from 'widget/InfiniteScroller/'

import {IAppComponentProps, observer} from 'mobx/IndexApp'

import './styles/Test.scss'

let r = () => Math.round(50 + (Math.random() * 205)).toString(16) // 确保一定是两位数

@observer
export class List extends React.PureComponent<RouteComponentProps<any> & IAppComponentProps, any> {
  container: HTMLDivElement
  state = {
    startIndex: 0,
    endIndex: 0
  }
  load(done) {
    setTimeout(() => {
      // let {scroller} = this.props.app
      // let a = []
      // let from = (scroller.page - 1) * 10
      // for (let i = from; i < from + 10; i++) a.push(this.renderItem(i))
      // scroller.addItems(a, from < 50)
      done()
    }, 500)
  }

  componentDidMount() {
    this.forceUpdate()
  }

  renderItem(i) {
    let {autoHeight} = this.props.app
    let text = i + '.' + '点我可以跳到详情页' + ' foo bar '.repeat(Math.round(5 + Math.random() * 12))
    let background = '#' + r() + r() + r()

    return (
      <ScrollerItem key={i} id={i} height={autoHeight ? null : 110}>
        <Link
          to={'/test/detail'}
          className='card'
          data-bg={background}
          style={{background}}
          children={text}
        />
      </ScrollerItem>
    )
  }

  changeAutoHeight() {
    // let {app} = this.props
    // app.autoHeight = !app.autoHeight
    // app.scroller.items = app.scroller.items.map((_, i) => this.renderItem(i)) // 重新渲染出带高度的 Item
  }

  render() {
    let {changeWidth, autoHeight, inContainer} = this.props.app
    let s = this.state
    return (
      <Page name={changeWidth ? 'Test auto' : 'Test'} title='Infinite Scroller'>
        <div className='controls'>
          <div><label>渲染条目: {s.endIndex - s.startIndex}</label></div>
          <div><label>容器显示: <input type='checkbox' checked={inContainer} onChange={() => this.props.app.inContainer = !inContainer} /></label></div>
          <div><label>改变宽度: <input type='checkbox' checked={changeWidth} onChange={() => this.props.app.changeWidth = !changeWidth} /></label></div>
          <div><label>固定高度: <input type='checkbox' checked={!autoHeight} onChange={() => this.changeAutoHeight()} /></label></div>
        </div>
        <div className={(inContainer ? ' pinContainer ' : '') + (autoHeight ? '' : ' pinHeight ')} ref={e => this.container = e}>
          {this.container ? (
            <ScrollerContainer
              itemHeightUnchangable={!autoHeight}
              container={inContainer ? this.container : undefined}
              preload={0}
              offset={0}
              containerWidthChanged={changeWidth}
              load={(done) => this.load(done)}
              loadable={false}
              onRender={(startIndex, endIndex) => {
                this.setState({startIndex, endIndex})
              }}
            >

            </ScrollerContainer>
          ) : null}
        </div>
      </Page>
    )
  }
}

export class Detail extends React.PureComponent<RouteComponentProps<any>, any> {
  render() {
    return <Page name={'TestDetail'} title='Infinite Scroller Detail'>
      <a className='back' onClick={() => this.props.history.goBack()}> &lt;- Back </a>
      <div style={{lineHeight: '50px'}}>{'detail page '.repeat(200)}</div>
    </Page>
  }
}
*/
