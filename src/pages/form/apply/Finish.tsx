import {page, PageComponent, Page, React} from 'mobx/FormApp'

@page
export class Finish extends PageComponent {
  constructor(props, context) {
    super(props, context)
    let {app} = this.props
    if (app.data == null) app.replaceLink('/')
  }

  get data() {
    return {
      title: '申请已收到',
      thanks: '感谢参与 Origin University 的早期运行测试',
      feedback: '我们将尽快查阅您的申请，并为您定制学习内容',
      notice: '当内容准备好时，会通过邮件通知您'
    }
  }

  render() {
    let {data} = this
    return <Page name='Finish'>
      <p className='title'>{data.title}</p>
      <p className='thanks'>{data.thanks}</p>
      <p className='feedback'>{data.feedback}</p>
      <p className='notice'>{data.notice}</p>
    </Page>
  }
}
