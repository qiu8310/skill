/**
 * Create by Mora at 2017-09-30 14:56
 * All right reserved
 */

import {React, PageComponent, Page, page, autobind} from '../base'
import {Modal} from 'mora-common'

@page
export class ModalExample extends PageComponent<any, any> {
  state = {
    isExample2Open: false,
    isExample3Open: false,
    isExample4Open: false,
    isExample5Open: false,
    animation: null
  }
  modalInstance: any

  open(example: number, animation?) {
    return () => this.setState({['isExample' + example + 'Open']: true, animation})
  }
  close(example: number) {
    return () => this.setState({['isExample' + example + 'Open']: false})
  }

  @autobind openExample1() {
    this.modalInstance = Modal.dialog({closeOnClickMask: true, closeOnPressESC: true, width: 300}, (
      <div className='gTextCenter'>
        <p children='点击遮罩层' />
        <p children='按 ESC 键' />
        <p children={<a onClick={() => this.modalInstance.destroy()}>点击此处</a>} />
        <p className='note' children='都可以关闭弹窗' />
      </div>
    ), this)
  }

  componentWillUnmount() {
    if (this.modalInstance) this.modalInstance.destroy()
  }

  render() {
    return (
      <Page name='ModalExample' title={this.app.rp.ModalExample.title}>
        <button className='ct' onClick={this.openExample1}>Example 1: 通过函数打开弹窗</button>

        <button className='ct' onClick={this.open(2)}>Example 2: 通过控制 state 打开弹窗</button>
        {this.state.isExample2Open && (
          <Modal closeOnClickMask maskTransparent closeModal={this.close(2)}>
            <div className='gTextCenter'>
              <br />
              <a onClick={this.close(2)}>点我关闭弹窗</a>
              <p className='note' children='点弹窗外面区域也可关闭' />
              <p className='note' children='但弹窗外面的按钮点不动' />
            </div>
          </Modal>
        )}

        <button className='ct' onClick={this.open(3)}>Example 3: 自主控制的弹窗</button>
        {Modal.render(this, 'isExample3Open', TestModal, {closeOnClickMask: true})}

        <button className='ct' onClick={this.open(4)}>Example 4: 遮罩层可点透</button>
        {this.state.isExample4Open && (
          <Modal maskClickThrough>
            <div className='gTextCenter'>
              <br />
              <a onClick={this.close(4)}>点我关闭弹窗</a>
              <p className='note' children='点击遮罩层下面的按钮试试' />
            </div>
          </Modal>
        )}

        <div className='gTextCenter' style={{marginTop: '1em'}} >
          Example 5：动画 <br />
          <a onClick={this.open(5, 'zoomIn')}>zoomIn（默认）</a> |&nbsp;
          <a onClick={this.open(5, 'fadeIn')}>fadeIn</a> |&nbsp;
          <a onClick={this.open(5, 'fadeInDown')}>fadeInDown</a> |&nbsp;
          <a onClick={this.open(5, 'fadeInUp')}>fadeInUp</a> |&nbsp;
          <a onClick={this.open(5, 'fadeInLeft')}>fadeInLeft</a> |&nbsp;
          <a onClick={this.open(5, 'fadeInRight')}>fadeInRight</a> |&nbsp;
          <a onClick={this.open(5, null)}>禁用</a>
          <div className='note' children='要自定义新动画参考 mora-common/src/style/animate' />
        </div>
        {Modal.render(this, 'isExample5Open', TestModal, {animation: this.state.animation, closeOnClickMask: true})}
      </Page>
    )
  }
}

class TestModal extends React.Component<{data: boolean, closeModal: () => void}, any> {
  render() {
    return <div style={{height: 100}} className='gHVCenterChildren'>
      <a onClick={this.props.closeModal}>点我关闭弹窗</a>
    </div>
  }
}
