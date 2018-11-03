import {page, Page, PageComponent, React} from 'mobx/FormApp'

@page
export class User extends PageComponent {
  state = {
    username: '',
    email: ''
  }
  username: HTMLInputElement
  email: HTMLInputElement

  constructor(props: any) {
    super(props)
    let {app} = this.props
    if (!app.data) app.replaceLink('/')
  }

  next = async () => {
    let {username, email} = this.state
    let {app} = this.props
    if (username && email) {
      let md = app.data + `\r\n\r\n> 姓名： ${username}\r\n> 邮箱： ${email}`
      let headers: any = {'Content-Type': 'application/json'}
      await fetch('/origin-university', {
        method: 'POST',
        body: JSON.stringify({md, id: app.location.query.id}),
        credentials: 'same-origin',
        headers
      })
      app.gotoLink(app.rp.Finish.link())
    } else {
      if (!username) this.username.classList.add('focused')
      if (!email) this.email.classList.add('focused')
    }
  }

  update = (key: string, e) => {
    e.target.classList.remove('focused')
    this.setState({[key]: e.target.value})
  }
  render() {
    return <Page name='User'>

      <div className='group'>
        <label className='label'>你的姓名</label>
        <input ref={e => this.username = e} onChange={this.update.bind(this, 'username')} value={this.state.username} className='gInput input' />
      </div>

      <div className='group'>
        <label className='label'>你的邮箱</label>
        <input ref={e => this.email = e} onChange={this.update.bind(this, 'email')} type='email' value={this.state.email} className='gInput input' />
      </div>

      <a className='gNext' onClick={this.next}>NEXT</a>
    </Page>
  }
}
