import * as React from 'react'
import {Link} from 'react-router-dom'
import {autobind, disableTouchMove, debounce} from 'mora-common'
import {IAppComponentProps, inject} from 'mobx/IndexApp'

import './styles/SearchModal.scss'

export interface ISearchModalProps {
  className?: string
  style?: React.CSSProperties
  onClose?: () => void
  noLink?: boolean
}

@inject('app')
@disableTouchMove()
export class SearchModal extends React.PureComponent<ISearchModalProps & IAppComponentProps, any> {
  state = {
    fetching: false,
    keyword: '',
    careers: []
  }

  input: HTMLInputElement

  @autobind onCancel() {
    if (this.state.keyword) {
      this.setState({keyword: '', careers: [], fetching: false})
    } else if (this.props.onClose) {
      this.props.onClose()
    }
  }

  fetch = debounce(async (keyword) => {
    if (!keyword) return this.setState({fetching: false})

    let {items} = await this.props.app.api.searchCareers({keyword})
    this.setState({careers: items, fetching: false})
  }, 500)

  @autobind onTyping(e) {
    let keyword = e.target.value
    this.setState({fetching: true, keyword, careers: []}, () => this.fetch(keyword))
  }

  renderResult() {
    let {careers, keyword, fetching} = this.state
    if (fetching || !keyword) return null

    const {noLink, app} = this.props

    if (careers.length) {
      return (
        <ul className='careers'>
          {careers.map(c => (
            <li key={c.id} className='career'>
              {noLink ? <a>{c.nameZh}</a> : <Link to={app.rp.Career.link({careerId: c.id})} children={c.nameZh} />}
            </li>
          ))}
        </ul>
      )
    }

    if (!fetching && keyword) {
      return (
        <div className='nocareers'>
          <i className='i' />
          <p className='gTextCenter'>末找到相关职业</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className='wSearchModal gOverlay'>
        <form className='form'>
          <input type='search' value={this.state.keyword} onChange={this.onTyping} ref={e => this.input = e} className='input' placeholder='' />
          <a className='clear gRounded' onClick={this.onCancel} />
        </form>
        {this.renderResult()}
      </div>
    )
  }
}
