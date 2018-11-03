import * as React from 'react'
import {ScrollerContainer, ScrollerItem, IScrollerContainerOptionalProps} from './InfiniteScroller'
import {shallowEqual, Storable, IStorableProps, IStorableFunc} from 'mora-common'

export interface IScrollerProps {
  load: (...args) => Promise<IScrollerLoadResult>
  params?: any
  render: (item: IScrollerItemData, index: number, scroller: Scroller) => JSX.Element
  containerProps?: IScrollerContainerOptionalProps
}

export interface IScrollerLoadResult {
  items: IScrollerItemData[]
  loadable: boolean
}

export interface IScrollerItemData {
  /** 一定需要一个 ID */
  id: number | string
  [key: string]: any
}

export interface IScrollerState {
  items: IScrollerItemData[]
  loadable: boolean
  page: number
}

@Storable.apply()
export class Scroller extends React.PureComponent<IScrollerProps & IStorableProps, IScrollerState> implements Storable {
  static defaultProps = {
    params: {}
  }

  storable: boolean
  store: IStorableFunc

  constructor(props: IScrollerProps, context) {
    super(props, context)
    this.state = this.store('state') || {
      items: [],
      loadable: true,
      page: 1
    }
  }

  container: ScrollerContainer
  check = () => this.container.check()
  asyncCheck = () => this.container.asyncCheck()

  /** 添加新条目到列表中 */
  addItem = (item, direction?: 'top' | 'bottom') => {
    let {items} = this.state
    if (direction === 'bottom') items = [...items, item]
    else items = [item, ...items]
    this.setState({items}, this.check)
  }

  /** 删除列表中的某个条目 */
  deleteItem = (item) => {
    let items = this.state.items.filter(i => i !== item)
    this.setState({items}, this.check)
  }

  /** 列表中的某个条目状态更新了 */
  updateItems = (updater?: (this: Scroller, items: any[]) => void) => {
    let {items} = this.state
    if (typeof updater === 'function') updater.call(this, items)
    else this.setState({items: [...items]}, this.check)
  }

  private load = async (done) => {
    let {load: fn, params} = this.props
    let {items: oldItems, page} = this.state

    let {items, loadable} = await fn({...params, page})
    this.setAndStoreState({items: [...oldItems, ...items], loadable, page: page + 1}, done)
  }

  componentDidUpdate(prevProps, prevState) {
    const {params} = this.props
    if (!shallowEqual(prevProps.params, params)) {
      this.setAndStoreState({items: [], page: 1, loadable: true}, this.asyncCheck)
    }
  }

  render() {
    let {items, loadable} = this.state
    let {render} = this.props
    return (
      <ScrollerContainer
        ref={e => this.container = e}
        onDestroy={d => this.store('data', d)}
        initData={this.store('data')}
        load={this.load}
        loadable={loadable}
        {...this.props.containerProps}
      >
        {items.map((item, index) => (
          <ScrollerItem key={item.id} id={item.id} children={render(item, index, this)} />
        ))}
      </ScrollerContainer>
    )
  }

  private setAndStoreState(state, cb?: () => void) {
    this.store('state', state)
    this.setState(state, cb)
  }
}
