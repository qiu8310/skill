/**
 * Create by Mora at 2017-11-29 15:04
 * All right reserved
 */

//#region import
import {React} from 'pages/trydesignlab/base/'
import {ProgressBar} from 'widget/ProgressBar'
import {Fixed, classSet} from 'mora-common'
import {Arrow} from 'svg/arrow'

import './styles/Player.scss'
//#endregion

export interface IPlayerProps {
  htmls: string[]
  back: () => void
  onNext?: (current: number, total: number) => void
}
export interface IPlayerState {
  index: number
}

export class Player extends React.Component<IPlayerProps, IPlayerState> {
  static defaultProps = {
    onNext: () => {}
  }
  state = {
    index: 0
  }

  prev = () => this.setState({index: this.state.index - 1})
  next = () => {
    const {index} = this.state
    const {onNext, htmls} = this.props
    this.setState({index: index + 1}, () => onNext(index + 1, htmls.length))
  }

  onSwipe = (e: any) => {
    const {htmls} = this.props
    const {index} = this.state

    if (e.direction === 'Right' && index > 0) {
      this.prev()
    } else if (e.direction === 'Left' && index < htmls.length - 1) {
      this.next()
    }
  }

  back = () => this.props.back()

  render() {
    const {htmls} = this.props
    const {index} = this.state
    const len = htmls.length
    return (
      <div className='wPlayer'>
        <Fixed direction='top' height={p2r(40)}>
          <p className='nav'>
            <a className='back' onClick={this.back}><Arrow direction='left' /> 返回</a>
            <span className='name'>讲义</span>
          </p>
        </Fixed>
        <div>
          <div className='card gMarkdown' dangerouslySetInnerHTML={{__html: htmls[index]}} />
          {index === len - 1 ? <a className='toUnit' onClick={this.back}>返回单元</a> : null}
        </div>

        <Fixed direction='bottom' height={p2r(70)}>
          <div className='bottom'>
            <div className='controls gFlexContainer gSpaceBetweenChildren'>
              <a onClick={this.prev} className={classSet('ctrl prev', {disabled: index === 0})}><Arrow direction='left' /></a>
              <a onClick={this.next} className={classSet('ctrl next', {disabled: index === len - 1})}><Arrow direction='right' /></a>
            </div>
            <div className='progress'>
              <ProgressBar fgColor='#78B842' bgColor='#D8D8D8' thickness={p2r(14)} progress={(index + 1) * 100 / len} />
              <span className='number'>{index + 1} / {len}</span>
            </div>
          </div>
        </Fixed>
      </div>
    )
  }
}
