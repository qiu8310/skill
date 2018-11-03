/**
 * Create by Mora at 2017-12-18 11:19
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, page} from 'mobx/FormApp'
import {Image} from 'mora-common'
import {jsonfy} from 'common/'
import {Markdown} from 'widget/Markdown'
import {ProgressBar} from 'widget/ProgressBar'
const SearchBar = require('react-weui/build/packages/components/searchbar/')

import './styles/AcademyActivity.scss'
//#endregion

interface IData {
  cover: string
  groups: IGroup[]
}

interface IGroup {
  label: string
  activites: IActivity[]
}

interface IActivity {
  tag: string
  desc: string
  days: number
  title: string
  booked: string
  time: string
  address: string
}

@page
export class AcademyActivity extends PageComponent {
  state: {data: IData} = {
    data: null
  }
  onMarkdown = (source: string, root: HTMLDivElement, data) => {
    data.groups = root.querySelectorAll('.level-2')
      .map((div: HTMLDivElement) => {
        let label = div.querySelector('h2').textContent
        let activites = div.querySelectorAll('li').map((li: HTMLLIElement) => jsonfy(li.textContent, 'title', 'desc'))
        return {label, activites}
      })

    this.setState({data})
    return false
  }

  renderGroups(groups: IGroup[]) {
    return <div className='categories'>
      {groups.map((d, i) => <div key={i}>{this.renderData(d, i)}</div>)}
    </div>
  }

  renderData(group: IGroup, index: number) {
    return <div className='category'>
      <h3><span className='categoryLabel'>{group.label}</span>{index === 0 ? <span className='gPullRight filter'>学院 类型 地点 <i className='fas fa-angle-right' /></span> : null}</h3>
      <ul className='events'>
        {group.activites.map((a, i) => <li key={i} className='event'>{this.renderActivity(a)}</li>)}
      </ul>
      {index === 0 ? null : <a className='seeall'>查看更多 <i className='fas fa-angle-right' /></a>}
    </div>
  }

  renderActivity(a: IActivity) {
    let progress = parseInt(a.booked, 10)
    return <div className='activity'>

      <div className='tag'>{a.tag}</div>

      <div className='gFlexContainer'>
        <div className='gFlex info'>
          <h4 className='gEllipsis'>{a.title}</h4>
          {a.desc && <p className='desc gLineClamp gLineClamp2'>{a.desc}</p>}
          {a.time && <p className='time'><i className='far fa-clock' />{a.time}</p>}
          {a.address && <p className='address'><i className='fas fa-map-marker-alt' />{a.address}</p>}
        </div>
        <div className='days'>
          <p className='d1'>START IN</p>
          <p className='d2'>{a.days}</p>
          <p className='d3'>days</p>
        </div>
      </div>

      <div className='booked gFlexContainer'>
        <ProgressBar className='bar gFlex' thickness={10} fgColor={'#1DBFB2'} bgColor={'whitesmoke'} progress={progress} />
        <p className='v'>{a.booked} booked</p>
      </div>

    </div>
  }

  render() {
    const {data} = this.state
    if (!data) return <Markdown url='/p/form/academy/activity.md' resolveText wrap onMarkdown={this.onMarkdown} />
    return (
      <Page name='AcademyActivity'>
        <SearchBar />
        {data.cover && <Image src={data.cover} width={'100%'} />}
        {this.renderGroups(data.groups)}
        <div className='weui-loadmore weui-loadmore_line'>
            <span className='weui-loadmore__tips'>下拉显示更多</span>
        </div>
      </Page>
    )
  }
}
