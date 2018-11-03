/**
 * Create by Mora at 2017-12-18 11:19
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Markdown} from 'widget/Markdown'

import './styles/AcademyHome.scss'
//#endregion

@page
export class AcademyHome extends PageComponent {
  render() {
    return (
      <Page name='AcademyHome'>
        <Markdown url='/p/form/academy/home.md' />
      </Page>
    )
  }
}
