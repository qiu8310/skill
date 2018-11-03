/**
 * Create by Mora at 2017-12-01 16:03
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Markdown} from 'pages/trydesignlab/base/'
//#endregion

@inject('app')
export class ApplySuccess extends PageComponent<any, any> {
  render() {
    let {app} = this
    return (
      <Page name='ApplySuccess' title={app.config.appName}>
        <Markdown url='/p/trydesignlab/apply-success.md' wrap resolveText />
      </Page>
    )
  }
}
