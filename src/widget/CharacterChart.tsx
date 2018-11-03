/**
 * Create by Mora at 2017-10-12 17:20
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet, xcos, xsin, Resizable} from 'mora-common'

import './styles/CharacterChart.scss'
//#endregion

export interface ICharacterChartProps {
  className?: string
  style?: React.CSSProperties
  values: number[]
}

@Resizable.apply()
export class CharacterChart extends React.PureComponent<ICharacterChartProps, any> implements Resizable {
  canvas: HTMLCanvasElement
  texts = ['A.艺术', 'S.社会', 'E.管理', 'C.常规', 'R.现实', 'I.研究']

  onResize(rect: ClientRect) {
    this.draw(this.canvas.getContext('2d'), rect.width, this.props.values)
  }

  draw(ctx: CanvasRenderingContext2D, size: number, values: number[]) {
    this.canvas.width = size
    this.canvas.height = size
    this.canvas.style.width = size + 'px'
    this.canvas.style.height = size + 'px'

    let c = size / 2  // 中点坐标
    let gap = 80      // 留一些像素用来写文字
    let radius = (size * .5 - gap) / xcos(30) // 半径

    this.drawFrames(ctx, c, radius)
    this.drawValues(ctx, c, radius, values)
    this.drawTexts(ctx, c, (size - gap - 25) * .5 / xcos(30))
  }

  private drawTexts(ctx: CanvasRenderingContext2D, c: number, radius: number) {
    ctx.fillStyle = 'black'
    let family = ' "PingFangSC-Regular", "Helvetica Neue", Helvetica, Arial, Tahoma, sans-serif'
    let texts = this.texts
    let vertexes = getPolygonVertexes(c, c, radius - 6, 6)

    // ctx.font = '16px' + family
    // vertexes.forEach((v, i) => ctx.fillText(texts[i][0], v.x - 8, v.y))
    ctx.font = '12px' + family
    vertexes.forEach((v, i) => ctx.fillText(texts[i], v.x - 20, v.y + 6))
  }

  private drawFrames(ctx: CanvasRenderingContext2D, c: number, radius: number) {
    ctx.lineWidth = .5
    ctx.strokeStyle = '#A6A6A6'
    getPolygonVertexes(c, c, radius, 6).forEach(v => {
      ctx.moveTo(c, c)
      ctx.lineTo(v.x, v.y)
    })
    ctx.stroke()
    drawPolygon(ctx, c, c, radius, 6)
    drawPolygon(ctx, c, c, radius * .5, 6)
  }

  private drawValues(ctx: CanvasRenderingContext2D, c: number, radius: number, values: number[]) {
    const vertexes = getPolygonVertexes(c, c, radius, 6, values)

    ctx.strokeStyle = '#F8E71C'
    ctx.lineWidth = 1
    ctx.fillStyle = 'rgba(248, 231, 28, .5)'
    ctx.beginPath()
    vertexes.forEach((v, i) => ctx[i === 0 ? 'moveTo' : 'lineTo'](v.x, v.y))
    ctx.closePath()
    ctx.stroke()
    ctx.fill()

    ctx.fillStyle = '#F5A623'
    vertexes.forEach(v => {
      drawCircle(ctx, v.x, v.y, 2)
      ctx.fill()
    })
  }

  render() {
    let {className, style} = this.props
    return (
      <div className={classSet('wCharacterChart', className)} style={style}>
        <canvas ref={e => this.canvas = e} />
      </div>
    )
  }
}

/**
 * 绘制一个多边形
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx         中点横坐标
 * @param {number} cy         中点纵坐标
 * @param {number} radius     中点到顶角的距离
 * @param {number} sideCount  边数
 */
function drawPolygon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, sideCount: number) {
  ctx.beginPath()

  getPolygonVertexes(cx, cy, radius, sideCount).forEach((v, i) => ctx[i === 0 ? 'moveTo' : 'lineTo'](v.x, v.y))

  ctx.closePath()
  ctx.stroke()
}

/**
 * 绘制一个圆
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx         中点横坐标
 * @param {number} cy         中点纵坐标
 * @param {number} radius     中点到顶角的距离
 */
function drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
  ctx.closePath()
}

/**
 * 获取多点形的顶点数
 *
 * @param {number} cx         中点横坐标
 * @param {number} cy         中点纵坐标
 * @param {number} radius     中点到顶角的距离
 * @param {number} sideCount  边数
 */
function getPolygonVertexes(cx: number, cy: number, radius: number, sideCount: number, rates: number[] = []): Array<{x: number, y: number}> {
  const perDegree = 360 / sideCount
  const offset = sideCount % 2 ? 0 : perDegree / 2
  let degree: number
  let x: number
  let y: number

  let result = []

  let rate
  for (let i = 0; i < sideCount; i++) {
    rate = rates[i] == null ? 1 : rates[i]
    degree = (offset + perDegree * i)
    x = cx + xcos(degree) * radius * rate
    y = cx + xsin(degree) * radius * rate
    result.push({x, y})
  }

  return result
}
