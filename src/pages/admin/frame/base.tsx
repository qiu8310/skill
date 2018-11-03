import {HTML, IHTMLPRops, capitalize} from 'mora-common'
import {React, ListComponent, RouteComponent, Page, IFormItem, IFormItems, IColumnProps, IPageProps, TagSelect, Select, formatDate, autobind, classSet} from 'admin/'
import {PAGE} from 'pages/admin/config/'
import {Modal, Button} from 'antd'

interface PageComponent {
  key: string
  uKey: string
}

type IRender = (v, item?) => string | JSX.Element
type ICellRender = (...args) => IRender

export abstract class PageListComponent extends ListComponent<IPageProps> implements PageComponent {
  abstract key: string
  get uKey() { return capitalize(this.key) }
  canAddItem = true
  hasDetailPage = true
  api = this.props.app.api
  params = this.props.match.params
  PAGE = PAGE
  prefixBreadcrumb = []

  getBreadcrumb() {
    this.props.app.breadcrumb = [...this.prefixBreadcrumb, {title: PAGE[this.uKey + 'List'].title}]
  }
  componentWillMount() {
    this.getBreadcrumb()
  }

  get ops(): IColumnProps {
    return {title: '', width: 120, render: this.cellOptsRender()}
  }

  cellDatetimeRender: ICellRender = () => v => v ? formatDate(new Date(v), this.props.app.config.dateFormat) : ''
  cellHtmlRender =  (props: IHTMLPRops = {}) => v => v ? <HTML value={v} fromEditor lineClamp={3} {...props} /> : ''
  cellOptsRender: ICellRender = () => {
    return v => {
      let {key, uKey, history, props: {app}} = this
      let keyId = key + 'Id'

      let onShow = () => history.push(PAGE[`${uKey}Show`].getLink({params: {...this.params, [keyId]: v.id}}))
      let onEdit = () => history.push(PAGE[`${uKey}Edit`].getLink({params: {...this.params, [keyId]: v.id}}))
      let onDel = () => {
        Modal.confirm({
          title: `确认删除吗`,
          onOk: () => {
            this.setState({deleting: v})
            app.api[`del${this.uKey}`]({[keyId]: v.id})
              .then(() => {
                this.setState({deleting: null, dataSource: this.state.dataSource.filter(it => it.id !== v.id)})
              })
          }
        })
      }

      let disabled = this.getNullableState('deleting') === v
      let className = classSet({gDisabled: disabled})
      return <div>
        {this.hasDetailPage && <a className={className} onClick={onShow}>查看</a>}
        {this.hasDetailPage && <span>&nbsp;|&nbsp;</span>}
        <a className={className} onClick={onEdit}>编辑</a>
        &nbsp;|&nbsp;
        <a className={className} onClick={onDel}>删除</a>
      </div>
    }
  }
  cellImgRender: ICellRender = (width: number, height: number) => {
    return v => v ? <img style={{display: 'block'}} src={v} width={width} height={height} /> : ''
  }
  cellArrayRender: ICellRender = (key: string) => {
    return v => v && v.length ? v.map(i => i[key]).join(',') : ''
  }

  fetch() {
    this.doLoading()
    let {query} = this
    if (query && query.page) {
      query.pageNum = query.page
      delete query.page
    }
    this.api[`get${this.uKey}List`]({query, params: this.params}).then((data) => {
      if (Array.isArray(data)) { // 后台返回一个数组，说明此接口不需要分页
        this.doneLoading({dataSource: data})
      } else {
        let {items: dataSource, total} = data
        this.doneLoading({dataSource, total})
      }
    })
  }

  @autobind gotoAddPage() {
    this.props.app.gotoLink(PAGE[this.uKey + 'Add'].getLink({params: this.params}))
  }

  render() {
    return <Page name={this.uKey + 'List'}>
      {this.renderFilterForm()}
      {this.renderTable()}
      {!this.state.loading && this.canAddItem && <Button type='primary' style={{position: 'relative', top: this.noPager ? 16 : -41}} onClick={this.gotoAddPage}>添加条目</Button>}
    </Page>
  }
}

