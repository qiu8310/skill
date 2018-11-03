/**
 * Create by Mora at 2017-11-14 14:38
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Markdown as MD, loadingIfNoStates} from 'pages/index/base/'
//#endregion

@inject('app')
@loadingIfNoStates({required: 'content'})
export class Markdown extends PageComponent<any, any> {
  state = {
    title: '',
    content: null
  }

  async componentWillMount() {
    let {file} = this.app.location.query

    let content = '# 没有文件'

    if (file) {
      let res = await fetch(file)
      content = await res.text()
    }

    let title = content.trim().split(/\r?\n/)[0].replace(/^#*/, '')
    this.setState({content, title})
  }

  render() {
    let {content, title} = this.state
    return (
      <Page name='Markdown' title={title}>
        <MD source={content} />
      </Page>
    )
  }
}
