/**
 * Create by Mora at 2017-10-01 11:12
 * All right reserved
 */

import {React, PageComponent, Page, page} from './base'

@page
export class NotFound extends PageComponent<any, any> {
  render() {
    return (
      <Page name='NotFound' title={'404 Not Found'}>
        <h2 className='gTextCenter'>404 Not Found</h2>
      </Page>
    )
  }
}
