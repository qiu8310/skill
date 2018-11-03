/**
 * Create by Mora at 2017-10-01 23:25
 * All right reserved
 */

import {React, PageComponent, Page, page} from '../base'
import {Slider} from 'widget/Slider'

window.p2r = s => typeof s === 'number' ? s + 'px' : s

@page
export class SliderExample extends PageComponent<any, any> {
  render() {
    return (
      <Page name='SliderExample' title={this.app.rp.SliderExample.title}>
        <Slider itemWidth={100} itemGap={12} itemHeight={800}>
          <div children='1' style={{lineHeight: '800px', textAlign: 'center', background: 'red'}} />
          <div children='2' style={{lineHeight: '800px', textAlign: 'center', background: 'green'}} />
          <div children='3' style={{lineHeight: '800px', textAlign: 'center', background: 'yellow'}} />
          <div children='4' style={{lineHeight: '800px', textAlign: 'center', background: 'blue'}} />
          <div children='5' style={{lineHeight: '800px', textAlign: 'center', background: 'gray'}} />
        </Slider>
      </Page>
    )
  }
}
