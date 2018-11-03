/**
 * Create by Mora at 2017-12-01 14:37
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Markdown} from 'pages/trydesignlab/base/'
import {buildSearch} from 'mora-common'

import './styles/Apply.scss'
//#endregion

@inject('app')
export class Apply extends PageComponent<any, any> {
  onClick = async (e: React.MouseEvent<any>) => {
    let el = (e.target as HTMLElement).closest('.button')
    if (!el) return

    let data = {}
    let error = false
    document.querySelectorAll('.control input').forEach((input: HTMLInputElement) => {
      let {name, value} = input
      if (!value && !error) {
        window.alert(input.previousElementSibling.textContent)
        error = true
      }
      data[name] = value
    })

    if (!error) {
      let res = await fetch('/design/enroll' + buildSearch(data))
      if (res.status !== 200) {
        return window.alert(res.statusText)
      }
      let r = await res.json()
      if (r.error) {
        window.alert(r.error)
      } else {
        this.app.gotoLink(this.rp.ApplySuccess.link())
      }
    }
  }

  render() {
    let {app} = this
    return (
      <Page name='Apply' title={app.config.appName}>
        <Markdown url='/p/trydesignlab/apply.md' wrap resolveText onClickContent={this.onClick} />
      </Page>
    )
  }
}
