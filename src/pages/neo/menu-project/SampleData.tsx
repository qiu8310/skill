/**
 * Create by Mora at 2017-12-04 10:16
 * All right reserved
 */

/* tslint:disable prefer-for-of */
import {React, PageComponent, Page, page} from '../base'
import {Input, InputNumber, Checkbox, Row, Button} from 'antd'
import {between} from 'mora-common'

import './styles/SampleData.scss'

@page
export class SampleData extends PageComponent<any, any> {
  state = {
    input: '',
    values: [],
    increase: false,
    decrease: false,
    sameMean: false,
    range: [0, 0],
    ranges: [[0, 0]],
    sampleCount: 5,
    sampleMin: null,
    sampleMax: null,
    precision: 3,
    samples: [],
    means: [],
    sds: [],
    ses: []
  }

  onInputChange = (e) => {
    const {precision} = this.state
    let input = e.target.value
    let trimedInput = input.replace(/[^\d\.]+/g, ' ').trim()
    let values = trimedInput ? trimedInput.split(/\s+/).map(v => parseFloat(v)) : []
    let wave = round(getSE(values, precision) * values.length, precision)
    this.setState({
      input,
      values,
      increase: isNumbersCrease(values, 'up'),
      decrease: isNumbersCrease(values, 'down'),
      range: [wave, wave],
      ranges: values.map(v => [wave, wave])
    }, this.make)
  }
  onSameMeanChange = (e) => {
    this.setState({sameMean: e.target.checked}, this.make)
  }
  onCreaseChange = (type, e) => {
    this.setState({[type]: e.target.checked}, this.make)
  }
  onGlobalRangeChange = (index, value) => {
    let {range, ranges} = this.state
    range[index] = value
    ranges.forEach(r => r[index] = value)
    this.setState({range: [...range], ranges: [...ranges]}, this.make)
  }
  onLocalRangeChange = (i, j, value) => {
    let {ranges} = this.state
    ranges[i][j] = value
    this.setState({ranges: [...ranges]}, this.make)
  }

  componentWillMount() {
    if (__DEV__) {
      this.onInputChange({target: {value: '0.12 0.2 0.19'}})
    }
    let el: HTMLDivElement = document.querySelector('#root')
    el.style.cssText = 'width: 80%'
  }

  componentWillUnmount() {
    let el: HTMLDivElement = document.querySelector('#root')
    el.style.cssText = ''
  }

  make = () => {
    let {sampleCount, values, precision, sameMean} = this.state
    let samples: number[][] = []
    let means: number[] = []
    let sds: number[] = []
    let ses: number[] = []
    for (let i = 0; i < sampleCount; i++) {
      if (i === sampleCount - 1 && sameMean) {
        samples[i] = values.map((v, j) => round(v * sampleCount - samples.reduce((asum, s) => asum + s[j], 0), 3))
      } else {
        samples[i] = this.makeSample()
      }
    }

    for (let j = 0; j < values.length; j++) {
      let numbers = [values[j]]
      for (let i = 0; i < sampleCount; i++) {
        numbers.push(samples[i][j])
      }
      means[j] = getMean(numbers, precision)
      sds[j] = getSD(numbers, precision)
      ses[j] = getSE(numbers, precision)
    }
    this.setState({samples, means, sds, ses})
  }

  makeSample() {
    let {values, ranges, increase, decrease, sampleMin, sampleMax, precision} = this.state
    let sample: number[] = []

    if (sampleMin == null) sampleMin = - Infinity
    if (sampleMax == null) sampleMax = Infinity

    for (let i = 0; i < values.length; i++) {
      let max = values[i] + ranges[i][0]
      let min = values[i] - ranges[i][1]

      if (increase && i > 0) {
        min = Math.max(sample[i - 1], min)
      } else if (decrease && i > 0) {
        max = Math.min(sample[i - 1], max)
      }

      sample[i] = between(round(max > min ? random(min, max) : values[i], precision), sampleMin, sampleMax)
    }
    return sample
  }

