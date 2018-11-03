import * as React from 'react'

export function Arrow(props: React.SVGProps<SVGSVGElement> & {direction?: 'left' | 'top' | 'bottom' | 'right'} = {}) {
  let {style = {}, direction = 'right', ...rest} = props
  let degs = {left: 180, right: 0, bottom: 90, top: 270}
  style.transform = `rotate(${degs[direction]}deg)`
  return <svg viewBox='0 0 100 100' style={style} {...rest}>
    <path d='M31.4 4c-1-1-2.2-1.5-3.6-1.5s-2.6.6-3.6 1.5c-1 1-1.5 2.2-1.5 3.6s.5 2.6 1.5 3.6L63.1 50 24.2 88.8c-1 1-1.5 2.2-1.5 3.6s.5 2.6 1.5 3.6 2.2 1.5 3.5 1.5c1.2 0 2.5-.5 3.5-1.4l46-46L31.4 4z'/>
  </svg>
}
