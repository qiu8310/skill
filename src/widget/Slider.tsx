import * as React from 'react'

export interface ISliderProps {
  className?: string
  style?: React.CSSProperties
  /**
   * 只能设置除 width 之外的其它样式，width 由此组件控制
   */
  trackStyle?: React.CSSProperties
  itemHeight?: number // 高度可以自适应
  itemWidth: number
  itemGap: number
  sideGap?: number
  /**
   * 是否给 Child 注入 getViewer 方法
   */
  injectViewer?: boolean
}

export interface ISliderInjectProps {
  getViewer?: () => HTMLDivElement
}

export class Slider extends React.PureComponent<ISliderProps, any> {
  /** touchStart 起始点 */
  x1 = 0
  y1 = 0

  /** track 元素移动的实时距离 */
  rx = 0
  /** track 元素移动的距离 */
  x = 0

  /** 允许拖动的最大距离 */
  max = 0
  disabled = false

  tracker: HTMLDivElement
  viewer: HTMLDivElement

  start: any = (e) => {
    let t = e.touches ? e.touches[0] : e

    this.x1 = t.pageX
    this.y1 = t.pageY

    this.max = this.tracker.clientWidth - this.tracker.parentElement.clientWidth
    this.disabled = this.max < 0 // 根本不需要渡劫
  }
  end: any = (e) => {
    if (this.disabled) return
    this.x = this.rx
    this.disabled = true // 当前滚动结束
  }
  move: any = (e) => {
    let {disabled, max, x} = this
    if (disabled) return
    let t = e.touches ? e.touches[0] : e

    let dx = t.pageX - this.x1
    let dy = t.pageY - this.y1

    let marginLeft = x + dx
    marginLeft = Math.min(0, Math.max(marginLeft, -max))

    this.tracker.style.marginLeft = marginLeft + 'px'
    this.rx = marginLeft

    if (Math.abs(dy) > Math.abs(dx)) {
      this.end(e)
      this.disabled = true
    }

    if (typeof CustomEvent !== 'undefined') this.tracker.parentElement.dispatchEvent(new CustomEvent('scroll'))

    if (!this.disabled) e.preventDefault()
  }

  render() {
    let {className, style, trackStyle = {}, injectViewer, itemWidth, itemHeight, itemGap, sideGap, children} = this.props

    let cs = React.Children.toArray(children)
    let len = cs.length

    if (!sideGap) sideGap = itemGap
    trackStyle.width = p2r(itemWidth * len + itemGap * (len - 1) + sideGap * 2)

    return (
      <div className={'wSlider ' + (className || '')} style={style}>
        <div
          ref={e => this.viewer = e}
          className='sliderView'
          style={{overflow: 'hidden'}}
          onMouseDown={this.start}
          onTouchStart={this.start}
          onMouseMove={this.move}
          onTouchMove={this.move}
          onMouseUp={this.end}
          onMouseLeave={this.end}
          onTouchEnd={this.end}
        >
          <div ref={e => this.tracker = e} draggable={false} className='sliderTrack gClearfix' style={trackStyle}>{cs.map((c, i) => (
            <div
              key={i}
              className='sliderItem'
              style={{
                float: 'left',
                width: p2r(itemWidth),
                height: p2r(itemHeight),
                marginLeft: p2r(i === 0 ? sideGap : itemGap),
                marginRight: p2r(i === len ? sideGap : 0)
              }}
            >
              {React.cloneElement(c as any, injectViewer ? {getViewer: () => this.viewer} : {})}
            </div>
          ))}</div>
        </div>
      </div>
    )
  }
}
