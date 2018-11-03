import * as React from 'react'
import {autobind} from 'mora-common/util/autobind'
import {viewport} from 'mora-common/dom/viewport'
import {onview} from 'mora-common/dom/onview'
import {Loading} from 'mora-common/widget/Loading'

export interface IScrollerItemProps {
  id: number | string
  height?: number
  render?: () => JSX.Element
}

export declare type IScrollerItem = React.ReactElement<IScrollerItemProps>

export interface IScrollerContainerDataProps {
  scrollTop?: number
  containerWidth?: number
  itemHeightMap?: {[id: string]: number}
}

export interface IScrollerContainerOptionalProps {
  onRender?: (startIndex: number, endIndex: number) => void

  /** 距离屏幕的偏移量，用于判断子组件是否在屏幕内 */
  offset?: number

  /** 用于判断信标组件是否在屏幕内 */
  sentinelOffset?: number

  /** 指定要预先加载的末在屏幕内的子组件的个数 */
  preload?: number

  /** 节流，滚动后多少时间触发更新，默认 150 */
  throttle?: number

  /**
   * 当容器宽度并不是因为 resize 或者 orientationchange 而变化时，
   * 需要提供此 prop，或者调用 containerWidthChanged 函数，来触发更新。
   * 如果是 resize 或者 orientationchange 会自动触发更新
   */
  containerWidthChanged?: boolean

  /**
   * 每个子元素的高度是不会变的，设定此值为 true 后，最好在 ScrollerItem 中指定高度，或由程序自动计算第一个值
   */
  itemHeightUnchangable?: boolean

  container?: Element

  nodeLoading?: React.ReactNode
  nodeLoaded?: React.ReactNode
  nodeEmpty?: React.ReactNode
  style?: React.CSSProperties

 /**
  * 初始化数据，组件销毁时也会将这些数据通过 onDestroy 传递给父组件，
  * 父组件需要把这些数据存储在 store 中，下次需要恢复位置时需要使用
  */
  initData?: IScrollerContainerDataProps
  onDestroy?: (data: IScrollerContainerDataProps) => void
}

export interface IScrollerContainerProps extends IScrollerContainerOptionalProps {
  children: IScrollerItem[]
  load: (done: () => void) => void
  /** 是否可以加载更多 */
  loadable: boolean
}

export interface IScrollerContainerState {
  widthChanged: boolean
  startIndex: number
  endIndex: number
}

const HintStyle = {lineHeight: '44px', textAlign: 'center', color: '#999', fontSize: 12}
export class ScrollerContainer extends React.PureComponent<IScrollerContainerProps, IScrollerContainerState> {
  static defaultProps = {
    offset: 200,
    sentinelOffset: 100,
    preload: 2, // 前后各预留两个 item
    throttle: 150,
    container: document.documentElement,
    nodeLoading: <Loading stroke='#999' width={20} height={20} style={{display: 'block', margin: '12px auto'}} />,
    nodeLoaded: <div style={HintStyle}>没有更多了~~</div>,
    nodeEmpty: <div style={HintStyle}>没有任何条目~~</div>,
    initData: {},
  }
  state = {
    widthChanged: false,
    startIndex: 0,
    endIndex: this.props.children.length,
  }

  private data: IScrollerContainerDataProps

  /** unbind 所有监听的事件 */
  private off: any

  /** 滚动的容器 */
  private refContainer: HTMLDivElement

  /** 信标 DOM，用于判断是否应该 loading */
  private sentinel: HTMLSpanElement

  /** 是不是正在 loading，避免重复触发多次 loading */
  private isLoading: boolean

  private _scrollTop: number

  constructor(props, context) {
    super(props, context)
    let {containerWidth, scrollTop = 0, itemHeightMap = {}} = this.props.initData
    this.data = {containerWidth, scrollTop, itemHeightMap}
  }

  /**
   * 当容器宽度并不是因为 resize 或者 orientationchange 而变化时，需要手动调用此函数
   */
  @autobind containerWidthChanged() {
    // 异步，要不能 caculate 中得到的 container width 和上一次可能一样
    this.asyncCheck()
  }

