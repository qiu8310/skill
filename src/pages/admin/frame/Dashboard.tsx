import {React, IPageProps, Page} from 'admin/'

export default class Dashboard extends React.PureComponent<IPageProps, any> {
  componentWillMount() {
    this.props.app.breadcrumb = []
  }

  render() {
    return (
      <Page name='Dashboard'>
        <div style={{textAlign: 'center', lineHeight: '50px', fontSize: 20}}>欢迎光临</div>
      </Page>
    )
  }
}
