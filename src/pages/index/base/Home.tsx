/**
 * Create by Mora at 2017-11-14 10:17
 * All right reserved
 */

//#region import
import {React, PageComponent, inject} from 'pages/index/base/'
import {Redirect} from 'react-router-dom'
//#endregion

@inject('app')
export class Home extends PageComponent<any, any> {
  render() {
    return (
      <Redirect to={this.rp.StartUpV3.link()} />
    )
  }
}
