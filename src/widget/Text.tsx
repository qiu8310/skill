/**
 * Create by Mora at 2017-12-20 16:19
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet, Resizable} from 'mora-common'
//#endregion

export interface ITextProps {
  className?: string
  style?: React.CSSProperties
  lineClassName?: string
  children: string | number | null | undefined
}

@Resizable.apply()
export class Text extends React.PureComponent<ITextProps, any> implements Resizable {
  detectContainer: HTMLDivElement
  state = {
    detecting: true,
    lines: []
  }
  refresh = () => {
    this.setState({detecting: true}, this.detect)
  }
  private detect = () => {
    const {children: text} = this.props
    let lines: string[] = []

    if (text != null) {
      let parts = text.toString().split('')
      let line: string
      let height = 0
      for (let part of parts) {
        this.detectContainer.appendChild(document.createTextNode(part))
        let r = this.detectContainer.getBoundingClientRect()
        if (!height || r.height !== height) {
          if (height) lines.push(line)
          line = part
          height = r.height
        } else {
          line += part
        }
      }
      if (line) lines.push(line)
    }

    this.setState({lines, detecting: false})
  }

  onResize() {
    this.refresh()
  }
  componentDidUpdate(prevProps: ITextProps) {
    if (prevProps.children !== this.props.children) this.refresh()
  }

  render() {
    const {className, style, lineClassName = 'wText-line'} = this.props
    const {lines, detecting} = this.state
    let rootProps = detecting ? {} : {'data-line-count': lines.length}
    return (
      <div className={classSet('wText', className)} style={style} {...rootProps}>
        {
          detecting
            ? <div className='wText-detect' style={{height: 'auto', display: 'block', visibility: 'hidden'}} ref={e => this.detectContainer = e} />
            : lines.map((l, i) => <div key={i} className={lineClassName + ' ' + lineClassName + (i + 1)} children={l} />)
        }
      </div>
    )
  }
}
