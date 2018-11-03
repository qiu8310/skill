import * as React from 'react'
import {WrappedFormUtils, History} from 'admin/base/interface'

import {IFormItem, renderForm} from 'admin/base/form'
import {Table, Pagination, Form, Button} from 'antd'
import {ColumnProps} from 'antd/es/table/Column'
import {TableRowSelection} from 'antd/es/table/Table'

import {shallowEqual, autobind, classSet, buildSearch} from 'mora-common'

import {Component} from './Component'
import {IAppComponentProps} from 'mobx/AdminApp'

export interface IColumnProps extends ColumnProps<any> {
  hidden?: boolean
}

export type IColumns = IColumnProps[]
export type IRowSelection = TableRowSelection<any>
export type IFormItems = IFormItem[]

// https://github.com/Microsoft/TypeScript/issues/6413
// optinonal abstract class properties
export interface ListComponent<T> {
  formItems?: IFormItems
  rowSelection?: IRowSelection
}

export abstract class ListComponent<T> extends Component<T & IAppComponentProps> {
  abstract columns: IColumns
  abstract fetch(): void

  arrayParameterSeparater = '_'
  arrayParameters: string[] = []
  integerParameters: string[] = []
  booleanParameters: string[] = []

  saveParametersToURL: boolean = true   // 是否将搜索的参数保存到 URL 上（如果保存在 url 上需要 props 中有 history
  savedParamaters: any = {}          // saveParametersToURL 为 false 时需要用此字段

  noPager = false
  defaultPager = {
    page: 1,
    pageSize: 10
  }
  state = {
    total: 0,
    loading: false,
    dataSource: []
  }

  get hasForm() {
    let {form} = this
    return form && ('setFieldsValue' in form) && ('validateFieldsAndScroll' in form)
  }

  get form(): WrappedFormUtils {
    return (this.props as any).form
  }

  get history(): History {
    let props: any = this.props
    return props.history || props.app.history
  }
  get location() {
    return this.props.app.location
  }

  @autobind private onTableChange(pageInfo, filter, sorter) {
    let { pageSize, current: page } = pageInfo
    let params: any = { page, pageSize }
    if (sorter && sorter.columnKey) {
      params._sKey = sorter.columnKey
      params._sOrder = sorter.order
    }
    this.onSearch(null, params)
  }

  @autobind private onPageChange(page) {
    this.onSearch(null, {page, pageSize: this.query.pageSize})
  }

  @autobind onPageSizeChange(page, pageSize) {
    this.onSearch(null, {page: 1, pageSize})
  }

  @autobind onSearch(e, pager) {
    if (e) {
      e.preventDefault()
      // antd 的 Form 的 onSubmit 事件第二个参数也是个 event
      pager = {page: 1, pageSize: this.query.pageSize || this.defaultPager.pageSize}
    }

    if (this.hasForm) {
      this.form.validateFieldsAndScroll((errors, data) => {
        if (errors) return false
        if (pager) data = {...data, ...pager}
        this.search(data)
      })
    } else {
      // 没有 form，只需要分页即可
      this.search({...pager})
    }
  }

  search(data: any) {
    if (this.saveParametersToURL) {
      let query = {}
      Object.keys(data).forEach(k => {
        if (data[k]) {
          if (Array.isArray(data[k]) && this.arrayParameters.indexOf(k) >= 0) {
            data[k] = data[k].join(this.arrayParameterSeparater)
          }
          query[k] = encodeURIComponent(data[k])
        }
      })
      let {location: {pathname, search}} = this
      let newSearch = buildSearch(query)
      if (newSearch !== search) {
        this.history.push({pathname, search: newSearch})
      }
    } else {
      this.savedParamaters = Object.keys(data).reduce((res, key) => {
        if (data[key] !== undefined) res[key] = data[key]
        return res
      }, {})
      this.fetch()
    }
  }