  render() {
    const {values, input, sameMean, increase, decrease, range, ranges, sampleCount, samples, means, sds, ses, sampleMax, sampleMin, precision} = this.state
    return (
      <Page name='SampleData' title={this.app.rp.SampleData.title}>
        <Input placeholder='输入你的样本数据，如：0.45 0.33 0.56' onChange={this.onInputChange} value={input} />

        {
          !values.length ? null : (
            <div>

              <Row style={{fontSize: 12, color: '#666', marginTop: 10}}>
                <Checkbox onChange={this.onCreaseChange.bind(this, 'increase')} disabled={decrease} checked={increase && !decrease}>新生成数据递增</Checkbox>
                <Checkbox onChange={this.onCreaseChange.bind(this, 'decrease')} disabled={increase} checked={decrease && !increase}>新生成数据递减</Checkbox>
                <Checkbox onChange={this.onSameMeanChange.bind(this)} checked={sameMean}>平均值一致</Checkbox>
                生成数据条数：<InputNumber style={{width: 60}} size='small' min={1} value={sampleCount} onChange={(value: number) => this.setState({sampleCount: Math.round(value)}, this.make)} />
                &nbsp;&nbsp;精度： <InputNumber style={{width: 60}} size='small' value={precision} onChange={(value: number) => this.setState({precision: Math.round(value)}, this.make)} />
                &nbsp;&nbsp;最小值：<InputNumber style={{width: 60}} size='small' value={sampleMin} onChange={(value: number) => this.setState({sampleMin: Math.round(value)}, this.make)} />
                &nbsp;&nbsp;最大值：<InputNumber style={{width: 60}} size='small' value={sampleMax} onChange={(value: number) => this.setState({sampleMax: Math.round(value)}, this.make)} />
              </Row>

              <table key={input}>
                <tbody>
                  <tr>
                    <th>样本数据</th>
                    {values.map((v, i) => <td key={i}>{v}</td>)}
                    {/* <td className='mean'>{getMean(values, 3)}</td> */}
                  </tr>
                  <tr>
                    <td>
                      <Row style={{marginBottom: 5}}>上限 <InputNumber min={0} style={{width: 70}} onChange={this.onGlobalRangeChange.bind(this, 0)} value={range[0]} /></Row>
                      <Row style={{marginBottom: 0}}>下限 <InputNumber min={0} style={{width: 70}} onChange={this.onGlobalRangeChange.bind(this, 1)} value={range[1]} /></Row>
                    </td>
                    {ranges.map((r, i) => <td key={i}>
                      <Row style={{marginBottom: 5}}><InputNumber min={0} style={{width: 70}} onChange={this.onLocalRangeChange.bind(this, i, 0)} value={r[0]} /></Row>
                      <Row style={{marginBottom: 0}}><InputNumber min={0} style={{width: 70}} onChange={this.onLocalRangeChange.bind(this, i, 1)} value={r[1]} /></Row>
                    </td>)}
                  </tr>

                  {samples.map((sample, i) => <tr key={i}>
                    <th>生成数据</th>
                    {sample.map((value, j) => <td key={j}>{sample[j]}</td>)}
                    {/* <td className='mean'>{getMean(sample, 3)}</td> */}
                  </tr>)}

                  <tr style={{color: '#1B8DE6'}}>
                    <th>平均值</th>
                    {means.map((v, j) => <td key={j}>{v}</td>)}
                  </tr>

                  <tr style={{color: '#1B8DE6'}}>
                    <th>标准差</th>
                    {sds.map((v, j) => <td key={j}>{v}</td>)}
                  </tr>

                  <tr style={{color: '#1B8DE6'}}>
                    <th>Error Bar</th>
                    {ses.map((v, j) => <td key={j}>{v}</td>)}
                  </tr>
                </tbody>
              </table>

              <Button type='primary' size='large' onClick={this.make} style={{display: 'block', width: 100, margin: '20px auto'}}>重新生成</Button>

            </div>
          )
        }
      </Page>
    )
  }
}

function isNumbersCrease(numbers: number[], type: 'up' | 'down') {
  if (numbers.length < 2) return true
  for (let i = 1; i < numbers.length; i++) {
    if (type === 'down' && numbers[i] > numbers[i - 1]) return false
    if (type === 'up' && numbers[i] < numbers[i - 1]) return false
  }
  return true
}


// 平均数
function getMean(numbers: number[], precision: number) {
  return round(sum(numbers) / numbers.length, precision)
}

// 标准差
function getSD(numbers: number[], precision: number) {
  let m = getMean(numbers, precision)
  let total = sum(numbers.map(n => (n - m) * (n - m)))
  return round(Math.sqrt(total / numbers.length), precision)
}

// error bar / standard error
function getSE(numbers: number[], precision: number) {
  return round(getSD(numbers, precision) / Math.sqrt(numbers.length), precision)
}

function sum(numbers: number[]) {
  return numbers.reduce((all, n) => all + n, 0)
}

function round(number: number, precision: number): number {
  return Number(number.toFixed(precision))
}

function random(min: number, max: number): number {
  return min + (max - min) * Math.random()
}
