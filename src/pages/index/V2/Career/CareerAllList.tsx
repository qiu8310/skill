/**
 * Create by Mora at 2017-10-18 14:30
 * All right reserved
 */

//#region import
import {Modal} from 'mora-common'
import {React, PageComponent, Page, inject, Button, classSet} from 'pages/index/base'
import {Menu} from '../../widget/Menu'
import {CareerCard} from '../../widget/CareerCard'
import {Progress} from '../../widget/Progress'
import {Scroller} from 'widget/InfiniteScroller/index'

import './styles/CareerAllList.scss'
//#endregion

@inject('app')
export class CareerAllList extends PageComponent<any, any> {
  state = {
    showFilter: false,
    filter: {},
    total: 0
  }

  get hasFilter() {
    return !!Object.keys(this.state.filter).length
  }

  load = async (query) => {
    let {hasFilter} = this
    let {items, hasNext, total} = hasFilter ? (await this.api.getCareerListByFilter(query)) : (await this.api.getCareerList(query))
    if (!query.page || query.page === 1) this.setState({total}) // 只需要在第一次设置 total 即可
    return {items, loadable: hasNext}
  }
  itemRender = item => <CareerCard career={item} />

  get filterTrigger() {
    let {hasFilter} = this
    return (
     <div className={classSet('filterTrigger', {gSpaceBetweenChildren: hasFilter})}>
       {hasFilter && <p>筛选得到{this.state.total}个职业</p>}
       <a onClick={() => this.setState({showFilter: true})}>筛选职业</a>
     </div>
    )
  }

  render() {
    const {showFilter, filter} = this.state
    return (
      <Page name='CareerAllList' title='职业大未来'>
        <Menu extraHead={this.filterTrigger}>
          <Scroller store={window} storeKey='CareerAllList' load={this.load} params={filter} render={this.itemRender} />
        </Menu>
        {showFilter && <Modal nowrap>
          <Filter
            data={filter}
            onCancel={() => this.setState({showFilter: false})}
            onFilter={data => this.setState({showFilter: false, filter: data})}
          />
        </Modal>}
      </Page>
    )
  }
}

interface IFilterProps {
  data?: any
  onCancel?: () => void
  onFilter: (data: any) => void
}

class Filter extends React.PureComponent<IFilterProps, any> {
  state = {
    form: this.props.data
  }

  items: any = [
    {type: 'switch', label: '男女比例', key: 'moreBoy', choices: [
      {label: '汉子多', value: 'true'},
      {label: '妹子多', value: 'false'},
    ]},
    {type: 'progress', label: '操劳指数', key: 'degreeOfOvertime'},
    {type: 'progress', label: '入行门槛', key: 'careerJoinThreshold'},
  ]

  updateSwitch = (key, value) => () => this.update(key, value, this.state.form[key] === value)
  updateProgress = (key) => (value) => this.update(key, value, value === -3)

  update(key: string, value: any, isDelete: boolean) {
    const {form} = this.state
    if (isDelete) {
      delete form[key]
      this.setState({form: {...form}})
    } else {
      this.setState({form: {...form, [key]: value}})
    }
  }

  renderSwitch(it) {
    const {form} = this.state
    return (
      <div className='choices gFlexContainer gSpaceBetweenChildren'>
        {it.choices.map(c => (
          <div
            key={c.value}
            onClick={this.updateSwitch(it.key, c.value)}
            className={classSet('choice', {active: form[it.key] === c.value})}
          >
            {c.label}
          </div>
        ))}
      </div>
    )
  }
  renderProgress(it) {
    const {form} = this.state
    return <Progress value={form[it.key] == null ? -3 : form[it.key]} min={-3} max={2} onChange={this.updateProgress(it.key)} />
  }

  render() {
    const {form} = this.state

    return <div className='wFilter'>
      {this.items.map((it, i) => (
        <div className='item' key={i}>
          <label className='label'>{it.label}</label>
          {it.type === 'switch' && this.renderSwitch(it)}
          {it.type === 'progress' && this.renderProgress(it)}
        </div>
      ))}

      <div className='opts'>
        <Button onClick={() => this.props.onFilter(form)} center width={160} height={34} style={{borderRadius: p2r(17)}}>筛选</Button>
        <a className='cancel' onClick={this.props.onCancel}>取消</a>
      </div>
    </div>
  }
}