  @autobind reload() {
    this.destroy()
    this.init()
    this.asyncCheck()
  }

  /**
   * 要用 js 计算 element 的宽度或高度时，最好异步调用
   * 否则有可能返回的是变化之前的尺寸
   */
  @autobind asyncCheck() {
    async(this.check)
  }

  @autobind check() {
    if (!this.refContainer) return // 异步操作时，可能组件已经 unmount 了
    let {load, container, loadable, sentinelOffset: offset} = this.props

    this.caculate() // load 完后都会执行下 check，从而计算到当前的 endIndex 和 startIndex

    // container 如果是 html 的话，html 反而根本不在 window 视口内，不如用 window 来判断 visiable
    container = container === document.documentElement ? null : container

    if (loadable && !this.isLoading && viewport.visiable(this.sentinel, {offset, container})) {
      this.isLoading = true
      load(() => {
        this.isLoading = false
        this.check()
      })
    }
  }

  get scrollerTop(): number {
    let {props: {container}} = this
    // 某些移动端滚动使用的是 body，桌面端使用的是 html
    return container.scrollTop || (container === document.documentElement && document.body.scrollTop) || 0
  }
  set scrollerTop(value: number) {
    let {props: {container}} = this
    container.scrollTop = value
    // 某些移动端滚动使用的是 body，桌面端使用的是 html
    if (container === document.documentElement) document.body.scrollTop = value
  }

  componentDidMount() {
    this.init()
    this.check()

    let {scrollTop} = this.props.initData
    if (scrollTop) {
      // 需要等 item render 之后再滚动
      this._scrollTop = scrollTop
      async(() => {
        this.scrollerTop = scrollTop
        this._scrollTop = 0
      }, 10)
    }
  }

  componentDidUpdate(prevProps: IScrollerContainerProps) {
    let {container, containerWidthChanged, itemHeightUnchangable, children} = this.props
    if (container !== prevProps.container) {
      this.reload()
    } else if (containerWidthChanged !== prevProps.containerWidthChanged) {
      this.containerWidthChanged()
    } else if (itemHeightUnchangable !== prevProps.itemHeightUnchangable) {
      let {itemHeightMap} = this.data
      if (itemHeightUnchangable) {
        children.forEach(c => {
          let {id, height} = c.props
          if (height != null) itemHeightMap[id] = height // 优先使用用户定义的高度
        })
      } else {
        itemHeightMap = {} // 清空之前的数据
      }
      this.asyncCheck()
    }
  }

  componentWillUnmount() {
    this.destroy()
    let {onDestroy} = this.props
    if (onDestroy) onDestroy(this.data)
  }

  private init() {
    let {throttle, container} = this.props
    this.off = onview((e) => {
      if (e.type === 'resize' || e.type === 'orientationchange') {
        this.containerWidthChanged() // 需要异步，要不能 caculate 中得到的 container width 和上一次可能一样
      } else {
        this.check() // 不能将异步用在 this.check 上，这样会导致屏幕在滚动时出现很大的空白！
      }
    }, {throttle, container, events: ['resize', 'scroll', 'orientationchange', 'pageshow']})
  }

  private destroy() {
    if (this.off) {
      this.off()
      this.off = null
    }
  }

