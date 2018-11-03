/**
 * Create by Mora at 2017-11-28 11:36
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Markdown} from 'pages/trydesignlab/base/'
import {Player} from './Player'
//#endregion

@inject('app')
export class CourseLectures extends PageComponent<{unitId: string, lessonId: string}, any> {
  onNext = (current: number, total: number) => {
    let {unitId, lessonId} = this.params
    this.app.setProgress(unitId, lessonId, Math.round((current + 1) * 100 / total))
  }

  onMarkdown = () => {
    let root = document.querySelector('.gMarkdown')
    let html = root.innerHTML

    let htmls = html.split(/<hr\s*\/?>/).filter(s => s.trim())
    return <Player htmls={htmls} onNext={this.onNext} back={() => this.app.goBack()} />
  }
  render() {
    let {rp} = this
    return (
      <Page name='CourseLectures' title={rp.CourseLectures.title}>
        <Markdown
          url={this.app.location.query.file}
          onMarkdown={this.onMarkdown}
        />
      </Page>
    )
  }
}