  /**
   * 根据定义的 arrayParameters，integerParameters，booleanParameters 对 query 进行解析，获取到转化后的 query
   */
  parseQuery(query: Object): Object {
    query = {...this.defaultPager, ...query}
    let result = {}
    Object.keys(query).forEach(k => {
      let v = query[k]
      if (v) {
        v = decodeURIComponent(v)
        if (this.integerParameters.indexOf(k) >= 0 || (k in this.defaultPager)) {
          result[k] = parseInt(v, 10)
        } else if (this.arrayParameters.indexOf(k) >= 0) {
          result[k] = v.split(this.arrayParameterSeparater)
        } else if (this.booleanParameters.indexOf(k) >= 0) {
          result[k] = query[k] === '' || ['no', 'false'].indexOf(query[k]) < 0
        } else {
          result[k] = v
        }
      }
    })
    return result
  }

  lastQuery: any = null
  get query(): any {
    return this.saveParametersToURL ? this.parseQuery(this.location.query) : {...this.defaultPager, ...this.savedParamaters}
  }

  get formProps() {
    return {
      layout: 'inline',
      onSubmit: this.onSearch,
      style: {marginBottom: 24}
    }
  }

  get pageProps() {
    let {page, pageSize} = this.query
    let {total} = this.state
    return {
      current: page,
      pageSize,
      total,
      showTotal: t => `共 ${t} 条`,
      showSizeChanger: true,
      showQuickJumper: true
    }
  }

  get tableProps() {
    let {onTableChange, columns, state: {dataSource, loading}} = this
    return {
      size: 'small' as any,
      bordered: true,
      pagination: this.noPager ? false : this.pageProps,
      // pagination: false,
      onChange: onTableChange,
      columns,
      dataSource: dataSource && dataSource.map(d => { if (!d.key) d.key = d.id; return d }),
      loading
    }
  }

  componentDidMount() {
    this.lastQuery = this.query
    this.fetch()
  }

  componentDidUpdate(prevProps, prevState) {
    let {query, lastQuery} = this
    this.lastQuery = query

    // 用户手动更新 url 上的参数
    if (this.saveParametersToURL && !shallowEqual(query, lastQuery)) {
      if (this.hasForm) {
        this.form.setFieldsValue(
          (this.formItems || []).reduce((data, {key}) => {
            let value = query[key]
            // @FIXED antd 的 Select 的 value 只能是 string
            data[key] = this.integerParameters.indexOf(key) >= 0 && typeof value !== 'undefined' ? value.toString() : value
            return data
          }, {})
        )
      }

      let page = this.justifyInvalidPage()

      if (page) this.history.push(page)
      else this.fetch()
    }
  }

  private justifyInvalidPage(): any {
    // 如果指定了 page=1000&pageSize=10 这种不存在的 page 在 url 上， antd 的分页组件只会显示最后一个有效的页面
    // 这样就导致不管用户怎么刷新页面都是空的内容
    if (this.saveParametersToURL) {
      let {state: {total}, query: {page, pageSize}} = this
      if (total && pageSize * (page - 1) >= total) {
        let {location: {pathname, query}} = this
        let searchData = {...query, page: Math.ceil(total / pageSize)}
        return {pathname, search: buildSearch(searchData as any)}
      }
    }
  }

  renderFilterForm(): React.ReactNode {
    let {query} = this
    let items: IFormItem[] = this.formItems

    if (!items || !items.length) return null

    let data = {}
    Object.keys(query).forEach(key => (data[key] = this.integerParameters.indexOf(key) >= 0 ? query[key].toString() : query[key]))

    return <Form {...(this.formProps as any)}>
      {renderForm(items, {layout: false, data, wrap: false, footer: <Button size='large' type='primary' htmlType='submit'>搜索</Button>}, this)}
    </Form>
  }

  renderTable(props = {}) {
    let {columns, rowSelection} = this
    columns = columns.filter(c => !c.hidden)
    return <Table {...this.tableProps} {...({columns, rowSelection})} {...props} />
  }

  renderPage(rootProps: any = {}) {
    let {onPageChange, onPageSizeChange, pageProps} = this
    let props = {
      onChange: onPageChange,
      onShowSizeChange: onPageSizeChange
    }
    rootProps.className = classSet('gClearfix', rootProps.className)
    return <div style={{margin: '16px 0'}} {...rootProps}>
      <Pagination className='gPullRight' {...props} {...pageProps} />
    </div>
  }

  render() {
    return (
      <div className='ListComponent'>
        {this.renderFilterForm()}
        {this.renderTable()}
      </div>
    )
  }
}
