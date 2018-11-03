/**
 * Create by Mora at 2017-11-13 12:09
 * All right reserved
 */

//#region
import * as React from 'react'
import {classSet, Image, Modal, HTML} from 'mora-common'

import './styles/CompanyItem.scss'
//#endregion

export interface ICompanyItemProps {
  className?: string
  style?: React.CSSProperties
  data: {
    name: string
    desc: string
    img: string
    html: string
  }
}

export class CompanyItem extends React.PureComponent<ICompanyItemProps, any> {
  state = {
    showModal: false
  }
  closeModal = () => this.setState({showModal: false})
  render() {
    let {className, style, data} = this.props
    return (
      <div className={classSet('wCompanyItem', className)} style={style} onClick={() => this.setState({showModal: true})}>
        <Image width={p2r(160)} height={p2r(90)} ratio={3} src={data.img} />
        <h3>{data.name}</h3>
        <p>{data.desc}</p>

        {this.state.showModal && <Modal closeOnClickMask closeModal={this.closeModal}>
          <div className='wCompanyItem-modal'>
            <a className='close' onClick={this.closeModal} />
            <HTML value={data.html} />
          </div>
        </Modal>}
      </div>
    )
  }
}
