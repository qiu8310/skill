/**
 * Create by Mora at 2017-11-29 17:13
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Markdown} from 'pages/trydesignlab/base/'
//#endregion

@inject('app')
export class CourseProject extends PageComponent<any, any> {
  render() {
    let {rp} = this
    return (
      <Page name='CourseProject' title={rp.CourseProject.title}>
        <Markdown
          url={this.app.location.query.file}
        />
      </Page>
    )
  }
}