export interface PageItemComponent {
  mapItem<T>(item: T): T
}

export abstract class PageItemComponent extends RouteComponent<IPageProps> implements PageComponent {
  abstract key: string
  abstract action: 'edit' | 'add' | 'show' | string
  abstract formItems: IFormItems
  hasDetailPage = true
  api = this.props.app.api
  PAGE = PAGE
  prefixBreadcrumb = []

  get label() { return PAGE[this.uKey + capitalize(this.action)].title }
  get uKey() { return capitalize(this.key) }
  get keyId() { return this.key + 'Id' }
  get keyIdValue() { return parseInt(this.params[this.keyId], 10) }

  get careerIdsFormItem(): IFormItem {
    return {key: 'careerIds', required: true, label: '所属职业', component: <Select mode='multiple' allowClear api={this.api.getCareerList} />}
   }
  get tagListFormItem(): IFormItem  {
    return {key: 'tagList', label: '标签', component: <TagSelect />}
  }
  getItem() {
    this.setState({loadingItem: true})
    let {uKey, keyId, keyIdValue} = this
    this.api['get' + uKey]({query: {[keyId]: keyIdValue}, params: this.params})
      .then(data => this.setState({loadingItem: false, data: this.mapItem ? this.mapItem(data) : data}))
  }

  isLoadingItem() {
    return this.getNullableState('loadingItem')
  }

  getBreadcrumb() {
    let pageKey = this.uKey + 'List'
    this.props.app.breadcrumb = [
      ...this.prefixBreadcrumb,
      {title: PAGE[pageKey].title, link: PAGE[pageKey].getLink({params: this.params})},
      {title: this.label}
    ]
  }
  componentWillMount() {
    this.getBreadcrumb()
    if (this.action === 'edit' || this.action === 'show' && this.hasDetailPage) {
      this.getItem()
    }
  }

  beforeSubmitData(data) {
    return data
  }
  afterSubmitData(data, rtnData, done: () => void) {
    return done()
  }
  onSubmit(data) {
    this.doLoading()
    let {keyId, uKey, keyIdValue, formItems, props: {app}} = this

    if (formItems.find(i => i.key === 'tagList')) {
      let {tagList = [], ...rest} = data
      rest.tagIds = tagList.map(t => t.id)
      data = rest
    }

    data = this.beforeSubmitData(data)
    let next = () => {
      if (this.action === 'edit') {
        app.api['set' + uKey]({...data, id: keyIdValue, [keyId]: keyIdValue})
          .then((rtn) => {
            this.afterSubmitData(data, rtn, () => this.goBack({message: '修改成功'}))
          })
          .catch(this.doneLoading)
      } else if (this.action === 'add') {
        app.api['add' + uKey]({data, params: this.params})
          .then(id => {
            this.afterSubmitData(data, id, () => this.gotoLink(PAGE[this.uKey + 'Show'].getLink({params: {...this.params, [keyId]: id}}), {message: '添加成功'}))
          })
          .catch(this.doneLoading)
      }
    }

    if (data && typeof data === 'function') {
      data.then(next, e => Modal.error({title: e.message}))
    } else {
      next()
    }
  }

  beforeRenderData(data) {
    return data
  }
  render() {
    if (this.isLoadingItem()) return this.renderLoading()
    let {data} = this.state || {data: null}
    let {uKey, action} = this
    let uAction = capitalize(action)
    data = this.beforeRenderData(data)
    if (action === 'show') {
      return <Page name={uKey + uAction}>
        {Object.keys(data).map(k => <div key={k}>
          <span style={{display: 'inline-block', width: 200, textAlign: 'right', marginRight: 20}}>{k}</span>
          <span style={{display: 'inline-block'}}>{data[k]}</span>
        </div>)}
      </Page>
    } else if (this.formItems) {
      return <Page name={uKey + uAction}>{this.renderForm(this.formItems, {data})}</Page>
    }
  }
}

export * from 'admin/'
