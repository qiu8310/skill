/**
 * Create by Mora at 2017-11-09 16:07
 * All right reserved
 */

//#region import
import {MarkdownPageComponent, inject} from 'pages/index/base/'
//#endregion

@inject('app')
export class CareerDetailV3 extends MarkdownPageComponent<{careerId: string}> {
  url = `/p/v3/${this.params.careerId}/detail.md`
  pageName = 'CareerDetailV3'
  pageTitle = this.rp.CareerDetailV3.title
}
