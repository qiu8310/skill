/**
 * Create by Mora at 2017-10-01 11:00
 * All right reserved
 */

import {React, PageComponent, Page, page} from '../base'
import {toast, IToastResult, IToastOptions} from 'mora-common'

@page
export class ToastExample extends PageComponent<any, any> {
  instance: IToastResult
  clear() {
    if (this.instance) this.instance.destroy()
  }
  open(message: string | React.ReactNode, options?: IToastOptions) {
    return () => {
      this.clear()
      this.instance = toast(message, {...options, instance: this})
    }
  }
  componentWillUnmount() {
    this.clear()
  }
  render() {
    return (
      <Page name='ToastExample' title={this.app.rp.ToastExample.title}>
        <button className='ct' onClick={this.open('这是一条普通的 Toast，2s 后自动消失')}>普通</button>
        <button className='ct' onClick={this.open('这是一条多行 Toast\n新   行\n2s 后自动消失', {simpleHTML: true})}>格式：手动分行显示</button>
        <button className='ct' onClick={this.open('<a>带有 html 的 Toast</a>', {html: true})}>格式：嵌入 html</button>
        <button className='ct' onClick={this.open(<div><a onClick={this.clear}>点我可以关闭</a></div>, {duration: 0})}>格式：支持 React Node</button>
        <button className='ct' onClick={this.open('这条 Toast 是从小变到大的', {animation: 'zoomIn'})}>动画：zoomIn</button>
      </Page>
    )
  }
}
