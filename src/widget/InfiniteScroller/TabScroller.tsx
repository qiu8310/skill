import * as React from 'react'
import {classSet} from 'mora-common/util/classSet'
import {Tab} from 'mora-common/widget/Tab'
import {Scroller, IScrollerProps} from './Scroller'

import {Location, History} from 'history' // react-router 依赖于 history

export interface ITabScrollerPropTab extends IScrollerProps {
  title: string | JSX.Element
}

export interface ITabScrollerProps {
  className?: string
  style?: React.CSSProperties
  start?: number
  store?: any
  tabs: ITabScrollerPropTab[]
  onChange?: (index: number) => void

  // 通时提供这两个参数会触发记录 Tab 的 active index 在 url 上的 hash 上
  location?: Location
  history?: History
}

export class TabScroller extends React.PureComponent<ITabScrollerProps, any> {
  scroller: Scroller
  store = this.props.store || Object.create(null)

  getTabScroller = (index: number, props: IScrollerProps) => {
    return (
      <Scroller
        ref={e => this.scroller = e}
        key={index}
        store={this.store}
        storeKey={index}
        {...props}
      />
    )
  }

  getTabPanel = (tab: ITabScrollerPropTab, index: number) => {
    let {title, ...rest} = tab
    return <Tab.Panel key={index} title={title} children={this.getTabScroller(index, rest)} />
  }

  onChange = (i) => {
    let {onChange, history, location} = this.props
    this.scroller.check()

    if (onChange) onChange(i)

    if (location && history) {
      let {pathname, search} = location
      history.replace(pathname + search + '#' + i)
    }
  }

  render() {
    let {className, style, start, location} = this.props
    if (location && location.hash && start == null) {
      start = parseInt(location.hash.substr(1), 10) || 0
    }
    return (
      <Tab className={classSet('wTabScroller', className)} start={start} style={style} onChange={this.onChange}>
        {this.props.tabs.map(this.getTabPanel)}
      </Tab>
    )
  }
}
