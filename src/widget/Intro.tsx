/**
 * Create by Mora at 2017-10-24 10:52
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet, Finger, Transition} from 'mora-common'

import './styles/Intro.scss'
//#endregion

export interface IIntroProps {
  className?: string
  style?: React.CSSProperties

  loop?: boolean
  auto?: boolean
  duration?: boolean

  noDots?: boolean
  fullscreen?: boolean

  dotsClassName?: string
  dotClassName?: string
  dotActiveClassName?: string
  dotStyle?: React.CSSProperties
}

export class Intro extends React.PureComponent<IIntroProps, any> {
  static defaultProps = {
    dotActiveClassName: 'active',
    duration: 5000
  }
  state = {
    index: 0,
    direction: null
  }

  get children() {
    return React.Children.toArray(this.props.children) as JSX.Element[]
  }

  private sid: number
  private clear = () => clearTimeout(this.sid)
  private auto = () => {
    if (!this.props.auto) return
    this.clear()
    this.sid = setTimeout(() => {
      this.swipeTo('next', (this.state.index + 1) % this.children.length, this.auto)
    }, this.props.duration)
  }

  swipeTo(direction: string, next: number, done) {
    const {index} = this.state
    if (next === index) return
    this.clear()
    this.setState(
      // 先设置方向，触发 dom 更新，再设置 index，触发动画
      {direction},
      () => this.setState({index: next}, done)
    )
  }

  componentDidMount() {
    this.auto()
  }
  componentWillUnmount() {
    this.clear()
  }

  onSwipe = (e) => {
    const {children, props: {loop}} = this
    const {index} = this.state
    let next = index
    let max = children.length - 1

    if (e.direction === 'Left') {
      if (index < max) next = index + 1
      else if (loop) next = 0
    } else if (e.direction === 'Right') {
      if (index > 0) next = index - 1
      else if (loop) next = max
    }

    this.swipeTo(e.direction === 'Left' ? 'next' : 'prev', next, this.auto)
  }

  render() {
    let {children, state, props} = this
    let {index, direction} = state
    let {className, style, fullscreen, noDots, dotsClassName, dotClassName, dotActiveClassName, dotStyle} = props

    children = children.map(c => React.cloneElement(c, {className: classSet(c.props.className, 'wIntroItem gOverlay')}))

    return (
      <Finger onSwipe={this.onSwipe}>
        <div className={classSet('wIntro ', fullscreen && 'wIntro-fullscreen', className, direction && 'wIntro-' + direction)} style={style}>
          <Transition
            enter
            leave
            className={'wIntroTransition gOverlay'}
            name='intro'
            itemKey={index}
            items={children}
          />

          {!noDots && <div className={classSet('wIntro-dots', dotsClassName)}>
            {children.map((c, i) => (
              <i key={i} className={classSet('wIntro-dot', dotClassName, i === index && dotActiveClassName)} style={dotStyle} />
            ))}
          </div>}
        </div>
      </Finger>
    )
  }
}
