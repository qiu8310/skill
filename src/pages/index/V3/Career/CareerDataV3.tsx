/**
 * Create by Mora at 2017-11-09 16:32
 * All right reserved
 */

//#region import
import {MarkdownPageComponent, inject} from 'pages/index/base/'
//#endregion

@inject('app')
export class CareerDataV3 extends MarkdownPageComponent<{careerId: string}> {
  url = `/p/v3/${this.params.careerId}/data.md`
  pageName = 'CareerDataV3'
  pageTitle = this.rp.CareerDataV3.title
}