  @autobind private caculate() {
    let {data, props, state: s} = this
    let {container, offset, preload, children, itemHeightUnchangable, onRender} = props
    let containerHeight = container.clientHeight // 在没数据情况下 clientHeight 可能是 0，这时如果添加一条新数据，会导致计算失误
    let scrollerWidth = this.refContainer.clientWidth
    let scrollTop = this._scrollTop || this.scrollerTop

    let widthChanged = data.containerWidth != null && data.containerWidth !== scrollerWidth

    // 保存数据到 store 中
    data.containerWidth = scrollerWidth
    data.scrollTop = scrollTop

    let startIndex
    let endIndex

    // 如果高度不会变化，即使宽度变化了，也不需要重置 itemHeightMap
    // 如果高度会变化，只要宽度变化了，就需要重新计算 itemHeightMap
    if (!itemHeightUnchangable && widthChanged) {
      data.itemHeightMap = {} // 重置
      // resize 了，从开头显示到最近的那个 item
      startIndex = 0
      endIndex = children.length
    } else {
      let allHeight = 0
      let {itemHeightMap} = data
      let noHeightStartIndex = children.findIndex(it => !itemHeightMap[it.props.id])
      children.forEach((it, i) => {
        allHeight += itemHeightMap[it.props.id] || 0
        if (allHeight >= scrollTop - offset && startIndex == null) startIndex = i
        if (allHeight >= scrollTop + containerHeight + offset && endIndex == null) endIndex = i + 1 // 应该不显示 endIndex 本身
      })

      if (startIndex == null) startIndex = 0
      if (endIndex == null || noHeightStartIndex >= 0) endIndex = children.length

      // 如果没有找到 startIndex 是 -1，这时也会转化成 0，即显示所有
      startIndex = Math.max(0, startIndex - preload)
      endIndex = Math.min(children.length, endIndex + preload)
    }

    if (startIndex !== s.startIndex || endIndex !== s.endIndex || widthChanged !== s.widthChanged) {
      if (onRender) onRender(startIndex, endIndex)
      this.setState({startIndex, endIndex, widthChanged})
    }
  }

  private getRenderInfo() {
    let {props: {children, itemHeightUnchangable}, data, state} = this
    let {startIndex, endIndex, widthChanged} = state

    // 宽度变了要触发 item 重新计算 height
    let prefix = widthChanged ? Math.random().toString() : ''

    // 给 ScrollerItem 注入属性 store
    let renderItems = (children.slice(startIndex, endIndex) as any).map(c => {
      let itemProps: any = {data, heightUnchangeable: itemHeightUnchangable}
      if (prefix) itemProps.key = prefix + c.props.id // 触发 reload
      return React.cloneElement(c, itemProps)
    })
    return {
      paddingTop: sum(children.slice(0, startIndex), data.itemHeightMap),
      paddingBottom: sum(children.slice(endIndex), data.itemHeightMap),
      children: renderItems
    }
  }

  render() {
    let {nodeLoading, nodeLoaded, nodeEmpty, style} = this.props
    let {children, paddingTop, paddingBottom} = this.getRenderInfo()
    // console.log('container render', this.store.widthChanged)
    return (
      <div className='wInfiniteScroller' style={style}>
        <div className='scrollerContainer' ref={e => this.refContainer = e} style={{paddingTop, paddingBottom}}>
          {children}
        </div>
        <div style={{background: 'transparent', width: '100%', height: 1}} ref={e => this.sentinel = e} />
        {this.props.loadable ? nodeLoading : children.length ? nodeLoaded : nodeEmpty}
      </div>
    )
  }
}

function sum(items, heightMap) {
  return items.reduce((s, it) => {
    s += heightMap[it.props.id] || 0
    return s
  }, 0)
}

function async(fn, ms = 0) {
  return setTimeout(fn, ms)
}

// store, heightUnchangeable 是由 ScrollerContainer 传递过来的
export class ScrollerItem extends React.PureComponent<IScrollerItemProps & {data?: IScrollerContainerDataProps, heightUnchangeable?: boolean}, any> {
  root: HTMLDivElement

  @autobind update() {
    let {root, props} = this

    let {data, heightUnchangeable, height, id} = props
    if (heightUnchangeable && height != null) data.itemHeightMap[id] = height
    else if (root) data.itemHeightMap[id] = root.clientHeight
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.heightUnchangeable) {
      this.update()
    }
  }

  render() {
    let {render, children} = this.props
    return <div className='scrollerItem' style={{overflow: 'hidden'}} ref={e => this.root = e}>
      {render ? render() : children}
    </div>
  }
}

