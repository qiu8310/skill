/**
 * Create by Mora at 2017-12-18 11:18
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {TransitionRoutePage} from 'common/widget/TransitionRoutePage'

import './styles/Academy.scss'

//#endregion

@page
export class Academy extends PageComponent {
  render() {
    let {rp} = this
    return (
      <Page name='Academy'>

        <TransitionRoutePage pages={[
          rp.AcademyHome,
          rp.AcademyActivity,
          rp.AcademyBBS,
          rp.AcademyLibrary,
          rp.AcademyMy,
          rp.AcademyUser
        ]} />

      </Page>
    )
  }
}
